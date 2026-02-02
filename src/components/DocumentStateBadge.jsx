import React from 'react';
import { getStateBadge } from '../utils/documentStates';

/**
 * Document State Badge Component
 * Displays the current state of a business document with consistent styling
 */
export const DocumentStateBadge = ({ state, showDot = true, className = '' }) => {
    const badge = getStateBadge(state);

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.color} ${className}`}
            title={badge.description}
        >
            {showDot && (
                <div className={`h-1.5 w-1.5 rounded-full ${badge.dotColor}`}></div>
            )}
            {badge.label}
        </span>
    );
};

export default DocumentStateBadge;
