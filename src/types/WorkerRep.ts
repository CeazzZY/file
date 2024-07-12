import { WorkerMessage } from "../utils/workerMessage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WorkerRep<T = any> {
  data: WorkerMessage<T>;
}
