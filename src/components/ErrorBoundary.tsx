import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let isPermissionError = false;
      try {
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error && parsed.error.includes('insufficient permissions')) {
          isPermissionError = true;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-black tracking-tighter mb-4 text-[#001F3F]">Something went wrong.</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              {isPermissionError 
                ? "접근 권한이 없거나 설정을 확인해야 합니다. 관리자 로그인을 확인해주세요."
                : "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-[#001F3F] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
