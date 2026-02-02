import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-12 w-12 text-red-600" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-slate-600 mb-6">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>

                            {/* Error Details (only in development) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                                    <p className="text-sm font-semibold text-red-800 mb-2">
                                        Error Details:
                                    </p>
                                    <p className="text-xs text-red-700 font-mono">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={this.handleReset}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </button>
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                                >
                                    <Home className="h-4 w-4" />
                                    Go Home
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-xs text-slate-500 mt-6">
                            If this problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
