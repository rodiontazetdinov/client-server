import React, { useEffect, useState } from "react";

const DownloadContainer = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Получение списка файлов из локального хранилища при монтировании компонента
    setFiles(getFilesFromLocalStorage());
  }, []);

  const getFilesFromLocalStorage = () => {
    // Получение списка файлов из локального хранилища
    const files = JSON.parse(localStorage.getItem("files"));
    if (!files) {
      // Если список файлов не существует, создаем пустой список и сохраняем его в локальное хранилище
      const initialFiles = [];
      localStorage.setItem("files", JSON.stringify(initialFiles));
      return initialFiles;
    }
    return files;
  };

  const handleDownload = (blobUrl, filename) => {
    try {
      // Создание ссылки для скачивания файла
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      downloadLink.click();
    } catch (error) {
      console.error("Ошибка при восстановлении Blob:", error);
    }
  };

  return (
    <div>
      <h2>Список файлов для загрузки:</h2>
      {files.map((file, index) => (
        <div key={index}>
          <p>Имя файла: {file.filename}</p>
          <button onClick={() => handleDownload(file.blob, file.filename)}>
            Скачать
          </button>
        </div>
      ))}
    </div>
  );
};

export default DownloadContainer;
