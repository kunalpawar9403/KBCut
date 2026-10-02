declare module '@wasm-zoo/qpdf' {
  export interface QpdfExecOptions {
    files?: Array<{ name: string; data: ArrayBuffer | Uint8Array }>;
    outputs?: string[];
    timeoutMs?: number;
    onLog?: (log: { stream: 'stdout' | 'stderr'; message: string }) => void;
  }

  export interface QpdfExecResult {
    exitCode: number;
    stdout: string;
    stderr: string;
    files: Array<{ name: string; data: Uint8Array }>;
  }

  export interface QpdfRunner {
    load(): Promise<void>;
    exec(args: string[], options?: QpdfExecOptions): Promise<QpdfExecResult>;
    dispose(): void;
  }

  export function load(options?: any): Promise<QpdfRunner>;
  export const isSupported: () => boolean;
}
