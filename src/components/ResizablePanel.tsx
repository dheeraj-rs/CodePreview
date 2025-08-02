import React, { useState, useRef, useCallback } from 'react';

interface ResizablePanelProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
    initialLeftWidth?: number;
    minLeftWidth?: number;
    maxLeftWidth?: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
    leftPanel,
    rightPanel,
    initialLeftWidth = 50,
    minLeftWidth = 20,
    maxLeftWidth = 80,
}) => {
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        setLeftWidth(Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth));
    }, [isDragging, minLeftWidth, maxLeftWidth]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div ref={containerRef} className="flex h-full">
            <div
                className="flex-shrink-0 h-full"
                style={{ width: `${leftWidth}%` }}
            >
                {leftPanel}
            </div>
            
            <div
                className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative group"
                onMouseDown={handleMouseDown}
            >
                <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-500/20" />
            </div>
            
            <div
                className="flex-1 h-full"
                style={{ width: `${100 - leftWidth}%` }}
            >
                {rightPanel}
            </div>
        </div>
    );
};

export default ResizablePanel;