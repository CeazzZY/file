/**
 * 将 File 转成 ArrayBuffer
 * 注意: Blob 无法直接移交到 Worker 中, 所以需要放到主线程中执行
 * @param chunks
 * @private
 */
export async function getArrayBufFromBlobs(chunks: Blob[]): Promise<ArrayBuffer[]> {
    async function readAsArrayBuffer(file: Blob) {
      return new Promise<ArrayBuffer>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => resolve(e.target!.result as ArrayBuffer);
        fileReader.readAsArrayBuffer(file);
      });
    }
  
    return await Promise.all(
      chunks.map((chunk: Blob) => readAsArrayBuffer(chunk))
    );
  }
  