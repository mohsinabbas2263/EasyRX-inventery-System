import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ChevronDown,
    Store,
    Users,
    Bell,
    DollarSign,
    Shield,
    Info,
    Save,
    Upload,
    Download,
    Trash2,
    Plus,
    Edit,
    Check,
    X,
    Mail,
    Phone,
    MapPin,
    Globe,
    Key,
    Database,
    Palette,
    Clock,
    AlertCircle,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import { THEME } from "../../theme";

const SETTINGS_TABS = [
    { id: "store", label: "Store Information", icon: Store },
    { id: "users", label: "User Management", icon: Users },
    { id: "preferences", label: "Preferences", icon: Bell },
    { id: "financial", label: "Financial Settings", icon: DollarSign },
    { id: "security", label: "Security & Backup", icon: Shield },
    { id: "about", label: "About & Support", icon: Info },
];

const MOCK_USERS = [
    {
        id: 1,
        name: "Ahmed Khan",
        email: "ahmed@eazyrx.com",
        role: "Admin",
        status: "Active",
        lastLogin: "2026-01-27 18:30",
    },
    {
        id: 2,
        name: "Fatima Ali",
        email: "fatima@eazyrx.com",
        role: "Pharmacist",
        status: "Active",
        lastLogin: "2026-01-27 17:45",
    },
    {
        id: 3,
        name: "Hassan Raza",
        email: "hassan@eazyrx.com",
        role: "Cashier",
        status: "Active",
        lastLogin: "2026-01-27 16:20",
    },
];

