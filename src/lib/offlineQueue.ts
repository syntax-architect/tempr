/**
 * HEATLEDGER AI: Offline Upload Queue & PWA Sync Engine (Prompt D9)
 * Stores captures and document uploads in client-side IndexedDB when
 * factory mill yard or shop floor connectivity drops.
 * Automatically synchronizes when network connectivity returns.
 */

export interface OfflineUploadItem {
  id: string;
  filename: string;
  fileBlob: Blob;
  fileType: string;
  sizeBytes: number;
  createdAt: string;
  status: 'pending' | 'uploading' | 'synced' | 'failed';
  retryCount: number;
  lastError?: string;
  metadata?: {
    heatNumber?: string;
    millName?: string;
    notes?: string;
    pageCount?: number;
  };
}

const DB_NAME = 'heatledger_pwa_db';
const DB_VERSION = 1;
const STORE_NAME = 'offline_uploads';

type QueueListener = (items: OfflineUploadItem[]) => void;
const subscribers = new Set<QueueListener>();

function notifySubscribers() {
  getOfflineQueue().then((items) => {
    subscribers.forEach((cb) => {
      try {
        cb(items);
      } catch (err) {
        console.error('Offline queue subscriber error:', err);
      }
    });
  });
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueueOfflineUpload(
  file: File | Blob,
  filename: string,
  metadata?: OfflineUploadItem['metadata']
): Promise<OfflineUploadItem> {
  const db = await openDB();
  const id = `upl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const item: OfflineUploadItem = {
    id,
    filename,
    fileBlob: file,
    fileType: file.type || 'application/octet-stream',
    sizeBytes: file.size,
    createdAt: new Date().toISOString(),
    status: 'pending',
    retryCount: 0,
    metadata,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(item);

    req.onsuccess = () => {
      notifySubscribers();
      resolve(item);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflineQueue(): Promise<OfflineUploadItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = (req.result as OfflineUploadItem[]) || [];
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeQueueItem(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => {
      notifySubscribers();
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

export async function updateQueueItemStatus(
  id: string,
  status: OfflineUploadItem['status'],
  errorMsg?: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => {
      const item = req.result as OfflineUploadItem;
      if (item) {
        item.status = status;
        if (errorMsg) item.lastError = errorMsg;
        if (status === 'failed') item.retryCount += 1;
        store.put(item);
      }
      notifySubscribers();
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

export async function syncPendingQueue(
  uploadFn: (item: OfflineUploadItem) => Promise<boolean>
): Promise<{ synced: number; failed: number }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const items = await getOfflineQueue();
  const pending = items.filter((i) => i.status === 'pending' || i.status === 'failed');

  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    await updateQueueItemStatus(item.id, 'uploading');
    try {
      const success = await uploadFn(item);
      if (success) {
        await updateQueueItemStatus(item.id, 'synced');
        // Auto-remove synced items after successful transfer
        await removeQueueItem(item.id);
        synced++;
      } else {
        await updateQueueItemStatus(item.id, 'failed', 'Server rejected upload');
        failed++;
      }
    } catch (err: any) {
      await updateQueueItemStatus(item.id, 'failed', err?.message || 'Network error');
      failed++;
    }
  }

  return { synced, failed };
}

export function subscribeToOfflineQueue(callback: QueueListener): () => void {
  subscribers.add(callback);
  getOfflineQueue().then(callback);

  return () => {
    subscribers.delete(callback);
  };
}

export function isDeviceOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Global auto-sync trigger on reconnect
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    notifySubscribers();
  });
  window.addEventListener('offline', () => {
    notifySubscribers();
  });
}
