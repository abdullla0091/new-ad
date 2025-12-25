import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Card, Badge, Avatar, Separator } from "../components/ui";
import { fadeInUp, staggerContainer, cn } from "../lib/utils";
import {
    Plus,
    Search,
    MoreHorizontal,
    Clock,
    Folder,
    Image,
    Star,
    Trash2,
    Copy,
    ExternalLink,
    Grid3X3,
    List,
    ChevronDown,
    Users,
} from "lucide-react";

interface Project {
    id: string;
    name: string;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
    itemCount: number;
    isPinned: boolean;
    collaborators: number;
}

const DEMO_PROJECTS: Project[] = [
    {
        id: "1",
        name: "Summer Campaign 2025",
        thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        createdAt: "Dec 20, 2025",
        updatedAt: "2 hours ago",
        itemCount: 24,
        isPinned: true,
        collaborators: 3,
    },
    {
        id: "2",
        name: "Product Launch - Wireless Headphones",
        thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        createdAt: "Dec 18, 2025",
        updatedAt: "Yesterday",
        itemCount: 12,
        isPinned: true,
        collaborators: 2,
    },
    {
        id: "3",
        name: "Holiday Sale Assets",
        thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        createdAt: "Dec 15, 2025",
        updatedAt: "3 days ago",
        itemCount: 8,
        isPinned: false,
        collaborators: 1,
    },
    {
        id: "4",
        name: "Brand Refresh Q1",
        thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        createdAt: "Dec 10, 2025",
        updatedAt: "1 week ago",
        itemCount: 45,
        isPinned: false,
        collaborators: 5,
    },
    {
        id: "5",
        name: "Social Media Templates",
        thumbnail: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        createdAt: "Dec 5, 2025",
        updatedAt: "2 weeks ago",
        itemCount: 18,
        isPinned: false,
        collaborators: 2,
    },
];

export const ProjectsPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [projects] = useState<Project[]>(DEMO_PROJECTS);

    const pinnedProjects = projects.filter(p => p.isPinned);
    const recentProjects = projects.filter(p => !p.isPinned);

    const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group"
        >
            <Card variant="bordered" hover className="overflow-hidden cursor-pointer">
                {/* Thumbnail */}
                <div
                    className="aspect-[16/10] relative overflow-hidden"
                    style={{ background: project.thumbnail }}
                >
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                            Open
                        </Button>
                    </div>

                    {/* Pin badge */}
                    {project.isPinned && (
                        <div className="absolute top-3 left-3">
                            <Badge variant="warning" size="sm">
                                <Star className="w-3 h-3 mr-1 fill-current" /> Pinned
                            </Badge>
                        </div>
                    )}

                    {/* More menu */}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                        <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-medium text-sm text-white mb-1 truncate">{project.name}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Image className="w-3.5 h-3.5" />
                            <span>{project.itemCount} items</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {project.collaborators > 1 && (
                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{project.collaborators}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-zinc-600">
                        <Clock className="w-3 h-3" />
                        <span>{project.updatedAt}</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );

    return (
        <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Header */}
                <motion.header
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Projects</h1>
                            <p className="text-zinc-500">Manage your creative workspaces</p>
                        </div>
                        <Button
                            variant="primary"
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            New Project
                        </Button>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>
                                Sort by
                            </Button>
                            <Separator className="h-6 w-px" />
                            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "p-1.5 rounded-md transition-colors",
                                        viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "p-1.5 rounded-md transition-colors",
                                        viewMode === "list" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Pinned Projects */}
                {pinnedProjects.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Star className="w-3.5 h-3.5" />
                            Pinned
                        </h2>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {pinnedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* Recent Projects */}
                <section>
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        Recent
                    </h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {recentProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}

                        {/* Create New Card */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            className="cursor-pointer"
                        >
                            <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/[0.02] flex flex-col items-center justify-center gap-3 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-zinc-500" />
                                </div>
                                <p className="text-sm text-zinc-500">Create new project</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};
