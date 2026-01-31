export class CsvUtility {
    /**
     * Converts an array of objects to a CSV string.
     * @param data Array of objects to convert
     * @returns CSV string
     */
    static jsonToCsv(data: any[]): string {
        if (!data || data.length === 0) {
            return '';
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Helper function to escape and quote CSV fields
        const escapeCsvField = (val: any): string => {
            let normalized: string;
            if (val === null || val === undefined) {
                normalized = '';
            } else if (Array.isArray(val)) {
                normalized = JSON.stringify(val);
            } else if (typeof val === 'object') {
                normalized = JSON.stringify(val);
            } else {
                normalized = String(val);
            }
            const escaped = normalized.replace(/"/g, '""');
            return `"${escaped}"`;
        };

        // Add headers
        const escapedHeaders = headers.map(header => escapeCsvField(header));
        csvRows.push(escapedHeaders.join(','));

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                return escapeCsvField(val);
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }
}
