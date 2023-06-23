import React, { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import DownloadFile from "./DownloadFile";
import "./FormWithSocketIO.css";

const socket = io("http://localhost:8000"); // Инициализация сокета и подключение к серверу (замените на ваш адрес сервера)

const FormWithSocketIO = () => {
  const [inputValue, setInputValue] = useState("");
  const [responseData, setResponseData] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Отправка данных на сервер
    socket.emit("request-data", inputValue);
  };

  // Обработка ответа от сервера
  socket.on("response-data", (data) => {
    setResponseData(data);
  });

  return (
    <div className="form-container">
      <form className="input-container" onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Отправить</button>
      </form>
      {responseData && (
        <div className="response-container">
          <p>Ссылки для скачивания:</p>{" "}
          {responseData.map((url, id) => {
            return (
              <>
                <DownloadFile key={id} fileUrl={url} fileName={url} />
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormWithSocketIO;
