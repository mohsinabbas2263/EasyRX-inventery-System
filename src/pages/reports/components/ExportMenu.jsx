import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Printer, Mail, ChevronDown } from 'lucide-react';

export default function ExportMenu({ onExport, reportType = 'Sales Report' }) {
    const [isOpen, setIsOpen] = useState(false);

    const exportOptions = [
        {
            label: 'Export as CSV',
            icon: FileText,
            format: 'csv',
            description: 'Comma-separated values',
        },
        {
            label: 'Export as Excel',
            icon: FileSpreadsheet,
            format: 'excel',
            description: 'Microsoft Excel format',
        },
        {
            label: 'Export as PDF',
            icon: Printer,
            format: 'pdf',
            description: 'Printable document',
        },
    ];

    const handleExport = (format) => {
        onExport(format);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Export Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-sm font-bold shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all"
            >
                <Download className="h-4 w-4" />
                Export Report
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl z-20 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-sm font-semibold text-slate-900">Export Options</p>
                            <p className="text-xs text-slate-500 mt-0.5">{reportType}</p>
                        </div>

                        {/* Options */}
                        <div className="py-2">
                            {exportOptions.map((option, index) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleExport(option.format)}
                                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <Icon className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                            <p className="text-xs text-slate-500 text-center">
                                Data exported as of {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
