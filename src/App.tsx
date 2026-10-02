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
        {/* Single Unified Modern Header */}
        <Header
          theme={theme}
          activeTab={activeTab}
          onToggleTheme={toggleTheme}
          onNavigateTab={handleNavigateTab}
          onNavigateHome={handleNavigateHome}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-32 md:pb-16">
          {matchedSlug ? (
            <SeoLandingPage slug={matchedSlug} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage onNavigateTools={() => handleNavigateTab('tools')} />
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
