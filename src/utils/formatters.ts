/**
 * Format bytes to readable string (e.g. "48 KB", "3.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  if (bytes < k) {
    return `${bytes} B`;
  }
  const kb = bytes / k;
  if (kb < 1000) {
    return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  }
  const mb = kb / k;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Format bytes to clean KB number
 */
export function bytesToKb(bytes: number): number {
  return Math.round(bytes / 1024);
}

/**
 * Format timestamp into relative or locale date
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
