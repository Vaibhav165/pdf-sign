import React, { useState, useEffect } from "react";

function Test() {
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
  const handler = () => {
    fetch("/api/complete2", {
      method: "POST",
      body: JSON.stringify({
        url: "https://africau.edu/images/default/sample.pdf",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        base64toPDF(res.finalPdfString);
        // let link = window.URL.createObjectURL(b64toBlob(res.str));
        // window.open(link, "_blank");
      });
  };

  const [url, setUrl] = useState();
  const [name, setName] = useState();

  const verifyHandler = () => {
    fetch("/api/verifyFile2", {
      method: "POST",
      body: JSON.stringify({
        url: "https://firebasestorage.googleapis.com/v0/b/pdf-sign-5b2d8.appspot.com/o/file.pdf?alt=media&token=a93cdf8c-004b-4f53-bc7f-2bfec928fe04",
        name: "file",
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };
  // const verifyHandler = () => {
  //   if (name && url) {
  //     console.log(name, url);
  //     fetch("/api/verifyFile", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         url: url,
  //         name: name,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => console.log(res));
  //   }
  // };
  useEffect(() => {}, []);
  return (
    <div>
      <button onClick={handler}>Sign</button>

      {/* <input
        type="text"
        placeholder="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /> */}
      <button onClick={verifyHandler}>Verify</button>
    </div>
  );
}

export default Test;
