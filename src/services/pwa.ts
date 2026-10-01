/**
 * PWA Service
 * Manages install prompts and online/offline status
 */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: InstallPromptEvent | null = null;
const listeners = new Set<(canInstall: boolean) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as InstallPromptEvent;
    listeners.forEach((cb) => cb(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((cb) => cb(false));
  });
}

export const pwaService = {
  canInstall(): boolean {
    return !!deferredPrompt;
  },

  async promptInstall(): Promise<boolean> {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    listeners.forEach((cb) => cb(false));
    return outcome === 'accepted';
  },

  subscribe(cb: (canInstall: boolean) => void) {
    listeners.add(cb);
    cb(this.canInstall());
    return () => listeners.delete(cb);
  }
};
