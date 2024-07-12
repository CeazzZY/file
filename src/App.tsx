/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArrayBufFromBlobs } from "./utils/getArrayBufFromBlobs";
import { MerkleTree } from "./utils/MerkleTree";
import { sliceFile } from "./utils/sliceFile";
import { WorkerService } from "./utils/workerService";

function App() {
  let file: File;

  function handleInputChange(e: any) {
    file = e.target.files[0];
  }

  async function handleGetHash() {
    const chunk: Blob[] = sliceFile(file);
    const arrayBuffer: ArrayBuffer[] = await getArrayBufFromBlobs(chunk);
    const workerService = new WorkerService();
    const chunksHash = await workerService.getMD5ForFiles(arrayBuffer);

    const merkleTree = new MerkleTree(chunksHash);
    const fileHash = merkleTree.getRootHash();
    console.log(fileHash);
  }

  return (
    <>
      <div>Hello</div>
      <input type="file" onChange={handleInputChange} />
      <button onClick={handleGetHash}>get Hash</button>
    </>
  );
}

export default App;
