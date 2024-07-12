import { WorkerPoolForMd5s } from "./workerPoolForMd5s";

export class WorkerService {
  readonly MAX_WORKERS = 8;
  md5SingleWorkerPool: WorkerPoolForMd5s | undefined;

  // 计算所有分片的 MD5
  getMD5ForFiles(chunks: ArrayBuffer[]): Promise<string[]> {
    if (this.md5SingleWorkerPool === undefined) {
      this.md5SingleWorkerPool = new WorkerPoolForMd5s(this.MAX_WORKERS);
    }
    return this.md5SingleWorkerPool.exec<string>(chunks);
  }
}
