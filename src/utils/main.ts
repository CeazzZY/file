/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject } from "rxjs";
import { getArrayBufFromBlobs } from "./getArrayBufFromBlobs";
import { MerkleTree } from "./MerkleTree";
import { WorkerService } from "./workerService";
import { PromisePool } from "./promisePool";
import { sliceFile } from "./sliceFile";

interface IMetaData {
  size: number;
  lastModified: number;
  type: string;
}

export class MinioUploaderService {
  // 用于追踪当前的上传阶段
  uploadStatus = new BehaviorSubject<string>("Please select a file.");

  constructor(private uploadApiSvc: any) {}

  async doUpload(file: File, cb: (progress: number) => void) {
    // 文件大小
    const fileSize = file.size / 1000;

    // 文件元数据
    const metadata: IMetaData = {
      size: file.size,
      lastModified: file.lastModified,
      type: file.type,
    };

    // 文件分片
    this.uploadStatus.next("Parsing file ...");
    const chunksBlob = sliceFile(file);
    const chunksBuf = await getArrayBufFromBlobs(chunksBlob);

    // 按文件分片数量执行不同 Hash 策略
    const workerService = new WorkerService();
    const chunksHash: string[] = await workerService.getMD5ForFiles(chunksBuf);

    const merkleTree = new MerkleTree(chunksHash);
    const fileHash = merkleTree.getRootHash();

    // 检查文件是否已经上传过
    this.uploadStatus.next("Checking file if exist ...");
    const { data: existUrl } = await this.uploadApiSvc.checkFileIfExist(
      fileHash,
      fileSize
    );
    if (existUrl) {
      this.uploadStatus.next("Completed.");
      return existUrl;
    }
    console.log(existUrl);

    // 查询需要上传的分片
    this.uploadStatus.next("Get the chunks that need to be uploaded ...");
    const { data: _chunksNeedUpload } = await this.uploadApiSvc.getExistChunks(
      fileHash,
      chunksHash
    );
    // 完整的上传参数
    this.uploadStatus.next("Building upload params ...");
    const paramsMap = new Map<string, FormData>();
    chunksBlob.forEach((chunk, index) => {
      const data = new FormData();
      data.append("files", chunk);
      data.set("name", file.name);
      data.set("index", index.toString());
      data.set("fileHash", fileHash);
      data.set("chunkHash", chunksHash[index]);
      paramsMap.set(chunksHash[index], data);
    });

    // 获取实际需要上传的分片
    const params = _chunksNeedUpload.map(
      (chunkHash) => paramsMap.get(chunkHash)!
    );
    this.uploadStatus.next("Uploading ...");

    // 基于实时上传进度的进度
    const total = file.size;
    const currentProgressList: number[] = [];
    const intervalId = setInterval(() => {
      const current = currentProgressList.reduce((acc, cur) => acc + cur, 0);
      cb(Math.ceil((current / total) * 100));
    }, 150);

    await new PromisePool(
      params.map(
        (param, index) => () =>
          this.uploadApiSvc.uploadChunks(param, (current) => {
            currentProgressList[index] = current;
          })
      )
    ).exec();
    clearInterval(intervalId);
    cb(100);

    // 获取校验失败的分块并尝试重新上传
    this.uploadStatus.next("Verify uploaded chunks ...");
    const { data: brokenChunksList } = await this.uploadApiSvc.verifyChunks2(
      fileHash,
      chunksHash
    );
    if (brokenChunksList.length !== 0) {
      console.log("brokenChunksList: ", brokenChunksList);
      return "";
    }
    console.log(brokenChunksList);

    // 合并分片
    this.uploadStatus.next("Merging chunks ...");
    const { data: url } = await this.uploadApiSvc.mergeChunks(
      fileHash,
      file.name,
      fileSize,
      metadata
    );
    console.log(url);
    this.uploadStatus.next("Completed.");
    return url;
  }
}
