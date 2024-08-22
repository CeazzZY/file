/* eslint-disable @typescript-eslint/no-explicit-any */
import { MinioUploaderService } from "./utils/main";
import { server } from "./utils/server";

function App() {
  let file: File;

  function handleInputChange(e: any) {
    file = e.target.files[0];
  }

  async function handleGetHash() {
    const minioUploaderService = new MinioUploaderService(server);

    minioUploaderService.doUpload(file, (num) => {
      console.log(num);
    });
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
