/**
 * IndexedDB Service for KBCut
 * Safely persists recent compression history and user's reusable drawn signatures locally.
 * Zero external telemetry or uploads.
 */

export interface HistoryItem {
  id: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  targetKb: number;
  timestamp: number;
  mimeType: string;
  blob?: Blob;
}

export interface SavedSignature {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: number;
}

const DB_NAME = 'kbcut_db';
const DB_VERSION = 1;
const STORE_HISTORY = 'compression_history';
const STORE_SIGNATURES = 'saved_signatures';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        const histStore = db.createObjectStore(STORE_HISTORY, { keyPath: 'id' });
        histStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_SIGNATURES)) {
        db.createObjectStore(STORE_SIGNATURES, { keyPath: 'id' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const storageService = {
  async addHistory(item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string; timestamp?: number }): Promise<string> {
    const db = await openDb();
    const id = item.id || `hist_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const fullItem: HistoryItem = {
      ...item,
      id,
      timestamp: item.timestamp || Date.now(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_HISTORY, 'readwrite');
      const store = tx.objectStore(STORE_HISTORY);
      store.put(fullItem);
      tx.oncomplete = () => {
        // Enforce max 30 recent items to conserve device disk space
        this.pruneHistory();
        resolve(id);
      };
      tx.onerror = () => reject(tx.error);
    });
  },

  async getAllHistory(): Promise<HistoryItem[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_HISTORY, 'readonly');
      const store = tx.objectStore(STORE_HISTORY);
      const req = store.getAll();
      req.onsuccess = () => {
        const items: HistoryItem[] = req.result || [];
        // Sort newest first
        items.sort((a, b) => b.timestamp - a.timestamp);
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async deleteHistory(id: string): Promise<boolean> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_HISTORY, 'readwrite');
      const store = tx.objectStore(STORE_HISTORY);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  async clearAllHistory(): Promise<boolean> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_HISTORY, 'readwrite');
      const store = tx.objectStore(STORE_HISTORY);
      store.clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  async pruneHistory(maxItems: number = 30): Promise<void> {
    try {
      const items = await this.getAllHistory();
      if (items.length > maxItems) {
        const db = await openDb();
        const tx = db.transaction(STORE_HISTORY, 'readwrite');
        const store = tx.objectStore(STORE_HISTORY);
        for (let i = maxItems; i < items.length; i++) {
          store.delete(items[i].id);
        }
      }
    } catch {
      // Ignore prune errors
    }
  },

  /* Signatures */
  async saveSignature(dataUrl: string, name: string = 'My Signature'): Promise<SavedSignature> {
    const db = await openDb();
    const sig: SavedSignature = {
      id: `sig_${Date.now()}`,
      name,
      dataUrl,
      createdAt: Date.now(),
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SIGNATURES, 'readwrite');
      const store = tx.objectStore(STORE_SIGNATURES);
      store.put(sig);
      tx.oncomplete = () => resolve(sig);
      tx.onerror = () => reject(tx.error);
    });
  },

  async getAllSignatures(): Promise<SavedSignature[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SIGNATURES, 'readonly');
      const store = tx.objectStore(STORE_SIGNATURES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async deleteSignature(id: string): Promise<boolean> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SIGNATURES, 'readwrite');
      const store = tx.objectStore(STORE_SIGNATURES);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
};
