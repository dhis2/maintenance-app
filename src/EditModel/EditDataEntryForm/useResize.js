import { useRef, useCallback } from 'react';
import { clampPaletteWidth } from './clampPaletteWidth';

export const useResize = ({ paletteWidth, setPaletteWidth }) => {
    const startPosRef = useRef();
    const startWidthRef = useRef();
    const handleStartResize = e => {
        startPosRef.current = e.clientX;
        startWidthRef.current = paletteWidth;
        window.addEventListener('mousemove', handleDoResize);
        window.addEventListener('mouseup', handleEndResize);
    };
    // Need useCallback to ensure stable references to event handlers, allowing
    // use to then use removeEventListener
    const handleDoResize = useCallback(e => {
        if (!e.buttons) {
            // If no buttons are pressed it probably simply means we missed a mouseUp event - so stop resizing
            handleEndResize();
        }

        e.preventDefault();
        e.stopPropagation();

        const width = clampPaletteWidth(startWidthRef.current + (startPosRef.current - e.clientX));
        window.requestAnimationFrame(() => {
            setPaletteWidth(width);
        });
    }, []);
    const handleEndResize = useCallback(() => {
        window.removeEventListener('mousemove', handleDoResize);
        window.removeEventListener('mouseup', handleEndResize);
    }, []);

    return {
        onStartResize: handleStartResize,
    };
}
