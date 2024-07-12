import { WorkerWrapper } from "./workerWrapper";
import { WorkerPool } from "./workerPool";

export class WorkerPoolForMd5s extends WorkerPool {
  constructor(maxWorkers: number) {
    super(maxWorkers);
    console.log(new URL("./md5.worker", import.meta.url));
    this.pool = Array.from({ length: this.maxWorkerCount }).map(
      () =>
        new WorkerWrapper(
          new Worker(new URL("./md5.worker.ts", import.meta.url), {
            type: "module",
          })
        )
    );
  }
}