export default function Settings() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const [activeTab, setActiveTab] = useState("store");
    const [hasChanges, setHasChanges] = useState(false);

    // Store settings
    const [storeSettings, setStoreSettings] = useState({
        name: "EazyRX Pharmacy",
        tagline: "Your Health, Our Priority",
        email: "info@eazyrx.com",
        phone: "+92 300 1234567",
        address: "123 Main Street, Johar Town",
        city: "Lahore",
        state: "Punjab",
        zipCode: "54000",
        country: "Pakistan",
        website: "www.eazyrx.com",
        ntn: "1234567-8",
        license: "PH-LHR-2024-001",
    });

    // Preferences
    const [preferences, setPreferences] = useState({
        theme: "light",
        language: "en",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        currency: "PKR",
        lowStockThreshold: 50,
        expiryAlertDays: 60,
        enableNotifications: true,
        enableEmailAlerts: true,
        autoBackup: true,
    });

    // Financial settings
    const [financialSettings, setFinancialSettings] = useState({
        taxRate: 0,
        taxNumber: "1234567-8",
        invoicePrefix: "INV-",
        receiptFooter: "Thank you for your purchase!",
        enableDiscount: true,
        maxDiscountPercent: 20,
    });

    const roleBadge = {
        Admin: { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        Pharmacist: { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" },
        Cashier: { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    }[demoRole];

    const handleLogout = () => navigate("/login/web");

    const handleSave = () => {
        alert("Settings saved successfully!");
        setHasChanges(false);
    };

    const handleStoreChange = (field, value) => {
        setStoreSettings({ ...storeSettings, [field]: value });
        setHasChanges(true);
    };

    const handlePreferenceChange = (field, value) => {
        setPreferences({ ...preferences, [field]: value });
        setHasChanges(true);
    };

    const handleFinancialChange = (field, value) => {
        setFinancialSettings({ ...financialSettings, [field]: value });
        setHasChanges(true);
    };

    const renderStoreSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Store Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={storeSettings.name}
                            onChange={(e) => handleStoreChange("name", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
                        <input
                            type="text"
                            value={storeSettings.tagline}
                            onChange={(e) => handleStoreChange("tagline", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Mail className="inline h-4 w-4 mr-1" />
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={storeSettings.email}
                            onChange={(e) => handleStoreChange("email", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Phone className="inline h-4 w-4 mr-1" />
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={storeSettings.phone}
                            onChange={(e) => handleStoreChange("phone", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Globe className="inline h-4 w-4 mr-1" />
                            Website
                        </label>
                        <input
                            type="text"
                            value={storeSettings.website}
                            onChange={(e) => handleStoreChange("website", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={storeSettings.address}
                            onChange={(e) => handleStoreChange("address", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <input
                            type="text"
                            value={storeSettings.city}
                            onChange={(e) => handleStoreChange("city", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
                        <input
                            type="text"
                            value={storeSettings.state}
                            onChange={(e) => handleStoreChange("state", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ZIP/Postal Code</label>
                        <input
                            type="text"
                            value={storeSettings.zipCode}
                            onChange={(e) => handleStoreChange("zipCode", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                        <input
                            type="text"
                            value={storeSettings.country}
                            onChange={(e) => handleStoreChange("country", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Legal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tax Number (NTN) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={storeSettings.ntn}
                            onChange={(e) => handleStoreChange("ntn", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Pharmacy License <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={storeSettings.license}
                            onChange={(e) => handleStoreChange("license", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUserManagement = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Staff Members</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage user accounts and permissions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all">
                    <Plus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Last Login
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === "Admin"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : user.role === "Pharmacist"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-slate-600">{user.lastLogin}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPreferences = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <Palette className="inline h-5 w-5 mr-2" />
                    Appearance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                        <select
                            value={preferences.theme}
                            onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto (System)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                        <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceChange("language", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        >
                            <option value="en">English</option>
                            <option value="ur">Urdu</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <Clock className="inline h-5 w-5 mr-2" />
                    Regional Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                        <select
                            value={preferences.dateFormat}
                            onChange={(e) => handlePreferenceChange("dateFormat", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Time Format</label>
                        <select
                            value={preferences.timeFormat}
                            onChange={(e) => handlePreferenceChange("timeFormat", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        >
                            <option value="12h">12 Hour</option>
                            <option value="24h">24 Hour</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                        <select
                            value={preferences.currency}
                            onChange={(e) => handlePreferenceChange("currency", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        >
                            <option value="PKR">PKR (₨)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <Bell className="inline h-5 w-5 mr-2" />
                    Notifications & Alerts
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Enable Notifications</p>
                            <p className="text-xs text-slate-500 mt-0.5">Receive in-app notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.enableNotifications}
                                onChange={(e) => handlePreferenceChange("enableNotifications", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Email Alerts</p>
                            <p className="text-xs text-slate-500 mt-0.5">Receive alerts via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.enableEmailAlerts}
                                onChange={(e) => handlePreferenceChange("enableEmailAlerts", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Low Stock Threshold
                            </label>
                            <input
                                type="number"
                                value={preferences.lowStockThreshold}
                                onChange={(e) => handlePreferenceChange("lowStockThreshold", parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Expiry Alert (Days Before)
                            </label>
                            <input
                                type="number"
                                value={preferences.expiryAlertDays}
                                onChange={(e) => handlePreferenceChange("expiryAlertDays", parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFinancialSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Tax Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={financialSettings.taxRate}
                            onChange={(e) => handleFinancialChange("taxRate", parseFloat(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tax Number</label>
                        <input
                            type="text"
                            value={financialSettings.taxNumber}
                            onChange={(e) => handleFinancialChange("taxNumber", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Invoice Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Prefix</label>
                        <input
                            type="text"
                            value={financialSettings.invoicePrefix}
                            onChange={(e) => handleFinancialChange("invoicePrefix", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Receipt Footer Message</label>
                        <textarea
                            value={financialSettings.receiptFooter}
                            onChange={(e) => handleFinancialChange("receiptFooter", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Discount Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Enable Discounts</p>
                            <p className="text-xs text-slate-500 mt-0.5">Allow discounts on sales</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={financialSettings.enableDiscount}
                                onChange={(e) => handleFinancialChange("enableDiscount", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    {financialSettings.enableDiscount && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Maximum Discount (%)
                            </label>
                            <input
                                type="number"
                                value={financialSettings.maxDiscountPercent}
                                onChange={(e) => handleFinancialChange("maxDiscountPercent", parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSecurityBackup = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <Key className="inline h-5 w-5 mr-2" />
                    Security
                </h3>
                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Key className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-900">Change Password</p>
                                <p className="text-xs text-slate-500">Update your account password</p>
                            </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-slate-400 -rotate-90" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-slate-400 -rotate-90" />
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <Database className="inline h-5 w-5 mr-2" />
                    Backup & Restore
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Automatic Backup</p>
                            <p className="text-xs text-slate-500 mt-0.5">Daily automatic database backup</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.autoBackup}
                                onChange={(e) => handlePreferenceChange("autoBackup", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-colors">
                            <Download className="h-5 w-5" />
                            Download Backup
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors">
                            <Upload className="h-5 w-5" />
                            Restore Backup
                        </button>
                    </div>

                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-amber-900">Last Backup</p>
                                <p className="text-xs text-amber-700 mt-1">2026-01-27 at 02:00 AM</p>
                                <p className="text-xs text-amber-600 mt-2">Next scheduled backup: Today at 02:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAbout = () => (
        <div className="space-y-6">
            <div className="text-center py-8">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mx-auto mb-4">
                    <Store className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">EazyRX</h2>
                <p className="text-sm text-slate-600 mt-2">Pharmacy Management System</p>
                <p className="text-xs text-slate-500 mt-1">Version 1.0.0</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Developer</p>
                    <p className="text-sm font-semibold text-slate-900">EazyRX Team</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">License</p>
                    <p className="text-sm font-semibold text-slate-900">Commercial</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Release Date</p>
                    <p className="text-sm font-semibold text-slate-900">January 2026</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Support</p>
                    <p className="text-sm font-semibold text-slate-900">support@eazyrx.com</p>
                </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                <h3 className="text-base font-semibold text-primary-900 mb-3">Need Help?</h3>
                <div className="space-y-2">
                    <a
                        href="#"
                        className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-900 transition-colors"
                    >
                        <Globe className="h-4 w-4" />
                        Documentation
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-900 transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        Contact Support
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-900 transition-colors"
                    >
                        <Info className="h-4 w-4" />
                        Release Notes
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">
                <Sidebar />

                <main className="flex-1">
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
                                <p className="text-sm text-slate-500 mt-0.5">Manage system configuration and preferences</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role Selector */}
                                <div className="relative">
                                    <select
                                        value={demoRole}
                                        onChange={(e) => setDemoRole(e.target.value)}
                                        className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer transition-colors"
                                    >
                                        <option>Admin</option>
                                        <option>Pharmacist</option>
                                        <option>Cashier</option>
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Role Badge */}
                                <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold border ${roleBadge.cls}`}>
                                    {roleBadge.label}
                                </span>

                                {/* User Info */}
                                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">Demo User</p>
                                        <p className="text-xs text-slate-500">demo@eazyrx.local</p>
                                    </div>
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                                        DU
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Sidebar Tabs */}
                            <div className="lg:col-span-1">
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-2 sticky top-24">
                                    {SETTINGS_TABS.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="lg:col-span-3">
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                                    {activeTab === "store" && renderStoreSettings()}
                                    {activeTab === "users" && renderUserManagement()}
                                    {activeTab === "preferences" && renderPreferences()}
                                    {activeTab === "financial" && renderFinancialSettings()}
                                    {activeTab === "security" && renderSecurityBackup()}
                                    {activeTab === "about" && renderAbout()}
                                </div>

                                {/* Save Button */}
                                {activeTab !== "about" && activeTab !== "users" && (
                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        {hasChanges && (
                                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                                <AlertCircle className="h-4 w-4" />
                                                You have unsaved changes
                                            </div>
                                        )}
                                        <button
                                            onClick={handleSave}
                                            disabled={!hasChanges}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
