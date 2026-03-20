import { Component } from 'react';
import { Translation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Translation>
          {(t) => (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-white mb-3">{t('error.title')}</h1>
                <p className="text-slate-400 mb-8">{t('error.message')}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    aria-label={t('error.reloadLabel')}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  >
                    {t('error.reload')}
                  </button>
                  <a
                    href="/Get-Started-with-Web3/"
                    aria-label={t('error.backHomeLabel')}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    {t('error.backHome')}
                  </a>
                </div>
              </div>
            </div>
          )}
        </Translation>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
