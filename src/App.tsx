import React, { useState, useEffect } from 'react';
import { I18nProvider } from './i18n';
import { Header } from './components/common/Header';
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-brand-500 selection:text-white">
        {/* Sticky Header with branding and controls */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateHome={handleNavigateHome}
        />

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-4 flex items-center justify-center space-x-8 h-12 text-sm font-bold">
            <button
              onClick={() => {
                if (currentPath !== '/') {
                  window.history.pushState({}, '', '/');
                  setCurrentPath('/');
                }
                setActiveTab('home');
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'home' && !matchedSlug
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Compressor
            </button>
            <button
              onClick={() => {
                if (currentPath !== '/') {
                  window.history.pushState({}, '', '/');
                  setCurrentPath('/');
                }
                setActiveTab('tools');
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'tools'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Exam Tools
            </button>
            <button
              onClick={() => {
                if (currentPath !== '/') {
                  window.history.pushState({}, '', '/');
                  setCurrentPath('/');
                }
                setActiveTab('history');
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              History
            </button>
            <button
              onClick={() => {
                if (currentPath !== '/') {
                  window.history.pushState({}, '', '/');
                  setCurrentPath('/');
                }
                setActiveTab('settings');
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Main Content Area: Centered, Mobile-First 390px, Scalable to Desktop */}
        <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-4 pb-24 md:pb-12">
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

        {/* Mobile 4-tab bottom navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            if (currentPath !== '/') {
              window.history.pushState({}, '', '/');
              setCurrentPath('/');
            }
            setActiveTab(tab);
          }}
        />

        {/* Global Toast Container */}
        <ToastContainer />
      </div>
    </I18nProvider>
  );
}

export default App;
