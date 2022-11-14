import { useState } from "react";

export default function Upload(props) {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  function base64toPDF(data) {
    var bufferArray = base64ToArrayBuffer(data);
    var blobStore = new Blob([bufferArray], { type: "application/pdf" });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blobStore);
      return;
    }
    var data = window.URL.createObjectURL(blobStore);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = data;
    link.download = "file.pdf";
    link.click();
    window.URL.revokeObjectURL(data);
    link.remove();
  }

  function base64ToArrayBuffer(data) {
    var bString = window.atob(data);
    var bLength = bString.length;
    var bytes = new Uint8Array(bLength);
    for (var i = 0; i < bLength; i++) {
      var ascii = bString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  const signHandler = async (event) => {
    const body = new FormData();
    body.append("file", image);
    fetch("/api/complete3", {
      method: "POST",
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        base64toPDF(res.finalPdfString);
      });
  };

  const verifyHandler = async (event) => {
    const body = new FormData();
    body.append("file", image);
    fetch("/api/verifyFile2", {
      method: "POST",
      body,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <div>
      <div>
        <img src={createObjectURL} />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={verifyHandler}
        >
          verify it
        </button>
        <button className="btn btn-primary" type="submit" onClick={signHandler}>
          sign it
        </button>
      </div>
    </div>
  );
}
