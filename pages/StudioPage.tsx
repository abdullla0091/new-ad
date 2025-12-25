import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { Canvas } from '../components/Canvas';
import { MobileCanvas } from '../components/MobileCanvas';
import { Button, Textarea, Select, Card, Separator } from '../components/ui';

// Types & Services
import { ProductProfile, AdNodeData, Wire, GenerationParams } from '../types';
import { generateAdConcepts, generateAdImage, combineNodes, generateTailoredCaption } from '../services/gemini';

// Utils
import { cn } from '../lib/utils';
import {
    Sparkles,
    Upload,
    X,
    Settings2,
    Image,
    Target,
    Palette,
    ChevronUp,
    ChevronDown,
    Sliders
} from 'lucide-react';

// --- CONSTANTS ---
const STYLE_OPTIONS = [
    "Cinematic Lighting", "Hyper-Surrealism 3D", "Neo-Brutalism", "Glassmorphism",
    "Vogue Editorial", "Cyberpunk Neon", "Ethereal Nature", "3D Low Angle",
    "Bold Typography", "Bauhaus Minimalist", "Y2K Futurism", "Kodak Portra 400",
    "Luxury Gold & Black", "Abstract Expressionism", "Swiss Design Clean"
];

const LANGUAGES = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese",
    "Kurdish (Sorani)", "Arabic", "Japanese", "Korean", "Chinese"
];

const CAPTION_STYLES = [
    "Professional", "Playful/Joyful", "Marketing/Direct",
    "Formal/Academic", "Minimalist", "Urgent/Scarcity"
];

