import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Card, Badge, Separator, Avatar } from "../components/ui";
import { fadeInUp, cn } from "../lib/utils";
import {
    User,
    Bell,
    Palette,
    Shield,
    CreditCard,
    Key,
    Monitor,
    Moon,
    Sun,
    Globe,
    ChevronRight,
    Check,
    Zap,
    Sparkles,
} from "lucide-react";

interface SettingsSection {
    id: string;
    icon: React.ElementType;
    label: string;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
    { id: "account", icon: User, label: "Account" },
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "api", icon: Key, label: "API Keys" },
    { id: "billing", icon: CreditCard, label: "Billing" },
    { id: "security", icon: Shield, label: "Security" },
];

const THEMES = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "system", label: "System", icon: Monitor },
];

export const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState("account");
    const [theme, setTheme] = useState("dark");
    const [apiKey, setApiKey] = useState("");

    return (
        <div className="flex h-full bg-[#0a0a0a] overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                className="w-64 border-r border-white/5 p-6 shrink-0"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                <h1 className="text-xl font-bold mb-6">Settings</h1>

                <nav className="space-y-1">
                    {SETTINGS_SECTIONS.map((section) => (
                        <motion.button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                                activeSection === section.id
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                            whileHover={{ x: 4 }}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </motion.button>
                    ))}
                </nav>
            </motion.aside>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl">
                    {/* Account Section */}
                    {activeSection === "account" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Account</h2>
                                <p className="text-zinc-500">Manage your account settings and preferences.</p>
                            </div>

                            {/* Profile Card */}
                            <Card variant="bordered" className="p-6">
                                <div className="flex items-start gap-6">
                                    <Avatar fallback="JD" size="lg" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">John Doe</h3>
                                        <p className="text-sm text-zinc-500 mb-4">john@example.com</p>
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Profile Form */}
                            <Card variant="bordered" className="p-6 space-y-6">
                                <h3 className="font-semibold">Profile Information</h3>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="First Name" placeholder="John" />
                                    <Input label="Last Name" placeholder="Doe" />
                                </div>
                                <Input label="Email" type="email" placeholder="john@example.com" />
                                <Input label="Username" placeholder="@johndoe" />
                                <div className="flex justify-end">
                                    <Button variant="primary">Save Changes</Button>
                                </div>
                            </Card>

                            {/* Plan */}
                            <Card variant="gradient" className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">Pro Plan</h3>
                                                <Badge variant="primary" size="sm">Active</Badge>
                                            </div>
                                            <p className="text-sm text-zinc-500">Unlimited generations, priority support</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Manage Plan</Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Appearance Section */}
                    {activeSection === "appearance" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Appearance</h2>
                                <p className="text-zinc-500">Customize how AdAlchemy looks on your device.</p>
                            </div>

                            {/* Theme Selection */}
                            <Card variant="bordered" className="p-6 space-y-6">
                                <h3 className="font-semibold">Theme</h3>
                                <Separator />
                                <div className="grid grid-cols-3 gap-4">
                                    {THEMES.map((t) => (
                                        <motion.button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={cn(
                                                "relative p-4 rounded-xl border-2 transition-all",
                                                theme === t.id
                                                    ? "border-[#0084FF] bg-[#0084FF]/5"
                                                    : "border-white/10 hover:border-white/20"
                                            )}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <t.icon className={cn(
                                                "w-6 h-6 mx-auto mb-2",
                                                theme === t.id ? "text-[#0084FF]" : "text-zinc-400"
                                            )} />
                                            <p className="text-sm font-medium">{t.label}</p>
                                            {theme === t.id && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0084FF] flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </Card>

                            {/* Accent Color */}
                            <Card variant="bordered" className="p-6 space-y-6">
                                <h3 className="font-semibold">Accent Color</h3>
                                <Separator />
                                <div className="flex gap-3">
                                    {["#0084FF", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"].map((color) => (
                                        <motion.button
                                            key={color}
                                            className={cn(
                                                "w-10 h-10 rounded-xl transition-all",
                                                color === "#0084FF" && "ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-[#0084FF]"
                                            )}
                                            style={{ backgroundColor: color }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        />
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* API Keys Section */}
                    {activeSection === "api" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-2">API Keys</h2>
                                <p className="text-zinc-500">Manage your API keys for external integrations.</p>
                            </div>

                            {/* Nano Banana API Key */}
                            <Card variant="bordered" className="p-6 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Nano Banana API Key</h3>
                                        <p className="text-sm text-zinc-500">Required for AI image generation</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <Input
                                        label="API Key"
                                        type="password"
                                        placeholder="Enter your Nano Banana API key..."
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        hint="Your API key is encrypted and stored securely"
                                    />
                                    <div className="flex gap-3">
                                        <Button variant="primary">Save Key</Button>
                                        <Button variant="ghost">Get API Key</Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Other Keys */}
                            <Card variant="bordered" className="p-6 space-y-4">
                                <h3 className="font-semibold">Other Integrations</h3>
                                <Separator />
                                <div className="space-y-3">
                                    {["Google Analytics", "Mixpanel", "Slack Webhook"].map((integration) => (
                                        <div key={integration} className="flex items-center justify-between py-2">
                                            <span className="text-sm text-zinc-300">{integration}</span>
                                            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                                                Configure
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Notifications Section */}
                    {activeSection === "notifications" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                                <p className="text-zinc-500">Configure how you receive notifications.</p>
                            </div>

                            <Card variant="bordered" className="p-6 space-y-6">
                                <h3 className="font-semibold">Email Notifications</h3>
                                <Separator />
                                {["Generation completed", "Weekly digest", "Product updates", "Marketing emails"].map((item) => (
                                    <div key={item} className="flex items-center justify-between py-2">
                                        <span className="text-sm">{item}</span>
                                        <button className="w-10 h-6 rounded-full bg-[#0084FF] relative transition-colors">
                                            <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                                        </button>
                                    </div>
                                ))}
                            </Card>
                        </motion.div>
                    )}

                    {/* Billing Section */}
                    {activeSection === "billing" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Billing</h2>
                                <p className="text-zinc-500">Manage your subscription and payment methods.</p>
                            </div>

                            <Card variant="gradient" className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Pro Plan</h3>
                                        <p className="text-sm text-zinc-500">$29/month • Renews Jan 25, 2026</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[#0084FF]">∞</p>
                                        <p className="text-xs text-zinc-500 mt-1">Generations</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">100</p>
                                        <p className="text-xs text-zinc-500 mt-1">Projects</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-emerald-400">5</p>
                                        <p className="text-xs text-zinc-500 mt-1">Team Seats</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Security Section */}
                    {activeSection === "security" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Security</h2>
                                <p className="text-zinc-500">Protect your account with additional security.</p>
                            </div>

                            <Card variant="bordered" className="p-6 space-y-6">
                                <h3 className="font-semibold">Password</h3>
                                <Separator />
                                <div className="space-y-4">
                                    <Input label="Current Password" type="password" placeholder="••••••••" />
                                    <Input label="New Password" type="password" placeholder="••••••••" />
                                    <Input label="Confirm Password" type="password" placeholder="••••••••" />
                                    <Button variant="primary">Update Password</Button>
                                </div>
                            </Card>

                            <Card variant="bordered" className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold mb-1">Two-Factor Authentication</h3>
                                        <p className="text-sm text-zinc-500">Add an extra layer of security</p>
                                    </div>
                                    <Button variant="outline" size="sm">Enable 2FA</Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
