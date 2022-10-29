import { createContext, useState } from "react";

const FileContext = createContext();

export const FileContextProvider = ({ children }) => {
  const [file, setFile] = useState();

  return (
    <FileContext.Provider value={[file, setFile]}>
      {children}
    </FileContext.Provider>
  );
};

export default FileContext;
