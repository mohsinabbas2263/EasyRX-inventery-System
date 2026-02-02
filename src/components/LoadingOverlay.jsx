import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * LoadingOverlay Component
 * Full-page or container overlay with loading spinner
 */
export default function LoadingOverlay({
    isLoading = true,
    text = 'Loading...',
    fullPage = false,
    children
}) {
    if (!isLoading) {
        return <>{children}</>;
    }

    const overlayClasses = fullPage
        ? 'fixed inset-0 z-50'
        : 'absolute inset-0 z-10';

    return (
        <>
            {children}
            <div className={`${overlayClasses} bg-white/80 backdrop-blur-sm flex items-center justify-center`}>
                <LoadingSpinner size="large" text={text} />
            </div>
        </>
    );
}

/**
 * PageLoader - Full page loading state
 */
export function PageLoader({ text = 'Loading page...' }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <LoadingSpinner size="xlarge" text={text} />
        </div>
    );
}

/**
 * SectionLoader - Loading state for a section
 */
export function SectionLoader({ text = 'Loading...' }) {
    return (
        <div className="py-12 flex items-center justify-center">
            <LoadingSpinner size="large" text={text} />
        </div>
    );
}
