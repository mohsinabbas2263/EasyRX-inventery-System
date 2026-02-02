import React from 'react';

/**
 * SkeletonCard Component
 * Skeleton loader for card-based layouts
 */
export default function SkeletonCard({ variant = 'default', className = '' }) {
    if (variant === 'stats') {
        return (
            <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-200" />
                        <div className="h-6 w-16 rounded-full bg-slate-200" />
                    </div>
                    <div className="h-3 w-24 rounded bg-slate-200 mb-2" />
                    <div className="h-8 w-32 rounded bg-slate-200 mb-2" />
                    <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
            </div>
        );
    }

    if (variant === 'product') {
        return (
            <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
                <div className="animate-pulse">
                    <div className="h-32 w-full rounded-lg bg-slate-200 mb-3" />
                    <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
                    <div className="h-3 w-1/2 rounded bg-slate-200 mb-3" />
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-20 rounded bg-slate-200" />
                        <div className="h-8 w-8 rounded-lg bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className={`rounded-lg border border-slate-200 bg-white p-4 ${className}`}>
                <div className="animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                        <div className="flex-1">
                            <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
                            <div className="h-3 w-1/2 rounded bg-slate-200" />
                        </div>
                        <div className="h-6 w-16 rounded-full bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    // Default card skeleton
    return (
        <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
            <div className="animate-pulse">
                <div className="h-4 w-3/4 rounded bg-slate-200 mb-3" />
                <div className="h-3 w-full rounded bg-slate-200 mb-2" />
                <div className="h-3 w-5/6 rounded bg-slate-200 mb-2" />
                <div className="h-3 w-4/6 rounded bg-slate-200" />
            </div>
        </div>
    );
}

/**
 * SkeletonGrid - Multiple skeleton cards in a grid
 */
export function SkeletonGrid({ count = 4, variant = 'default', cols = 4 }) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[cols]} gap-5`}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} variant={variant} />
            ))}
        </div>
    );
}
