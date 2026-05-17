import { useEffect, useRef } from 'react';

/**
 * useBarcodeListener
 * 
 * Listens for global keydown events. It buffers keystrokes and checks for an 'Enter' key.
 * If a sequence of characters is typed rapidly (typical of barcode scanners behaving as keyboard wedges),
 * it triggers the onScan callback.
 * 
 * @param onScan Callback function receiving the scanned barcode string
 * @param options Configuration options
 */
export function useBarcodeListener(
    onScan: (barcode: string) => void,
    options: { bufferTime?: number; minLength?: number } = {}
) {
    const { bufferTime = 50, minLength = 3 } = options;

    // Use refs to keep track of mutable state without re-triggering effects
    const buffer = useRef<string>('');
    const lastKeyTime = useRef<number>(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input, textarea, or contenteditable element
            const target = e.target as HTMLElement;
            const isTypingInInput = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;
            if (isTypingInInput) {
                return;
            }

            const currentTime = Date.now();

            // If the time between keystrokes is too long, reset the buffer (manual typing vs scan)
            // Scanners usually type characters with < 20-50ms intervals.
            if (currentTime - lastKeyTime.current > bufferTime) {
                buffer.current = '';
            }

            lastKeyTime.current = currentTime;

            if (e.key === 'Enter') {
                if (buffer.current.length >= minLength) {
                    onScan(buffer.current);
                    // Prevent default form submission if applicable
                    e.preventDefault();
                }
                buffer.current = '';
                return;
            }

            // Ignore non-character keys (Shift, Ctrl, etc.)
            if (e.key.length !== 1) return;

            buffer.current += e.key;
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onScan, bufferTime, minLength]);
}
