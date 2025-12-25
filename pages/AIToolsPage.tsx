import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Card, Badge, Textarea } from "../components/ui";
import { fadeInUp, staggerContainer, cn } from "../lib/utils";
import {
    Sparkles,
    Wand2,
    Type,
    Image,
    Palette,
    Scissors,
    ArrowRight,
    Zap,
    Star,
    Copy,
    Check,
    RefreshCw,
} from "lucide-react";

interface AITool {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    badge?: string;
}

const AI_TOOLS: AITool[] = [
    {
        id: "generate",
        icon: Sparkles,
        title: "Image Generation",
        description: "Create stunning product visuals from text prompts",
        gradient: "from-violet-600 to-purple-600",
    },
    {
        id: "caption",
        icon: Type,
        title: "Caption Writer",
        description: "Generate engaging social media captions in any language",
        gradient: "from-blue-600 to-cyan-600",
    },
    {
        id: "enhance",
        icon: Wand2,
        title: "Image Enhancer",
        description: "Upscale, denoise, and enhance image quality",
        gradient: "from-pink-600 to-rose-600",
        badge: "New",
    },
    {
        id: "remove-bg",
        icon: Scissors,
        title: "Background Remover",
        description: "Remove backgrounds instantly with AI precision",
        gradient: "from-emerald-600 to-teal-600",
    },
    {
        id: "colorize",
        icon: Palette,
        title: "Color Palette",
        description: "Extract and generate color palettes from images",
        gradient: "from-amber-600 to-orange-600",
    },
    {
        id: "variations",
        icon: RefreshCw,
        title: "Create Variations",
        description: "Generate multiple variations of your creative",
        gradient: "from-indigo-600 to-violet-600",
    },
];

export const AIToolsPage: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<string | null>("caption");
    const [captionInput, setCaptionInput] = useState("");
    const [generatedCaption, setGeneratedCaption] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setGeneratedCaption(
                "✨ Elevate your style game with our latest collection. Premium quality meets exceptional design. Limited stock available - don't miss out! 🔥\n\n#fashion #style #premium #newcollection #luxury"
            );
            setIsGenerating(false);
        }, 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCaption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Header */}
                <motion.header
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <Badge variant="primary">Beta</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">AI Tools</h1>
                    <p className="text-zinc-500 max-w-xl">
                        Supercharge your creative workflow with our suite of AI-powered tools.
                        From image generation to copywriting, we've got you covered.
                    </p>
                </motion.header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Tools Grid */}
                    <motion.div
                        className="lg:col-span-2"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                            Available Tools
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {AI_TOOLS.map((tool, i) => (
                                <motion.div
                                    key={tool.id}
                                    variants={fadeInUp}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedTool(tool.id)}
                                    className={cn(
                                        "group relative p-5 rounded-2xl cursor-pointer transition-all duration-300",
                                        "border",
                                        selectedTool === tool.id
                                            ? "border-[#0084FF] bg-[#0084FF]/5"
                                            : "border-white/5 hover:border-white/10 bg-white/[0.02]"
                                    )}
                                    whileHover={{ y: -2 }}
                                >
                                    {/* Glow */}
                                    {selectedTool === tool.id && (
                                        <div
                                            className={cn(
                                                "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-5 blur-xl -z-10",
                                                tool.gradient
                                            )}
                                        />
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div
                                            className={cn(
                                                "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg",
                                                tool.gradient
                                            )}
                                        >
                                            <tool.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-sm text-white">{tool.title}</h3>
                                                {tool.badge && (
                                                    <Badge variant="success" size="sm">
                                                        {tool.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 line-clamp-2">{tool.description}</p>
                                        </div>
                                        <ArrowRight
                                            className={cn(
                                                "w-4 h-4 shrink-0 transition-all",
                                                selectedTool === tool.id
                                                    ? "text-[#0084FF] translate-x-0"
                                                    : "text-zinc-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                            )}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tool Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                            Tool Panel
                        </h2>
                        <Card variant="bordered" className="p-6 space-y-6">
                            {selectedTool === "caption" ? (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                            <Type className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Caption Writer</h3>
                                            <p className="text-xs text-zinc-500">AI-powered copywriting</p>
                                        </div>
                                    </div>

                                    <Textarea
                                        label="Describe your product/content"
                                        placeholder="E.g., A luxury leather handbag with gold hardware, targeting fashion-forward women aged 25-40..."
                                        value={captionInput}
                                        onChange={(e) => setCaptionInput(e.target.value)}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-400">Language</label>
                                            <select className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm">
                                                <option>English</option>
                                                <option>Kurdish (Sorani)</option>
                                                <option>Arabic</option>
                                                <option>Spanish</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-zinc-400">Tone</label>
                                            <select className="w-full h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm">
                                                <option>Professional</option>
                                                <option>Playful</option>
                                                <option>Urgent</option>
                                                <option>Luxury</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleGenerate}
                                        isLoading={isGenerating}
                                        leftIcon={<Sparkles className="w-4 h-4" />}
                                    >
                                        Generate Caption
                                    </Button>

                                    {/* Output */}
                                    {generatedCaption && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-zinc-400">Generated Caption</label>
                                                <button
                                                    onClick={handleCopy}
                                                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span className="text-emerald-400">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <p className="text-sm whitespace-pre-wrap">{generatedCaption}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                                                    Regenerate
                                                </Button>
                                                <Button variant="ghost" size="sm" leftIcon={<Star className="w-3.5 h-3.5" />}>
                                                    Save
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Select a Tool</h3>
                                    <p className="text-sm text-zinc-500 max-w-[200px] mx-auto">
                                        Choose an AI tool from the list to get started
                                    </p>
                                </div>
                            )}
                        </Card>

                        {/* Quick Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Card variant="glass" className="p-4 text-center">
                                <p className="text-2xl font-bold text-[#0084FF]">1,247</p>
                                <p className="text-xs text-zinc-500 mt-1">Generations today</p>
                            </Card>
                            <Card variant="glass" className="p-4 text-center">
                                <p className="text-2xl font-bold text-emerald-400">∞</p>
                                <p className="text-xs text-zinc-500 mt-1">Credits remaining</p>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
