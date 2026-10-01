import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kbcut.app',
  appName: 'KBCut',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Platform configurations
  }
};

export default config;
