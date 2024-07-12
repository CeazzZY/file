import { WorkerLabelsEnum } from "../types/WorkerLabelsEnum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WorkerMessage<T = any> {
  label: WorkerLabelsEnum;
  content?: T;

  constructor(label: WorkerLabelsEnum, content?: T) {
    this.label = label;
    this.content = content;
  }
}
