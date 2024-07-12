import { WorkerMessage } from "./workerMessage";
import { WorkerLabelsEnum } from "../types/WorkerLabelsEnum";
import SparkMD5 from "spark-md5";

addEventListener("message", ({ data }: { data: ArrayBuffer }) => {
  const hash = SparkMD5.ArrayBuffer.hash(data);

  postMessage(
    new WorkerMessage(WorkerLabelsEnum.DONE, {
      result: hash,
      chunk: data,
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    [data] 
  );
});
