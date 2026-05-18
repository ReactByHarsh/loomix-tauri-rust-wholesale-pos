import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (!item.startsWith('--')) {
      continue;
    }

    const key = item.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args[key] = 'true';
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function walkFiles(rootDirectory) {
  const entries = fs.readdirSync(rootDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function detectArch(relativePath) {
  const normalized = relativePath.toLowerCase();

  if (normalized.includes('aarch64') || normalized.includes('arm64')) {
    return 'aarch64';
  }

  if (normalized.includes('x86_64') || normalized.includes('x64') || normalized.includes('amd64')) {
    return 'x86_64';
  }

  if (normalized.includes('i686') || normalized.includes('x86')) {
    return 'i686';
  }

  if (normalized.includes('armv7')) {
    return 'armv7';
  }

  switch (process.arch) {
    case 'arm64':
      return 'aarch64';
    case 'ia32':
      return 'i686';
    case 'arm':
      return 'armv7';
    default:
      return 'x86_64';
  }
}

function readReleaseNotes(args, projectRoot, version) {
  if (args['notes-file']) {
    const notesFile = path.resolve(projectRoot, args['notes-file']);
    return fs.readFileSync(notesFile, 'utf8').trim();
  }

  if (args.notes) {
    return args.notes.trim();
  }

  return `Release ${version}`;
}

function readVersion(projectRoot, args) {
  if (args.version) {
    return args.version;
  }

  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function detectArtifact(relativePath) {
  const normalized = relativePath.toLowerCase();

  // Match both 'nsis/foo.exe' (no leading slash) and '.../nsis/foo.exe'
  if (normalized.endsWith('.exe') && /(?:^|\/)nsis\//.test(normalized)) {
    return {
      platform: `windows-${detectArch(relativePath)}`,
      priority: 300,
    };
  }

  // Match both 'msi/foo.msi' (no leading slash) and '.../msi/foo.msi'
  if (normalized.endsWith('.msi') && /(?:^|\/)msi\//.test(normalized)) {
    return {
      platform: `windows-${detectArch(relativePath)}`,
      priority: 200,
    };
  }

  if (normalized.endsWith('.app.tar.gz')) {
    return {
      platform: `darwin-${detectArch(relativePath)}`,
      priority: 300,
    };
  }

  if (normalized.endsWith('.appimage')) {
    return {
      platform: `linux-${detectArch(relativePath)}`,
      priority: 300,
    };
  }

  return null;
}

function buildPlatformMap(bundleDir, baseUrl) {
  const files = walkFiles(bundleDir);
  const platforms = {};

  for (const absolutePath of files) {
    if (absolutePath.endsWith('.sig')) {
      continue;
    }

    const relativePath = toPosixPath(path.relative(bundleDir, absolutePath));
    const artifact = detectArtifact(relativePath);

    if (!artifact) {
      continue;
    }

    const signaturePath = `${absolutePath}.sig`;

    if (!fs.existsSync(signaturePath)) {
      throw new Error(`Missing signature for updater artifact: ${relativePath}`);
    }

    const current = platforms[artifact.platform];
    if (current && current.priority >= artifact.priority) {
      continue;
    }

    platforms[artifact.platform] = {
      priority: artifact.priority,
      signature: fs.readFileSync(signaturePath, 'utf8').trim(),
      url: new URL(relativePath, ensureTrailingSlash(baseUrl)).toString(),
    };
  }

  const finalized = {};

  for (const [platform, details] of Object.entries(platforms)) {
    finalized[platform] = {
      signature: details.signature,
      url: details.url,
    };
  }

  return finalized;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectRoot = process.cwd();
  const bundleDir = path.resolve(projectRoot, args['bundle-dir'] ?? 'src-tauri/target/release/bundle');
  const outputPath = path.resolve(projectRoot, args.output ?? 'updater/latest.json');
  const baseUrl = args['base-url'] ?? process.env.UPDATER_BASE_URL;

  if (!baseUrl) {
    throw new Error('Missing updater base URL. Use --base-url or set UPDATER_BASE_URL.');
  }

  if (!fs.existsSync(bundleDir)) {
    throw new Error(`Bundle directory not found: ${bundleDir}`);
  }

  const version = readVersion(projectRoot, args);
  const notes = readReleaseNotes(args, projectRoot, version);
  const pubDate = args['pub-date'] ?? new Date().toISOString();
  const platforms = buildPlatformMap(bundleDir, baseUrl);

  if (Object.keys(platforms).length === 0) {
    throw new Error(`No updater artifacts were detected under ${bundleDir}`);
  }

  const payload = {
    version,
    notes,
    pub_date: pubDate,
    platforms,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Generated ${outputPath}`);
  console.log(JSON.stringify(payload, null, 2));
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown updater JSON generation error';
  console.error(message);
  process.exit(1);
}