export const StudioPage: React.FC = () => {
    // --- STATE ---
    const [nodes, setNodes] = useState<AdNodeData[]>([]);
    const [wires, setWires] = useState<Wire[]>([]);
    const [product, setProduct] = useState<ProductProfile>({ image: null, referenceAd: null, description: '' });
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // UI States
    const [isGenerating, setIsGenerating] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [isResizingSidebar, setIsResizingSidebar] = useState(false);
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

    // Caption Modal
    const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
    const [activeNodeIdForCaption, setActiveNodeIdForCaption] = useState<string | null>(null);
    const [captionLanguage, setCaptionLanguage] = useState('English');
    const [captionStyle, setCaptionStyle] = useState('Professional');
    const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

    // Generation Params
    const [genParams, setGenParams] = useState<GenerationParams>({
        goal: "Conversions",
        format: "Square (1:1)",
        style: ["Cinematic Lighting"],
        cloneMode: "recreate"
    });

    const [promptInput, setPromptInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const refAdInputRef = useRef<HTMLInputElement>(null);

    // --- HELPERS ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isReferenceAd: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isReferenceAd) {
                    setProduct(prev => ({ ...prev, referenceAd: reader.result as string }));
                } else {
                    setProduct(prev => ({ ...prev, image: reader.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleStyle = useCallback((style: string) => {
        setGenParams(prev => {
            const exists = prev.style.includes(style);
            if (exists) {
                return { ...prev, style: prev.style.filter(s => s !== style) };
            } else {
                return { ...prev, style: [...prev.style, style] };
            }
        });
    }, []);

    // --- ACTIONS ---
    const handleGenerate = async () => {
        if (!product.image) return;
        setIsGenerating(true);
        setIsMobilePanelOpen(false);
        try {
            const concepts = await generateAdConcepts(product, genParams, 3);
            const startX = nodes.length > 0 ? Math.max(...nodes.map(n => n.x)) + 400 : 100;
            const startY = 100;

            const newNodes: AdNodeData[] = concepts.map((concept, idx) => ({
                id: crypto.randomUUID(),
                type: 'concept',
                x: startX + (idx * 350),
                y: startY,
                title: concept.headline,
                content: concept.body,
                meta: { ...concept, loading: true },
                width: 320
            }));

            setNodes(prev => [...prev, ...newNodes]);

            // Parallel Image Generation
            await Promise.all(newNodes.map(async (node) => {
                if (node.meta?.imagePrompt) {
                    const base64Image = await generateAdImage(
                        node.meta.imagePrompt,
                        genParams.style,
                        product,
                        genParams.cloneMode
                    );
                    if (base64Image) {
                        setNodes(prev => prev.map(n =>
                            n.id === node.id
                                ? { ...n, content: base64Image, meta: { ...n.meta, loading: false } }
                                : n
                        ));
                    }
                }
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCombine = async () => {
        if (selectedIds.length !== 2) return;
        setIsGenerating(true);
        const nodeA = nodes.find(n => n.id === selectedIds[0]);
        const nodeB = nodes.find(n => n.id === selectedIds[1]);
        if (!nodeA || !nodeB) return;

        try {
            const combinedConcept = await combineNodes(nodeA.meta, nodeB.meta, promptInput || "Merge best elements");
            const newNodeId = crypto.randomUUID();
            const newNode: AdNodeData = {
                id: newNodeId,
                type: 'concept',
                x: (nodeA.x + nodeB.x) / 2, y: Math.max(nodeA.y, nodeB.y) + 400,
                title: combinedConcept.headline,
                content: combinedConcept.body,
                meta: { ...combinedConcept, loading: true },
                width: 320
            };
            const newWires: Wire[] = [
                { id: crypto.randomUUID(), from: nodeA.id, to: newNodeId },
                { id: crypto.randomUUID(), from: nodeB.id, to: newNodeId }
            ];
            setNodes(prev => [...prev, newNode]);
            setWires(prev => [...prev, ...newWires]);
            setPromptInput("");
            setSelectedIds([]);

            if (combinedConcept.imagePrompt) {
                const img = await generateAdImage(combinedConcept.imagePrompt, genParams.style, product, 'recreate');
                if (img) {
                    setNodes(prev => prev.map(n => n.id === newNodeId ? { ...n, content: img, meta: { ...n.meta, loading: false } } : n));
                }
            }
        } catch (e) { console.error(e); } finally { setIsGenerating(false); }
    };

    const handleRemix = async (id: string) => {
        const originalNode = nodes.find(n => n.id === id);
        if (!originalNode || !originalNode.meta?.imagePrompt || !product.image) return;

        const remixId = crypto.randomUUID();
        const remixNode: AdNodeData = {
            id: remixId,
            type: 'concept',
            x: originalNode.x + 400, y: originalNode.y,
            title: `Remix: ${originalNode.title}`,
            content: "",
            meta: { ...originalNode.meta, loading: true, angle: 'Variation' },
            width: 320
        };
        const newWire: Wire = { id: crypto.randomUUID(), from: originalNode.id, to: remixId };
        setNodes(prev => [...prev, remixNode]);
        setWires(prev => [...prev, newWire]);

        try {
            const remixPrompt = originalNode.meta.imagePrompt + ". Make this slightly different, explore a new angle or lighting variation.";
            const img = await generateAdImage(remixPrompt, genParams.style, product, 'recreate');
            if (img) {
                setNodes(prev => prev.map(n => n.id === remixId ? { ...n, content: img, meta: { ...n.meta, loading: false } } : n));
            }
        } catch (e) { console.error(e); }
    };

    const handlePublishToGallery = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;
        if (!node.content.startsWith('data:image')) {
            alert("Can only publish generated images.");
            return;
        }
        alert("Design published to Gallery!");
    };

    // Caption Logic
    const openCaptionModal = (nodeId: string) => { setActiveNodeIdForCaption(nodeId); setIsCaptionModalOpen(true); };
    const handleGenerateCaptionNode = async () => {
        if (!activeNodeIdForCaption) return;
        setIsGeneratingCaption(true);
        const sourceNode = nodes.find(n => n.id === activeNodeIdForCaption);
        if (!sourceNode) { setIsGeneratingCaption(false); setIsCaptionModalOpen(false); return; }
        try {
            const captionResult = await generateTailoredCaption(
                sourceNode.title, sourceNode.content, product.description || "", sourceNode.meta?.imagePrompt || "", captionLanguage, captionStyle
            );
            if (captionResult) {
                const newNodeId = crypto.randomUUID();
                const captionNode: AdNodeData = {
                    id: newNodeId, type: 'caption', x: sourceNode.x, y: sourceNode.y - 350,
                    title: `${captionLanguage} Copy`, content: captionResult.content, meta: { angle: 'Copywriting' }, width: 320, height: 200
                };
                const newWire: Wire = { id: crypto.randomUUID(), from: sourceNode.id, to: newNodeId };
                setNodes(prev => [...prev, captionNode]);
                setWires(prev => [...prev, newWire]);
            }
        } catch (e) { console.error(e); } finally {
            setIsGeneratingCaption(false); setIsCaptionModalOpen(false); setActiveNodeIdForCaption(null);
        }
    };

    // --- SHORTCUTS ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            if (e.key === 'Backspace' || e.key === 'Delete') {
                if (selectedIds.length > 0) {
                    setNodes(prev => prev.filter(n => !selectedIds.includes(n.id)));
                    setWires(prev => prev.filter(w => !selectedIds.includes(w.from) && !selectedIds.includes(w.to)));
                    setSelectedIds([]);
                }
            }
            if (e.key === 'Escape') setSelectedIds([]);
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                e.preventDefault();
                setSelectedIds(nodes.map(n => n.id));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, nodes]);

    // --- DRAG DROP ---
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                const newNode: AdNodeData = {
                    id: crypto.randomUUID(), type: 'image', x: e.clientX - 260, y: e.clientY,
                    title: file.name, content: reader.result as string, meta: { angle: 'Imported' }, width: 320, height: 320
                };
                setNodes(prev => [...prev, newNode]);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // Sidebar Resize (Desktop only)
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => { if (isResizingSidebar) setSidebarWidth(Math.max(280, Math.min(500, e.clientX - 64))); };
        const handleMouseUp = () => setIsResizingSidebar(false);
        if (isResizingSidebar) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); document.body.style.cursor = 'col-resize'; }
        else { document.body.style.cursor = 'default'; }
        return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }, [isResizingSidebar]);

    // --- SIDEBAR CONTENT (Shared between desktop and mobile) ---
    const SidebarContent = () => (
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* ASSETS Section */}
            <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Image className="w-3.5 h-3.5" />
                    Assets
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {/* Product Upload */}
                    <div
                        className={cn(
                            "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all",
                            "active:scale-[0.98]",
                            !product.image
                                ? 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                                : 'border-[#0084FF]/50 bg-[#0084FF]/5'
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                        {product.image ? (
                            <>
                                <img src={product.image} className="w-full h-full object-contain p-3" alt="Product" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-5 h-5 mx-auto mb-2 text-zinc-500" />
                                <span className="text-[10px] font-medium text-zinc-500">Product</span>
                            </div>
                        )}
                    </div>

                    {/* Reference Ad Upload */}
                    <div
                        className={cn(
                            "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all",
                            "active:scale-[0.98]",
                            !product.referenceAd
                                ? 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                                : 'border-[#0084FF]/50 bg-[#0084FF]/5'
                        )}
                        onClick={() => refAdInputRef.current?.click()}
                    >
                        <input type="file" ref={refAdInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                        {product.referenceAd ? (
                            <>
                                <img src={product.referenceAd} className="w-full h-full object-cover opacity-80" alt="Ref" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-5 h-5 mx-auto mb-2 text-zinc-500" />
                                <span className="text-[10px] font-medium text-zinc-500">Reference</span>
                            </div>
                        )}
                    </div>
                </div>

                {product.referenceAd && (
                    <div className="flex p-1 rounded-lg bg-white/5 border border-white/5">
                        <button onClick={() => setGenParams(p => ({ ...p, cloneMode: 'edit' }))} className={cn("flex-1 py-2 text-[11px] font-medium rounded-md transition-all", genParams.cloneMode === 'edit' ? 'bg-[#0084FF] text-white' : 'text-zinc-500 hover:text-white')}>Edit</button>
                        <button onClick={() => setGenParams(p => ({ ...p, cloneMode: 'recreate' }))} className={cn("flex-1 py-2 text-[11px] font-medium rounded-md transition-all", genParams.cloneMode === 'recreate' ? 'bg-[#0084FF] text-white' : 'text-zinc-500 hover:text-white')}>Recreate</button>
                    </div>
                )}
            </div>

            <Separator />

            {/* BRIEF Section */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    Brief
                </h3>
                <Textarea
                    label="Context"
                    placeholder="Describe your product, target audience, campaign goals..."
                    value={product.description}
                    onChange={e => setProduct({ ...product, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                    <Select label="Goal" options={["Conversions", "Awareness", "Traffic"]} value={genParams.goal} onChange={e => setGenParams({ ...genParams, goal: e.target.value })} />
                    <Select label="Format" options={["Square (1:1)", "Story (9:16)"]} value={genParams.format} onChange={e => setGenParams({ ...genParams, format: e.target.value })} />
                </div>
            </div>

            <Separator />

            {/* AESTHETIC Section */}
            <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" />
                    Aesthetic
                </h3>
                <div className="flex flex-wrap gap-1.5">
                    {STYLE_OPTIONS.map(style => {
                        const isSelected = genParams.style.includes(style);
                        return (
                            <button
                                key={style}
                                onClick={() => toggleStyle(style)}
                                className={cn(
                                    "px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all duration-150",
                                    "active:scale-[0.98]",
                                    isSelected
                                        ? "bg-[#0084FF] text-white border-transparent"
                                        : "bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                                )}
                            >
                                {style}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-full w-full bg-[#0a0a0a]" onDrop={handleDrop} onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}>

            {/* DESKTOP SIDEBAR */}
            <aside
                className="hidden md:flex shrink-0 bg-[#0d0d0d] border-r border-white/5 flex-col z-20 relative"
                style={{ width: sidebarWidth }}
            >
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-zinc-500" />
                        <span className="font-semibold text-sm tracking-tight">Studio Config</span>
                    </div>
                </div>

                <SidebarContent />

                {/* Footer */}
                <div className="p-5 border-t border-white/5">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={isGenerating || !product.image}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                        {isGenerating ? "Generating..." : "Generate Canvas"}
                    </Button>
                </div>

                {/* Resize Handle */}
                <div
                    className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize hover:bg-[#0084FF] transition-colors z-30"
                    onMouseDown={() => setIsResizingSidebar(true)}
                />
            </aside>

            {/* CANVAS AREA */}
            <main className="flex-1 relative h-full flex flex-col pb-16 md:pb-0">
                {/* Merge Toolbar */}
                <AnimatePresence>
                    {selectedIds.length === 2 && (
                        <motion.div
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Card variant="glass" className="flex items-center gap-2 p-1.5 pl-3">
                                <input
                                    className="bg-transparent text-sm outline-none w-32 md:w-48 placeholder:text-zinc-600 text-white"
                                    placeholder="Describe merge..."
                                    value={promptInput}
                                    onChange={(e) => setPromptInput(e.target.value)}
                                />
                                <Button variant="primary" size="sm" onClick={handleCombine} disabled={isGenerating}>
                                    Merge
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Canvas */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Desktop Canvas */}
                    <div className="hidden md:block w-full h-full">
                        <Canvas
                            nodes={nodes} wires={wires} selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds} onCanvasClick={() => setSelectedIds([])}
                            onGenerateCaptions={openCaptionModal}
                            onNodeMove={(id, x, y) => setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n))}
                            onNodeResize={(id, w, h) => setNodes(prev => prev.map(n => n.id === id ? { ...n, width: w, height: h } : n))}
                            onRemix={handleRemix} onPublish={handlePublishToGallery}
                        />
                    </div>
                    {/* Mobile Canvas */}
                    <div className="md:hidden w-full h-full">
                        <MobileCanvas
                            nodes={nodes}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            onGenerateCaptions={openCaptionModal}
                            onRemix={handleRemix}
                            onPublish={handlePublishToGallery}
                        />
                    </div>
                </div>

                {/* Caption Modal */}
                <AnimatePresence>
                    {isCaptionModalOpen && (
                        <motion.div
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                            onClick={() => setIsCaptionModalOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="w-full max-w-[360px]"
                            >
                                <Card variant="bordered" className="p-6 space-y-5" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg">Generate Copy</h3>
                                        <button onClick={() => setIsCaptionModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                                            <X className="w-5 h-5 text-zinc-500" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <Select label="Language" options={LANGUAGES} value={captionLanguage} onChange={e => setCaptionLanguage(e.target.value)} />
                                        <Select label="Tone" options={CAPTION_STYLES} value={captionStyle} onChange={e => setCaptionStyle(e.target.value)} />
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        onClick={handleGenerateCaptionNode}
                                        disabled={isGeneratingCaption}
                                        isLoading={isGeneratingCaption}
                                        leftIcon={<Sparkles className="w-4 h-4" />}
                                    >
                                        {isGeneratingCaption ? "Writing..." : "Generate"}
                                    </Button>
                                </Card>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* MOBILE BOTTOM PANEL */}
            <div className="md:hidden fixed bottom-16 left-0 right-0 z-40">
                {/* Toggle Button */}
                <motion.button
                    className="absolute -top-12 right-4 w-12 h-12 rounded-full bg-[#0084FF] shadow-lg shadow-blue-500/30 flex items-center justify-center"
                    onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
                    whileTap={{ scale: 0.95 }}
                >
                    {isMobilePanelOpen ? <ChevronDown className="w-5 h-5" /> : <Sliders className="w-5 h-5" />}
                </motion.button>

                {/* Panel Content */}
                <AnimatePresence>
                    {isMobilePanelOpen && (
                        <motion.div
                            className="bg-[#0d0d0d]/95 backdrop-blur-lg border-t border-white/5 rounded-t-3xl"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        >
                            <div className="max-h-[60vh] overflow-hidden flex flex-col">
                                {/* Handle */}
                                <div className="flex justify-center py-3">
                                    <div className="w-10 h-1 rounded-full bg-white/20" />
                                </div>

                                <SidebarContent />

                                {/* Generate Button */}
                                <div className="p-4 border-t border-white/5">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !product.image}
                                        isLoading={isGenerating}
                                        leftIcon={<Sparkles className="w-4 h-4" />}
                                    >
                                        {isGenerating ? "Generating..." : "Generate Canvas"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
