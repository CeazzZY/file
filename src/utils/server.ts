import request from "./request";

async function checkFileIfExist(fileHash: string, fileSize: string) {
  console.log(fileHash, fileSize);
  return request
    .get("./exist?hash=" + fileHash + "&size=" + fileSize)
    .then((res) => res.data);
}

async function getExistChunks(fileHash, chunksHash) {
  return request
    .post("./chunks", { hash: fileHash, hashList: chunksHash })
    .then((res) => res.data);
}

async function uploadChunks(param, cb) {
  return request.post("./upload", param).then((res) => {
    cb(10);
    return res.data;
  });
}

async function verifyChunks2(fileHash, chunksHash) {
  return request
    .post("/verify2", { hash: fileHash, hashList: chunksHash })
    .then((res) => res.data);
}

async function mergeChunks(hash, name, size, metadata) {
  return request.post("/merge2", { hash, name, size, metadata }).then((res) => {
    console.log(res.data);
    return res.data;
  });
}

export const server = {
  checkFileIfExist,
  getExistChunks,
  uploadChunks,
  verifyChunks2,
  mergeChunks,
};
