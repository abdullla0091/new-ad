import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdNodeData } from '../types';
import { cn } from '../lib/utils';
import {
  Check,
  Image as ImageIcon,
  RefreshCw,
  Type,
  Globe,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Grid3X3
} from 'lucide-react';

interface MobileCanvasProps {
  nodes: AdNodeData[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onGenerateCaptions: (id: string) => void;
  onRemix?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export const MobileCanvas: React.FC<MobileCanvasProps> = ({
  nodes,
  selectedIds,
  onSelectionChange,
  onGenerateCaptions,
  onRemix,
  onPublish
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.85 + 16; // 85vw + gap
      container.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.85 + 16;
      const newIndex = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  // Empty State
  if (nodes.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Grid3X3 className="w-10 h-10 text-zinc-700" />
        </motion.div>
        <h3 className="text-lg font-semibold text-zinc-500 mb-2">No Creatives Yet</h3>
        <p className="text-sm text-zinc-600 max-w-[250px]">
          Tap the settings button below to upload a product and generate your first ad
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0a]">
      {/* Navigation Arrows & Counter */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            activeIndex === 0 ? "bg-white/5 text-zinc-600" : "bg-white/10 text-white"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{activeIndex + 1}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-sm text-zinc-500">{nodes.length}</span>
        </div>

        <button
          onClick={() => scrollToIndex(Math.min(nodes.length - 1, activeIndex + 1))}
          disabled={activeIndex === nodes.length - 1}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            activeIndex === nodes.length - 1 ? "bg-white/5 text-zinc-600" : "bg-white/10 text-white"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Cards Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory items-center px-4 gap-4 no-scrollbar"
        onScroll={handleScroll}
      >
        {nodes.map((node, index) => {
          const isSelected = selectedIds.includes(node.id);
          const isCaptionNode = node.type === 'caption';
          const isLoading = node.meta?.loading;

          return (
            <motion.div
              key={node.id}
              className="snap-center shrink-0 w-[85vw] max-w-[400px] relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={cn(
                  "relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0d0d0d] border-2 transition-all duration-200",
                  isSelected ? "border-[#0084FF] shadow-lg shadow-blue-500/20" : "border-white/10"
                )}
                onClick={() => handleToggleSelect(node.id)}
              >
                {/* Loading State */}
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/10 border-t-[#0084FF] rounded-full animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-400">Generating...</p>
                      <p className="text-xs text-zinc-600 mt-1">{node.title}</p>
                    </div>
                  </div>
                ) : isCaptionNode ? (
                  // Caption Node
                  <div className="absolute inset-0 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Type className="w-4 h-4 text-[#0084FF]" />
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{node.title}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap overflow-y-auto">
                      {node.content}
                    </p>
                  </div>
                ) : (
                  // Image Node
                  <>
                    {node.content.startsWith('data:image') ? (
                      <img
                        src={node.content}
                        alt={node.title}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <p className="text-sm text-zinc-500 text-center italic">
                          "{node.meta?.imagePrompt || node.content}"
                        </p>
                      </div>
                    )}

                    {/* Title Bar */}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="font-medium text-sm text-white truncate">{node.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{node.meta?.angle || 'Generated'}</p>
                    </div>
                  </>
                )}

                {/* Selection Checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0084FF] flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons (Below Card) */}
              {!isLoading && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {!isCaptionNode && (
                    <>
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-sm font-medium"
                        onClick={(e) => { e.stopPropagation(); onRemix?.(node.id); }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Remix
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-sm font-medium"
                        onClick={(e) => { e.stopPropagation(); onGenerateCaptions(node.id); }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Type className="w-4 h-4" />
                        Caption
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-medium"
                        onClick={(e) => { e.stopPropagation(); onPublish?.(node.id); }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Globe className="w-4 h-4" />
                        Publish
                      </motion.button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* End Spacer */}
        <div className="w-4 shrink-0" />
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 py-4">
        {nodes.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex ? "w-6 bg-[#0084FF]" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};