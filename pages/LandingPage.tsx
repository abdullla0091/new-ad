import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui";
import { fadeInUp, staggerContainer } from "../lib/utils";
import {
    Sparkles,
    Zap,
    Layers,
    Palette,
    ArrowRight,
    Play,
    Star,
    Github
} from "lucide-react";

// Feature cards data
const FEATURES = [
    {
        icon: Sparkles,
        title: "AI-Powered Generation",
        description: "Transform your product photos into stunning ad creatives with one click.",
        gradient: "from-violet-600 to-purple-600",
    },
    {
        icon: Layers,
        title: "Infinite Canvas",
        description: "Work like Figma - drag, remix, and connect nodes in an infinite workspace.",
        gradient: "from-blue-600 to-cyan-600",
    },
    {
        icon: Palette,
        title: "Pro Templates",
        description: "Access 100+ designer-curated templates for every industry and style.",
        gradient: "from-pink-600 to-rose-600",
    },
    {
        icon: Zap,
        title: "Real-time Remix",
        description: "Combine concepts, fork variations, and iterate at lightning speed.",
        gradient: "from-amber-600 to-orange-600",
    },
];

// Stats
const STATS = [
    { value: "50K+", label: "Creatives Generated" },
    { value: "2.5x", label: "Faster Than Manual" },
    { value: "99%", label: "Satisfaction Rate" },
];

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
                {/* Gradient orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
                    }}
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Navigation */}
            <motion.nav
                className="relative z-50 border-b border-white/5"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0084FF] to-[#6366f1] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight group-hover:text-zinc-300 transition-colors">
                            AdAlchemy
                        </span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
                        <a href="#templates" className="text-sm text-zinc-400 hover:text-white transition-colors">Templates</a>
                        <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" leftIcon={<Github className="w-4 h-4" />}>
                            GitHub
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => navigate("/app/studio")}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-24 pb-32 px-6">
                <motion.div
                    className="max-w-5xl mx-auto text-center"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
                        variants={fadeInUp}
                    >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-zinc-300">
                            Enterprise-grade creative AI platform
                        </span>
                    </motion.div>

                    {/* Hero Title */}
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
                        variants={fadeInUp}
                    >
                        <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
                            Design ads that
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-[#0084FF] via-violet-500 to-purple-500 bg-clip-text text-transparent">
                            break the internet.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                        variants={fadeInUp}
                    >
                        The infinite canvas for AI-powered advertising. Upload your product,
                        choose a style, and watch as stunning creatives emerge from pure imagination.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        variants={fadeInUp}
                    >
                        <Button
                            variant="premium"
                            size="xl"
                            onClick={() => navigate("/app/studio")}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Start Creating Free
                        </Button>
                        <Button
                            variant="outline"
                            size="xl"
                            leftIcon={<Play className="w-4 h-4" />}
                        >
                            Watch Demo
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-12 mt-16 pt-8 border-t border-white/5"
                        variants={fadeInUp}
                    >
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-zinc-500">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Product Preview */}
            <section className="relative z-10 pb-32 px-6">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                        {/* Browser chrome */}
                        <div className="bg-[#1a1a1a] border-b border-white/5 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-white/5 rounded-lg px-4 py-1 text-xs text-zinc-500">
                                    app.adalchemy.ai
                                </div>
                            </div>
                        </div>
                        {/* Preview content */}
                        <div className="bg-[#0f0f0f] aspect-[16/9] flex items-center justify-center">
                            <div className="text-center px-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0084FF] to-violet-600 flex items-center justify-center">
                                    <Layers className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Infinite Canvas Studio</h3>
                                <p className="text-zinc-500 mb-6">Click to explore the full workspace</p>
                                <Button variant="primary" onClick={() => navigate("/app/studio")}>
                                    Launch Studio
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Built for the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0084FF] to-purple-500">
                                creative elite
                            </span>
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Everything you need to create scroll-stopping ad creatives,
                            from ideation to production.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {FEATURES.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-3xl -z-10`} style={{ opacity: 0.05 }} />

                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0084FF]/20 via-purple-500/10 to-pink-500/20" />
                        <div className="absolute inset-0 border border-white/10 rounded-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                Ready to create magic?
                            </h2>
                            <p className="text-lg text-zinc-400 mb-8 max-w-lg mx-auto">
                                Join thousands of marketers and designers creating
                                next-level ad creatives with AdAlchemy.
                            </p>
                            <Button
                                variant="premium"
                                size="xl"
                                onClick={() => navigate("/app/studio")}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Get Started — It's Free
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0084FF] to-[#6366f1] flex items-center justify-center">
                            <Layers className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-zinc-400">
                            © 2025 AdAlchemy. Enterprise Edition.
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
