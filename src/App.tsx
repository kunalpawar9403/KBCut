import React, { useState, useEffect } from 'react';
import { I18nProvider } from './i18n';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { SeoLandingPage } from './pages/SeoLandingPage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kbcut_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Track SEO pathname
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kbcut_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigateHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: NavTab) => {
    if (currentPath !== '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current route is an SEO landing page
  const seoSlugs = [
    'compress-image-to-50kb',
    'compress-image-to-100kb',
    'signature-resize-140x60',
    'compress-pdf-to-200kb',
  ];
  const matchedSlug = seoSlugs.find((slug) => currentPath.includes(slug));

  return (
    <I18nProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-brand-500 selection:text-white bg-ambient-light dark:bg-ambient-dark">
        {/* Sticky Header with branding and controls */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateHome={handleNavigateHome}
        />

        {/* Desktop Navigation Bar */}
        <div className="hidden md:block w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md sticky top-16 z-20">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12 text-sm font-bold">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavigateTab('home')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'home' && !matchedSlug
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Compressor
              </button>
              <button
                onClick={() => handleNavigateTab('tools')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'tools'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Exam Tools
              </button>
              <button
                onClick={() => handleNavigateTab('history')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Recent Files
              </button>
              <button
                onClick={() => handleNavigateTab('settings')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Settings & Privacy
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-slate-400">Target Presets:</span>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/compress-image-to-50kb');
                  setCurrentPath('/compress-image-to-50kb');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                SSC 50KB
              </button>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/signature-resize-140x60');
                  setCurrentPath('/signature-resize-140x60');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                140x60 Sign
              </button>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/compress-pdf-to-200kb');
                  setCurrentPath('/compress-pdf-to-200kb');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                PDF 200KB
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: Responsive Wide Layout for Full Website Experience */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-16">
          {matchedSlug ? (
            <SeoLandingPage slug={matchedSlug} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage onNavigateTools={() => setActiveTab('tools')} />
              )}
              {activeTab === 'tools' && <ToolsPage />}
              {activeTab === 'history' && <HistoryPage />}
              {activeTab === 'settings' && (
                <SettingsPage theme={theme} onToggleTheme={toggleTheme} />
              )}
            </>
          )}
        </main>

        {/* Comprehensive Website Footer */}
        <Footer
          onNavigateTab={handleNavigateTab}
          onNavigateSeo={(slug) => {
            window.history.pushState({}, '', `/${slug}`);
            setCurrentPath(`/${slug}`);
          }}
        />

        {/* Mobile 4-tab bottom navigation dock */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={handleNavigateTab}
        />

        {/* Global Toast Container */}
        <ToastContainer />
      </div>
    </I18nProvider>
  );
}

export default App;
