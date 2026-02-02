import React, { useRef } from "react";
import { X, Receipt, Printer, Download, Check } from "lucide-react";
import { exportToPDF } from "../../../utils/exportUtils";

export default function ReceiptModal({ transaction, onClose }) {
    const receiptRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Format transaction data for PDF
        const pdfData = transaction.items.map(item => ({
            'Product': item.name,
            'Generic': item.genericName,
            'Qty': item.quantity,
            'Price': `PKR ${item.price.toFixed(2)}`,
            'Total': `PKR ${(item.quantity * item.price).toFixed(2)}`
        }));

        // Add summary rows
        pdfData.push(
            { 'Product': '', 'Generic': '', 'Qty': '', 'Price': 'Subtotal:', 'Total': `PKR ${transaction.subtotal.toFixed(2)}` },
        );

        if (transaction.discount > 0) {
            pdfData.push(
                { 'Product': '', 'Generic': '', 'Qty': '', 'Price': 'Discount:', 'Total': `- PKR ${transaction.discount.toFixed(2)}` },
            );
        }

        pdfData.push(
            { 'Product': '', 'Generic': '', 'Qty': '', 'Price': 'Total:', 'Total': `PKR ${transaction.total.toFixed(2)}` },
            { 'Product': '', 'Generic': '', 'Qty': '', 'Price': 'Amount Paid:', 'Total': `PKR ${transaction.amountPaid.toFixed(2)}` },
            { 'Product': '', 'Generic': '', 'Qty': '', 'Price': 'Change:', 'Total': `PKR ${transaction.change.toFixed(2)}` }
        );

        exportToPDF(
            `EazyRX Receipt - ${transaction.id}`,
            pdfData,
            `receipt_${transaction.id}.pdf`
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                            <Check className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Payment Successful!</h2>
                            <p className="text-sm text-slate-600 mt-0.5">Transaction completed successfully</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/50 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Receipt Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div ref={receiptRef} className="receipt-printable max-w-md mx-auto bg-white">
                        {/* Receipt Header */}
                        <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">EazyRX</h1>
                            <p className="text-sm text-slate-600">Pharmacy & Healthcare</p>
                            <p className="text-xs text-slate-500 mt-2">Johar Town, Lahore</p>
                            <p className="text-xs text-slate-500">Phone: +92 300 1234567</p>
                            <p className="text-xs text-slate-500">NTN: 1234567-8</p>
                        </div>

                        {/* Transaction Info */}
                        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Invoice #:</span>
                                <span className="font-semibold text-slate-900">{transaction.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Date & Time:</span>
                                <span className="font-semibold text-slate-900">{transaction.date}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Customer:</span>
                                <span className="font-semibold text-slate-900">{transaction.customer}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Payment Method:</span>
                                <span className="font-semibold text-slate-900">{transaction.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase">Items</h3>
                            <div className="space-y-3">
                                {transaction.items.map((item, index) => (
                                    <div key={index} className="border-b border-slate-100 pb-2">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.genericName}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                {item.quantity} × PKR {item.price.toFixed(2)}
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                PKR {(item.quantity * item.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 mb-4 pb-4 border-t-2 border-slate-300 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal:</span>
                                <span className="font-semibold text-slate-900">PKR {transaction.subtotal.toFixed(2)}</span>
                            </div>
                            {transaction.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Discount:</span>
                                    <span className="font-semibold text-red-600">- PKR {transaction.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                                <span className="text-slate-900">Total:</span>
                                <span className="text-primary-600">PKR {transaction.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-2 mb-4 pb-4 border-t border-slate-200 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Amount Paid:</span>
                                <span className="font-semibold text-slate-900">PKR {transaction.amountPaid.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Change:</span>
                                <span className="font-semibold text-emerald-600">PKR {transaction.change.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center border-t-2 border-dashed border-slate-300 pt-4 space-y-2">
                            <p className="text-sm font-semibold text-slate-900">Thank you for your purchase!</p>
                            <p className="text-xs text-slate-500">Please keep this receipt for your records</p>
                            <p className="text-xs text-slate-500 mt-3">
                                For queries, contact: support@eazyrx.com
                            </p>

                            {/* Barcode placeholder */}
                            <div className="mt-4 flex justify-center">
                                <div className="bg-slate-900 h-16 w-48 flex items-center justify-center rounded">
                                    <span className="text-white text-xs font-mono">{transaction.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                    >
                        Close
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                        >
                            <Printer className="h-4 w-4" />
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-printable,
          .receipt-printable * {
            visibility: visible;
          }
          .receipt-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}
