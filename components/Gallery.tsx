import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdTemplate, ProductProfile } from "../types";
import { Button, Input, Textarea, Card, Badge } from "./ui";
import { fadeInUp, staggerContainer, cn } from "../lib/utils";
import {
  Search,
  Upload,
  Sparkles,
  Check,
  X,
  Grid3X3,
  LayoutGrid,
  Heart,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

interface GalleryProps {
  onGenerateFromTemplate: (template: AdTemplate, product: ProductProfile) => void;
  isGenerating: boolean;
  templates: AdTemplate[];
}

const CATEGORIES = ["All", "Minimal", "Luxury", "Nature", "Tech", "Fashion"];

export const Gallery: React.FC<GalleryProps> = ({ onGenerateFromTemplate, isGenerating, templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<AdTemplate | null>(null);
  const [product, setProduct] = useState<ProductProfile>({ image: null, description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRun = () => {
    if (selectedTemplate && product.image) {
      onGenerateFromTemplate(selectedTemplate, product);
      setIsMobilePanelOpen(false);
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mobile Quick Generate Panel
  const MobilePanel = () => (
    <AnimatePresence>
      {isMobilePanelOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobilePanelOpen(false)}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[#0d0d0d] rounded-t-3xl max-h-[80vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="px-5 pb-8 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#0084FF]" />
                  <h3 className="font-semibold text-lg">Quick Generate</h3>
                </div>
                <button onClick={() => setIsMobilePanelOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {/* Selected Template */}
              {selectedTemplate && (
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl shrink-0 overflow-hidden"
                      style={{
                        background: selectedTemplate.thumbnail.startsWith("linear-gradient")
                          ? selectedTemplate.thumbnail
                          : undefined,
                      }}
                    >
                      {!selectedTemplate.thumbnail.startsWith("linear-gradient") && (
                        <img src={selectedTemplate.thumbnail} className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">{selectedTemplate.title}</h4>
                      <p className="text-xs text-zinc-500 truncate">{selectedTemplate.style}</p>
                    </div>
                    <button onClick={() => setSelectedTemplate(null)} className="p-1.5 rounded-lg hover:bg-white/10">
                      <X className="w-4 h-4 text-zinc-500" />
                    </button>
                  </div>
                </Card>
              )}

              {/* Product Upload */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Your Product</label>
                <div
                  className={cn(
                    "aspect-video rounded-xl cursor-pointer overflow-hidden relative",
                    "border-2 border-dashed transition-all",
                    product.image
                      ? "border-[#0084FF]/50 bg-[#0084FF]/5"
                      : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                  {product.image ? (
                    <>
                      <img src={product.image} className="w-full h-full object-contain p-4" alt="Product" />
                      <button
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); setProduct({ ...product, image: null }); }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Upload className="w-6 h-6 text-zinc-500" />
                      <p className="text-sm text-zinc-500">Tap to upload</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <Textarea
                label="Product Description"
                placeholder="Describe your product..."
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
              />

              {/* Generate Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleRun}
                disabled={!product.image || !selectedTemplate || isGenerating}
                isLoading={isGenerating}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {isGenerating ? "Generating..." : "Generate Creative"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[#0a0a0a] text-white overflow-hidden pb-16 md:pb-0">
      {/* Main Gallery Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* Header */}
        <header className="shrink-0 px-4 md:px-8 py-4 md:py-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Templates</h1>
              <p className="text-sm text-zinc-500">{templates.length}+ professional templates</p>
            </div>

            {/* View Toggle (Desktop) */}
            <div className="hidden md:flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-2 rounded-md transition-colors", viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white")}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={cn("p-2 rounded-md transition-colors", viewMode === "masonry" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <div className="flex-1 md:max-w-md">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-all",
                    activeCategory === cat
                      ? "bg-[#0084FF] text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            className={cn(
              "grid gap-3 md:gap-5 pb-20",
              "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                variants={fadeInUp}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  setSelectedTemplate(template);
                  // On mobile, open the panel
                  if (window.innerWidth < 768) {
                    setIsMobilePanelOpen(true);
                  }
                }}
                className={cn(
                  "group relative rounded-xl md:rounded-2xl cursor-pointer overflow-hidden aspect-square",
                  "border transition-all duration-300",
                  selectedTemplate?.id === template.id
                    ? "border-[#0084FF] ring-2 ring-[#0084FF]/30"
                    : "border-white/5 hover:border-white/20"
                )}
              >
                {/* Thumbnail */}
                {template.thumbnail.startsWith("linear-gradient") ? (
                  <div className="absolute inset-0" style={{ background: template.thumbnail }} />
                ) : (
                  <img src={template.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt={template.title} />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant={template.isUserGenerated ? "primary" : "default"} size="sm">
                      {template.isUserGenerated ? "Community" : "Pro"}
                    </Badge>
                    <button
                      className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1 text-white">{template.title}</h3>
                    <p className="text-[10px] md:text-xs text-zinc-400 line-clamp-1">{template.style}</p>
                  </div>
                </div>

                {/* Selected indicator */}
                {selectedTemplate?.id === template.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 md:top-3 md:right-3 w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#0084FF] flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Desktop Sidebar Panel */}
      <aside className="hidden md:flex w-[340px] bg-[#0d0d0d] border-l border-white/5 flex-col shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <Sparkles className="w-5 h-5 text-[#0084FF]" />
            <h2 className="font-semibold text-lg">Quick Generate</h2>
          </div>
          <p className="text-sm text-zinc-500">Upload your product and apply a template</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Product Upload */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Your Product</label>
            <div
              className={cn(
                "aspect-square rounded-xl cursor-pointer overflow-hidden relative",
                "border-2 border-dashed transition-all duration-200",
                product.image
                  ? "border-[#0084FF]/50 bg-[#0084FF]/5"
                  : "border-white/10 hover:border-white/20 bg-white/[0.02]"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

              {product.image ? (
                <>
                  <img src={product.image} className="w-full h-full object-contain p-4" alt="Product" />
                  <button
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setProduct({ ...product, image: null }); }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">Drop product image</p>
                    <p className="text-xs text-zinc-600 mt-1">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <Textarea
            label="Product Description"
            placeholder="Describe your product for better AI understanding..."
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />

          {/* Selected Template */}
          <AnimatePresence mode="wait">
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Selected Template</label>
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl shrink-0 overflow-hidden"
                      style={{
                        background: selectedTemplate.thumbnail.startsWith("linear-gradient")
                          ? selectedTemplate.thumbnail
                          : undefined,
                      }}
                    >
                      {!selectedTemplate.thumbnail.startsWith("linear-gradient") && (
                        <img src={selectedTemplate.thumbnail} className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">{selectedTemplate.title}</h4>
                      <p className="text-xs text-zinc-500 truncate">{selectedTemplate.style}</p>
                    </div>
                    <button onClick={() => setSelectedTemplate(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <X className="w-4 h-4 text-zinc-500" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-white/5">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleRun}
            disabled={!product.image || !selectedTemplate || isGenerating}
            isLoading={isGenerating}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {isGenerating ? "Generating..." : "Generate Creative"}
          </Button>
          <p className="text-[10px] text-zinc-600 text-center mt-3">Powered by Nano Banana AI</p>
        </div>
      </aside>

      {/* Mobile Actions */}
      <MobilePanel />

      {/* Mobile FAB when template selected */}
      {selectedTemplate && !isMobilePanelOpen && (
        <motion.button
          className="md:hidden fixed bottom-20 right-4 px-5 py-3 rounded-full bg-[#0084FF] shadow-lg shadow-blue-500/30 flex items-center gap-2 z-40"
          onClick={() => setIsMobilePanelOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Generate</span>
        </motion.button>
      )}
    </div>
  );
};
