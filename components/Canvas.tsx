import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AdNodeData, Wire } from '../types';
import { AdNode } from './AdNode';
import { cn } from '../lib/utils';
import { ZoomIn, ZoomOut, Maximize2, Move, Grid3X3 } from 'lucide-react';

interface CanvasProps {
  nodes: AdNodeData[];
  wires: Wire[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onCanvasClick: () => void;
  onGenerateCaptions: (id: string, language: string, style: string) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeResize: (id: string, width: number, height: number) => void;
  onRemix?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  wires,
  selectedIds,
  onSelectionChange,
  onCanvasClick,
  onGenerateCaptions,
  onNodeMove,
  onNodeResize,
  onRemix,
  onPublish
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Panning logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.group')) return;

    setIsPanning(true);
    setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    onCanvasClick();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setOffset({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom Logic
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.1, scale - e.deltaY * zoomSensitivity), 4);
      setScale(newScale);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const step = 0.1;
    if (direction === 'in') {
      setScale(Math.min(4, scale + step));
    } else {
      setScale(Math.max(0.1, scale - step));
    }
  };

  const resetView = () => {
    setScale(0.8);
    setOffset({ x: 0, y: 0 });
  };

  const getNodeCenter = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + (node.width || 320) / 2,
      y: node.y + (node.width || 320) * 0.5
    };
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative select-none canvas-dots"
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Canvas Content */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Wires */}
        <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible -z-10">
          <defs>
            <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0084FF" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="wire-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {wires.map(wire => {
            const start = getNodeCenter(wire.from);
            const end = getNodeCenter(wire.to);
            const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            const controlPointOffset = Math.min(dist * 0.5, 200);
            const path = `M ${start.x} ${start.y} C ${start.x} ${start.y + controlPointOffset}, ${end.x} ${end.y - controlPointOffset}, ${end.x} ${end.y}`;

            return (
              <g key={wire.id}>
                {/* Background glow */}
                <path
                  d={path}
                  stroke="rgba(0, 132, 255, 0.2)"
                  strokeWidth="8"
                  fill="none"
                  filter="url(#wire-glow)"
                />
                {/* Main wire */}
                <path
                  d={path}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Animated data flow */}
                <path
                  d={path}
                  stroke="url(#wire-gradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 8"
                  strokeLinecap="round"
                  className="animate-flow"
                />
                {/* Connection points */}
                <circle cx={start.x} cy={start.y} r="4" fill="#0084FF" />
                <circle cx={end.x} cy={end.y} r="4" fill="#8B5CF6" />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <AdNode
            key={node.id}
            data={node}
            scale={scale}
            selected={selectedIds.includes(node.id)}
            onSelect={(id, multi) => {
              if (multi) {
                onSelectionChange(selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id]);
              } else {
                onSelectionChange([id]);
              }
            }}
            onGenerateCaptions={onGenerateCaptions}
            onMove={onNodeMove}
            onResize={onNodeResize}
            onRemix={onRemix}
            onPublish={onPublish}
          />
        ))}
      </div>

      {/* Empty State */}
      {nodes.length === 0 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Grid3X3 className="w-10 h-10 text-zinc-700" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-600 mb-2">Empty Canvas</h3>
          <p className="text-sm text-zinc-700 max-w-[300px] text-center">
            Upload a product image and click "Generate Canvas" to start creating
          </p>
        </motion.div>
      )}

      {/* Bottom HUD - Figma Style */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1a1a1a]/90 backdrop-blur-lg text-white px-2 py-1.5 rounded-xl shadow-floating z-50 border border-white/10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Zoom Out */}
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Zoom Level */}
        <button
          onClick={resetView}
          className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 rounded-lg cursor-pointer transition-colors min-w-[50px]"
        >
          {Math.round(scale * 100)}%
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Fit to Screen */}
        <button
          onClick={resetView}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Item Count */}
        <div className="px-3 py-1.5 text-xs font-medium text-zinc-500 flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5" />
          {nodes.length} items
        </div>
      </motion.div>
    </div>
  );
};