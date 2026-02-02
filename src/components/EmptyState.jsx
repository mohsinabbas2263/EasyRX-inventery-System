import React from 'react';
import { Package, FileText, ShoppingCart, AlertCircle, Search, Inbox } from 'lucide-react';

/**
 * EmptyState Component
 * Display when there's no data to show
 */
export default function EmptyState({
    icon: Icon = Inbox,
    title = 'No data found',
    description = 'There is no data to display at the moment.',
    actionLabel,
    onAction,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
            {/* Icon */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Icon className="h-10 w-10 text-slate-400" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
                {description}
            </p>

            {/* Action Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

/**
 * Pre-configured empty states for common scenarios
 */
export function EmptyProducts({ onAdd }) {
    return (
        <EmptyState
            icon={Package}
            title="No products found"
            description="You haven't added any products yet. Start by adding your first product to the inventory."
            actionLabel="Add Product"
            onAction={onAdd}
        />
    );
}

export function EmptyReports() {
    return (
        <EmptyState
            icon={FileText}
            title="No reports available"
            description="Generate your first report by selecting a date range and report type above."
        />
    );
}

export function EmptyOrders() {
    return (
        <EmptyState
            icon={ShoppingCart}
            title="No orders yet"
            description="You don't have any orders at the moment. Orders will appear here once customers start placing them."
        />
    );
}

export function EmptySearch({ searchTerm }) {
    return (
        <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search terms.`}
        />
    );
}

export function ErrorState({ onRetry }) {
    return (
        <EmptyState
            icon={AlertCircle}
            title="Something went wrong"
            description="We encountered an error while loading the data. Please try again."
            actionLabel="Retry"
            onAction={onRetry}
        />
    );
}
