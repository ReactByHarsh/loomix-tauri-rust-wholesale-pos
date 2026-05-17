import fs from 'fs';
import pngToIco from 'png-to-ico';
import path from 'path';
import { Jimp } from 'jimp';

const input = path.join(process.cwd(), 'build', 'icon.png');
const output = path.join(process.cwd(), 'build', 'icon.ico');

console.log(`Reading ${input}...`);

async function convert() {
    try {
        const image = await Jimp.read(input);
        const pngBuffer = await image.getBuffer('image/png');

        console.log('Image read successfully. Converting to ICO...');
        const icoBuffer = await pngToIco(pngBuffer);

        fs.writeFileSync(output, icoBuffer);
        console.log('Conversion successful!');
    } catch (err) {
        console.error('Conversion failed:', err);
        process.exit(1);
    }
}

convert();
