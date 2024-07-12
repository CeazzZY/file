/**
 * 分割文件
 * @param file
 * @param baseSize 默认分块大小为 1MB
 * @private
 */
export function sliceFile(file: File, baseSize = 1): Blob[] {
  const chunkSize = baseSize * 1024 * 1024 * 10;
  const chunks: Blob[] = [];
  let startPos = 0;
  while (startPos < file.size) {
    chunks.push(file.slice(startPos, startPos + chunkSize));
    startPos += chunkSize;
  }
  return chunks;
}
