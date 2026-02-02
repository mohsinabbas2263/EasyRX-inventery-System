import React from 'react';

/**
 * LoadingSpinner Component
 * Reusable loading spinner with different sizes and colors
 */
export default function LoadingSpinner({
    size = 'medium',
    color = 'primary',
    text = '',
    className = ''
}) {
    const sizes = {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-2',
        large: 'h-12 w-12 border-3',
        xlarge: 'h-16 w-16 border-4',
    };

    const colors = {
        primary: 'border-teal-600 border-t-transparent',
        secondary: 'border-slate-600 border-t-transparent',
        white: 'border-white border-t-transparent',
        success: 'border-emerald-600 border-t-transparent',
        warning: 'border-amber-600 border-t-transparent',
        danger: 'border-red-600 border-t-transparent',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}
                role="status"
                aria-label="Loading"
            />
            {text && (
                <p className="text-sm font-medium text-slate-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

/**
 * Inline Spinner - Small spinner for inline use
 */
export function InlineSpinner({ className = '' }) {
    return (
        <div
            className={`inline-block h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}

/**
 * Button Spinner - Spinner for buttons
 */
export function ButtonSpinner({ className = '' }) {
    return (
        <div
            className={`inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}
