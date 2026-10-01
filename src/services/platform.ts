/**
 * Platform Services Abstraction
 * Handles Download, Web Share, File Save, and Camera capture.
 * Structured so Capacitor plugins (@capacitor/filesystem, @capacitor/share)
 * can easily plug in without changing UI code.
 */

export interface ShareOptions {
  title: string;
  text?: string;
  blob?: Blob;
  fileName?: string;
}

export const platformService = {
  isNativeApp(): boolean {
    return typeof (window as any).Capacitor !== 'undefined';
  },

  /**
   * Save / download a Blob or File to user's device
   */
  async saveFile(blob: Blob, defaultFileName: string): Promise<boolean> {
    try {
      // In native Capacitor environment:
      if (this.isNativeApp() && (window as any).Capacitor?.Plugins?.Filesystem) {
        // Future Capacitor Filesystem implementation
        // const reader = new FileReader();
        // ...
      }

      // Standard Web / PWA fallback
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = defaultFileName;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      }, 1500);

      return true;
    } catch (err) {
      console.error('File save error:', err);
      return false;
    }
  },

  /**
   * Native Web Share API with file support or fallback
   */
  async shareFile(options: ShareOptions): Promise<'shared' | 'downloaded' | 'failed'> {
    try {
      if (options.blob && options.fileName && navigator.canShare) {
        const file = new File([options.blob], options.fileName, { type: options.blob.type });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: options.title,
            text: options.text || 'Created with KBCut',
          });
          return 'shared';
        }
      }

      // If navigator.share exists without file support
      if (navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.text || 'Created with KBCut',
          url: window.location.origin,
        });
        return 'shared';
      }

      // Fallback: Trigger download if share is not available
      if (options.blob && options.fileName) {
        await this.saveFile(options.blob, options.fileName);
        return 'downloaded';
      }

      return 'failed';
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled share dialog
        return 'failed';
      }
      // Trigger download fallback
      if (options.blob && options.fileName) {
        await this.saveFile(options.blob, options.fileName);
        return 'downloaded';
      }
      return 'failed';
    }
  },

  /**
   * Copy text or data URL to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};
