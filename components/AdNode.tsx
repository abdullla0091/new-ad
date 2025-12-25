import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AdNodeData } from '../types';
import { cn } from '../lib/utils';
import {
    Globe,
    RefreshCw,
    Type,
    Download,
    Copy,
    Check
} from 'lucide-react';

interface AdNodeProps {
    data: AdNodeData;
    selected: boolean;
    scale: number;
    onSelect: (id: string, multi: boolean) => void;
    onMove?: (id: string, x: number, y: number) => void;
    onResize?: (id: string, width: number, height: number) => void;
    style?: React.CSSProperties;
    className?: string;
    onGenerateCaptions?: (id: string) => void;
    onRemix?: (id: string) => void;
    onPublish?: (id: string) => void;
}

export const AdNode: React.FC<AdNodeProps> = ({
    data,
    selected,
    scale,
    onSelect,
    onMove,
    onResize,
    style,
    className,
    onGenerateCaptions,
    onRemix,
    onPublish
}) => {
    const isRelative = style?.position === 'relative';
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);
    const isCaptionNode = data.type === 'caption';

    // Dragging & Resizing State
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStartRef = useRef<{ x: number, y: number, initialX: number, initialY: number, initialW: number, initialH: number }>({ x: 0, y: 0, initialX: 0, initialY: 0, initialW: 0, initialH: 0 });
    const hasMoved = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isRelative || (e.target as HTMLElement).closest('button, select, input, .no-drag')) return;

        e.stopPropagation();
        onSelect(data.id, e.shiftKey);

        setIsDragging(true);
        hasMoved.current = false;
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            initialX: data.x,
            initialY: data.y,
            initialW: 0, initialH: 0
        };
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            initialX: 0, initialY: 0,
            initialW: data.width || 320,
            initialH: data.height || 0
        };
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(data.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const handleWindowMove = (e: MouseEvent) => {
            if (isDragging && onMove) {
                e.preventDefault();
                const dx = (e.clientX - dragStartRef.current.x) / scale;
                const dy = (e.clientY - dragStartRef.current.y) / scale;
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) hasMoved.current = true;
                onMove(data.id, dragStartRef.current.initialX + dx, dragStartRef.current.initialY + dy);
            }
            if (isResizing && onResize) {
                e.preventDefault();
                const dx = (e.clientX - dragStartRef.current.x) / scale;
                const newWidth = Math.max(280, dragStartRef.current.initialW + dx);
                onResize(data.id, newWidth, 0);
            }
        };

        const handleWindowUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleWindowMove);
            window.addEventListener('mouseup', handleWindowUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleWindowMove);
            window.removeEventListener('mouseup', handleWindowUp);
        };
    }, [isDragging, isResizing, data.id, onMove, onResize, scale]);

    const isLoading = data.meta?.loading;

    return (
        <motion.div
            className={cn(className || 'absolute', 'group flex flex-col')}
            style={{
                ...style,
                left: isRelative ? undefined : data.x,
                top: isRelative ? undefined : data.y,
                width: style?.width || data.width || 320,
                cursor: isDragging ? 'grabbing' : 'default',
                zIndex: isDragging ? 50 : (selected ? 40 : 10),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={handleMouseDown}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >

            {/* Frame Label */}
            {!isRelative && (
                <motion.div
                    className={cn(
                        "absolute -top-7 left-0 flex items-center gap-2 select-none px-1 transition-opacity duration-200",
                        (selected || isHovered) ? 'opacity-100' : 'opacity-0'
                    )}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: (selected || isHovered) ? 1 : 0, y: 0 }}
                >
                    <span className={cn(
                        "text-[11px] font-medium transition-colors",
                        selected ? 'text-[#0084FF]' : 'text-zinc-500'
                    )}>
                        {isCaptionNode ? 'Copy' : (data.meta?.angle || 'Frame')}
                    </span>
                    {selected && (
                        <span className="text-[9px] text-zinc-600 font-mono">
                            {Math.round(data.width || 320)}px
                        </span>
                    )}
                </motion.div>
            )}

            {/* Main Card Body */}
            <div
                className={cn(
                    "relative flex flex-col overflow-hidden transition-all duration-200 rounded-xl",
                    "node-shadow",
                    selected && "node-shadow-selected",
                    isCaptionNode
                        ? 'bg-[#141414] border border-white/10'
                        : 'bg-[#0d0d0d]'
                )}
                style={{ minHeight: isCaptionNode ? 150 : undefined }}
            >

                {/* Action Toolbar */}
                {!isLoading && !isCaptionNode && (
                    <motion.div
                        className="absolute top-3 right-3 flex gap-2 z-30"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: isHovered || selected ? 1 : 0, y: isHovered || selected ? 0 : -5 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Publish to Gallery */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onPublish?.(data.id); }}
                            className="h-8 w-8 bg-white text-black rounded-lg flex items-center justify-center hover:bg-zinc-100 shadow-md active:scale-95 transition-all no-drag"
                            title="Publish to Gallery"
                        >
                            <Globe className="w-4 h-4" />
                        </button>

                        {/* Remix Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemix?.(data.id); }}
                            className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#0084FF] hover:border-transparent shadow-md active:scale-95 transition-all no-drag"
                            title="Remix"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>

                        {/* Caption Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onGenerateCaptions?.(data.id); }}
                            className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#0084FF] hover:border-transparent shadow-md active:scale-95 transition-all no-drag"
                            title="Generate Copy"
                        >
                            <Type className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {/* Caption Node - Copy Button */}
                {isCaptionNode && !isLoading && (
                    <motion.div
                        className="absolute top-3 right-3 z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered || selected ? 1 : 0 }}
                    >
                        <button
                            onClick={handleCopy}
                            className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#0084FF] hover:border-transparent shadow-md active:scale-95 transition-all no-drag"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </motion.div>
                )}

                {/* Content Area */}
                <div className={cn(
                    "relative w-full flex items-center justify-center group/content cursor-default",
                    isCaptionNode ? 'p-5' : 'aspect-square'
                )}>

                    {/* Loading Skeleton */}
                    {isLoading ? (
                        <div className="absolute inset-0 z-20 bg-[#0d0d0d] p-6 flex flex-col justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="h-8 w-8 rounded-lg bg-white/5 animate-pulse"></div>
                                <div className="h-4 w-3/4 rounded-lg bg-white/5 animate-pulse"></div>
                            </div>
                            <div className="flex-1 my-4 rounded-xl border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 animate-shimmer"></div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#0084FF] animate-pulse"></div>
                                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
                                    Generating...
                                </span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Caption Node */}
                            {isCaptionNode ? (
                                <div className="flex flex-col w-full h-full text-left">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest flex items-center gap-2">
                                        <Type className="w-3.5 h-3.5" />
                                        {data.title}
                                    </h4>
                                    <p className="text-[13px] leading-relaxed text-zinc-300 font-sans whitespace-pre-wrap">
                                        {data.content}
                                    </p>
                                </div>
                            ) : (
                                // Image Node
                                <>
                                    {/* Transparency grid */}
                                    <div
                                        className="absolute inset-0 opacity-[0.02]"
                                        style={{
                                            backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                                            backgroundSize: '8px 8px',
                                            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                                        }}
                                    />

                                    {data.content.startsWith('data:image') ? (
                                        <img src={data.content} alt={data.title} className="w-full h-full object-contain z-10 pointer-events-none" />
                                    ) : (
                                        <div className="relative z-10 p-8 text-center max-w-[90%] flex flex-col items-center justify-center h-full">
                                            <p className="text-[12px] text-zinc-500 font-medium italic leading-relaxed">"{data.meta?.imagePrompt || "..."}"</p>
                                        </div>
                                    )}

                                    {/* Bottom Title Bar */}
                                    <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-[12px] text-white truncate max-w-[80%]">{data.title}</h3>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[10px] text-zinc-400">Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Selection Handles - Figma Style */}
            {selected && !isRelative && (
                <>
                    <motion.div
                        className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-sm bg-white border-2 border-[#0084FF] z-20 shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    />
                    <motion.div
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-sm bg-white border-2 border-[#0084FF] z-20 shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.05 }}
                    />
                    <motion.div
                        className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-sm bg-white border-2 border-[#0084FF] z-20 shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    />
                    <motion.div
                        className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-sm bg-white border-2 border-[#0084FF] z-20 cursor-nwse-resize shadow-md hover:scale-125 transition-transform no-drag"
                        onMouseDown={handleResizeMouseDown}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15 }}
                    />
                </>
            )}
        </motion.div>
    );
};