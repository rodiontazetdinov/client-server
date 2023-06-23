import axios from "axios";
import React, { useEffect, useState } from "react";

const DownloadFile = ({ fileUrl, fileName }) => {
  // Состояния для отслеживания прогресса загрузки, размера файла и количества потоков
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [threadsCount, setThreadsCount] = useState(0);

  useEffect(() => {
    // Запрашиваем заголовки файла для получения размера файла и количества потоков
    axios
      .head(fileUrl)
      .then((response) => {
        // Извлекаем размер файла из заголовков ответа
        const contentLength = response.headers["content-length"];
        setFileSize(contentLength);

        // Извлекаем количество потоков из заголовка ответа
        const stream = response.headers["X-Threads-Count"];
        setThreadsCount(stream);
      })
      .catch((error) => {
        console.error("Ошибка при получении размера файла:", error);
      });
  }, [fileUrl]);

  const downloadFile = () => {
    // Выполняем GET-запрос для загрузки файла
    axios
      .get(fileUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          // Обновляем прогресс загрузки
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setDownloadProgress(progress);
        },
      })
      .then((response) => {
        // Получаем данные файла в формате Blob
        const data = response.data;

        // Создаем URL-адрес Blob
        const blobUrl = URL.createObjectURL(data);

        // Получаем имя файла из URL-адреса
        const filename = fileUrl.slice(fileUrl.lastIndexOf("/") + 1);

        // Сохраняем информацию о загруженном файле
        const files = JSON.parse(localStorage.getItem("files")) || [];
        const fileObject = { filename, blob: blobUrl };
        files.push(fileObject);
        localStorage.setItem(`files`, JSON.stringify(files));

        // Создаем ссылку для скачивания файла
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${fileUrl.slice(fileUrl.lastIndexOf("/") + 1)}`;
        link.click();
      })
      .catch((error) => {
        // Обрабатываем ошибку загрузки файла
        console.error(error);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  return (
    <button onClick={downloadFile}>
      {fileUrl}
      <p>Размер файла: {fileSize} байт</p>
      <p>Количество запущенных потоков: {threadsCount}</p>
      <progress value={downloadProgress} max={100} />
    </button>
  );
};

export default DownloadFile;
