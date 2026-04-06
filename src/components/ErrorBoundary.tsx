import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

const HomeIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 1000 1000" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect 
      x="240" y="240" width="620" height="620" 
      rx="40" 
      transform="rotate(45 550 550)" 
      fill="black" 
    />
    <rect 
      x="140" y="140" width="620" height="620" 
      rx="40" 
      transform="rotate(45 450 450)" 
      fill="#FF9900" 
    />
    <rect 
      x="325" y="325" width="250" height="250" 
      rx="20" 
      transform="rotate(45 450 450)" 
      fill="black" 
    />
  </svg>
);

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // @ts-ignore
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to an error reporting service if needed
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "";
      let isFirestoreError = false;
      let firestoreDetails = null;

      try {
        if (errorMessage.startsWith('{') && errorMessage.endsWith('}')) {
          firestoreDetails = JSON.parse(errorMessage);
          isFirestoreError = true;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-dark rounded-3xl p-8 border border-red-500/20 shadow-2xl shadow-red-500/10 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-8">
              {isFirestoreError 
                ? "We encountered a security or permission issue while accessing the database."
                : "An unexpected error occurred. Our team has been notified."}
            </p>

            {isFirestoreError && firestoreDetails && (
              <div className="bg-black/40 rounded-xl p-4 mb-8 text-left border border-white/5">
                <p className="text-xs font-mono text-red-400 mb-2 uppercase tracking-wider">Security Violation Detected</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Operation:</span>
                    <span className="text-gray-300 font-mono">{firestoreDetails.operationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Path:</span>
                    <span className="text-gray-300 font-mono truncate ml-4">{firestoreDetails.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Auth Status:</span>
                    <span className="text-gray-300">{firestoreDetails.authInfo?.userId ? 'Logged In' : 'Anonymous'}</span>
                  </div>
                </div>
              </div>
            )}

            {!isFirestoreError && (
              <div className="bg-black/40 rounded-xl p-4 mb-8 text-left border border-white/5 max-h-32 overflow-y-auto">
                <p className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Error Details</p>
                <p className="text-sm font-mono text-red-400 break-words">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
              >
                <RefreshCw size={18} /> Retry
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary hover:bg-brand-secondary text-brand-dark rounded-xl transition-all font-bold"
              >
                <HomeIcon size={18} /> Home
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <a 
                href="/support" 
                className="inline-flex items-center gap-1 text-sm text-brand-primary hover:text-brand-secondary transition-colors"
              >
                Contact Support <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
