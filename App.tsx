import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import { Gallery } from './components/Gallery';
import { GlobalNav } from './components/GlobalNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { StudioPage } from './pages/StudioPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIToolsPage } from './pages/AIToolsPage';

// Types & Services
import { ProductProfile, AdTemplate } from './types';
import { generateAdImage } from './services/gemini';

// --- DATA CONSTANTS ---
const INITIAL_TEMPLATES: AdTemplate[] = [
    { id: '1', title: 'Neon Cyberpunk', style: 'Cyberpunk Neon', prompt: 'A futuristic city street at night, neon signs reflecting on wet pavement', thumbnail: 'linear-gradient(135deg, #2b0042, #ff00ff)' },
    { id: '2', title: 'Luxury Podium', style: 'Luxury Gold & Black', prompt: 'A black marble podium with gold accents, dramatic spotlight', thumbnail: 'linear-gradient(135deg, #000000, #daa520)' },
    { id: '3', title: 'Nature Zen', style: 'Ethereal Nature', prompt: 'Moss covered rock in a misty forest, sunbeams filtering through trees', thumbnail: 'linear-gradient(135deg, #1a2e1a, #4ade80)' },
    { id: '4', title: 'Minimalist Studio', style: 'Swiss Design Clean', prompt: 'Soft pastel background, hard shadows, geometric shapes', thumbnail: 'linear-gradient(135deg, #f3f4f6, #9ca3af)' },
    { id: '5', title: 'Vogue Editorial', style: 'Vogue Editorial', prompt: 'High fashion editorial shot, stark lighting, muted tones', thumbnail: 'linear-gradient(135deg, #78350f, #fef3c7)' },
    { id: '6', title: 'Summer Splash', style: 'Cinematic Lighting', prompt: 'Dynamic water splash, bright blue sky, refreshing summer vibe', thumbnail: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
    { id: '7', title: 'Industrial Grunge', style: 'Industrial Grunge', prompt: 'Concrete texture, metallic pipes, raw aesthetic', thumbnail: 'linear-gradient(135deg, #374151, #1f2937)' },
    { id: '8', title: 'Glassmorphism', style: 'Glassmorphism', prompt: 'Frosted glass layers, iridescent refractions, abstract modern', thumbnail: 'linear-gradient(135deg, #e0e7ff, #6366f1)' },
];


// --- APP LAYOUT COMPONENT ---
const AppLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">
            <GlobalNav />
            <motion.div
                className="flex-1 h-full overflow-hidden relative"
                key={location.pathname}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const navigate = useNavigate();

    // Gallery state (shared between Gallery and potential navigation)
    const [templates, setTemplates] = useState<AdTemplate[]>(INITIAL_TEMPLATES);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateFromGallery = async (template: AdTemplate, userProduct: ProductProfile) => {
        setIsGenerating(true);
        try {
            const prompt = `${template.prompt}. The main subject is the product in the second attached image. Replace the original subject with this product. Match the perspective, lighting, and shadows of the environment precisely. Style: ${template.style}.`;
            const generatedImage = await generateAdImage(
                prompt,
                [template.style],
                userProduct,
                'recreate'
            );
            if (generatedImage) {
                // Navigate to studio with the generated result
                navigate('/app/studio');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="studio" replace />} />
                <Route path="studio" element={<StudioPage />} />
                <Route path="gallery" element={
                    <Gallery
                        onGenerateFromTemplate={handleGenerateFromGallery}
                        isGenerating={isGenerating}
                        templates={templates}
                    />
                } />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="ai" element={<AIToolsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="help" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;