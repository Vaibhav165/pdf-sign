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
        some: "hi",
        url: "https://africau.edu/images/default/sample.pdf",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        base64toPDF(res.str);
        // let link = window.URL.createObjectURL(b64toBlob(res.str));
        // window.open(link, "_blank");
      });
  };
  useEffect(() => {}, []);
  return (
    <div>
      <button onClick={handler}>do</button>
    </div>
  );
}

export default Test;
