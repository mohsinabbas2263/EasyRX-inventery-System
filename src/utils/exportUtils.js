/**
 * Export Utilities for Reports
 * Supports CSV, Excel, and PDF export
 */

/**
 * Convert data to CSV format
 */
export const exportToCSV = (data, filename = 'report.csv') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Handle values with commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvContent += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, filename);
};

/**
 * Convert data to Excel format (simple CSV with .xlsx extension)
 * For true Excel, would need library like xlsx or exceljs
 */
export const exportToExcel = (data, filename = 'report.xlsx') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // For now, using CSV format with xlsx extension
    // In production, use a library like 'xlsx' for proper Excel files
    exportToCSV(data, filename.replace('.xlsx', '.csv'));

    console.log('Note: For true Excel format, install xlsx library: npm install xlsx');
};

/**
 * Generate PDF report (simple HTML to PDF)
 * For production, use library like jsPDF or pdfmake
 */
export const exportToPDF = (title, data, filename = 'report.pdf') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Create HTML table
    const headers = Object.keys(data[0]);

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                h1 {
                    color: #0d9488;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th {
                    background-color: #0d9488;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-weight: bold;
                }
                td {
                    padding: 10px;
                    border-bottom: 1px solid #e2e8f0;
                }
                tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #64748b;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="footer">
                <p>EazyRX Pharmacy Management System</p>
                <p>© 2026 EazyRX. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-print dialog
    setTimeout(() => {
        printWindow.print();
    }, 250);

    console.log('Note: For true PDF generation, install jsPDF: npm install jspdf jspdf-autotable');
};

/**
 * Helper function to download file
 */
const downloadFile = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * Format data for export (clean up for CSV/Excel)
 */
export const formatDataForExport = (data, columns = null) => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
        const formatted = {};
        const keys = columns || Object.keys(item);

        keys.forEach(key => {
            let value = item[key];

            // Format numbers
            if (typeof value === 'number') {
                value = value.toLocaleString();
            }

            // Format dates
            if (value instanceof Date) {
                value = value.toLocaleDateString();
            }

            // Clean up field names (remove camelCase)
            const cleanKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();

            formatted[cleanKey] = value;
        });

        return formatted;
    });
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix, extension) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${prefix}_${timestamp}.${extension}`;
};

/**
 * Export sales report
 */
export const exportSalesReport = (salesData, format = 'csv') => {
    const formattedData = formatDataForExport(salesData);
    const filename = generateFilename('sales_report', format);

    switch (format) {
        case 'csv':
            exportToCSV(formattedData, filename);
            break;
        case 'excel':
            exportToExcel(formattedData, filename);
            break;
        case 'pdf':
            exportToPDF('Sales Report', formattedData, filename);
            break;
        default:
            console.error('Unsupported format:', format);
    }
};

/**
 * Export inventory report
 */
export const exportInventoryReport = (inventoryData, format = 'csv') => {
    const formattedData = formatDataForExport(inventoryData);
    const filename = generateFilename('inventory_report', format);

    switch (format) {
        case 'csv':
            exportToCSV(formattedData, filename);
            break;
        case 'excel':
            exportToExcel(formattedData, filename);
            break;
        case 'pdf':
            exportToPDF('Inventory Report', formattedData, filename);
            break;
        default:
            console.error('Unsupported format:', format);
    }
};

/**
 * Export purchase report
 */
export const exportPurchaseReport = (purchaseData, format = 'csv') => {
    const formattedData = formatDataForExport(purchaseData);
    const filename = generateFilename('purchase_report', format);

    switch (format) {
        case 'csv':
            exportToCSV(formattedData, filename);
            break;
        case 'excel':
            exportToExcel(formattedData, filename);
            break;
        case 'pdf':
            exportToPDF('Purchase Report', formattedData, filename);
            break;
        default:
            console.error('Unsupported format:', format);
    }
};
