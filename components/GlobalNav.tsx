import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import {
  Layers,
  LayoutGrid,
  Settings,
  FolderOpen,
  Sparkles,
  Plus,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "studio", icon: Layers, label: "Studio", path: "/app/studio" },
  { id: "gallery", icon: LayoutGrid, label: "Templates", path: "/app/gallery" },
  { id: "projects", icon: FolderOpen, label: "Projects", path: "/app/projects" },
  { id: "ai", icon: Sparkles, label: "AI Tools", path: "/app/ai", badge: "New" },
  { id: "settings", icon: Settings, label: "Settings", path: "/app/settings" },
];

// Mobile bottom navigation items (subset)
const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 4);

export const GlobalNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path.split("/").pop() || "");

  // Desktop Sidebar
  const DesktopNav = () => (
    <aside className="hidden md:flex h-full w-16 bg-[#0d0d0d] border-r border-white/5 flex-col relative z-50">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/5">
        <motion.div
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0084FF] to-[#6366f1] flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/20"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Layers className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Quick Action */}
      <div className="p-2 border-b border-white/5">
        <motion.button
          className="w-full aspect-square rounded-xl bg-gradient-to-b from-[#0084FF] to-[#0066CC] flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/app/studio")}
        >
          <Plus className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative w-full aspect-square rounded-xl flex items-center justify-center transition-all",
                active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#0084FF]"
                />
              )}
              <item.icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-500" />
              )}
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );

  // Mobile Bottom Navigation
  const MobileNav = () => (
    <>
      {/* Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0d0d0d]/95 backdrop-blur-lg border-t border-white/5 z-50 safe-area-bottom">
        <div className="h-full flex items-center justify-around px-2">
          {MOBILE_NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-[#0084FF]" : "text-zinc-500"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="mobileActiveNav"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0084FF]"
                  />
                )}
              </motion.button>
            );
          })}
          {/* More Menu */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex-1 h-full flex flex-col items-center justify-center gap-1 text-zinc-500"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#0d0d0d] rounded-t-3xl p-6 pb-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-colors",
                        active ? "bg-[#0084FF]/10 text-[#0084FF]" : "text-zinc-400 hover:bg-white/5"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-violet-500/20 text-violet-400 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};