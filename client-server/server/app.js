require("dotenv").config();

// Подключение переменных окружения
const PORT = process.env.PORT || 8000;

// Подключение модулей и библиотек
const keywordUrls = require("./urls.js");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const createServer = require("http").createServer;

const path = require("path");
const Server = require("socket.io").Server;
const server = createServer(app);

// Конфигурация сервера Socket.IO
const io = new Server(server, {
  cors: ALLOWED_ORIGIN, // Разрешенные источники (домены) для CORS
  serveClient: false, // Отключение предоставления клиентской части Socket.IO
});

// Обработка событий подключения и отключения клиента Socket.IO
io.on("connection", (socket) => {
  console.log("клиент подключился");

  socket.on("request-data", (inputData) => {
    console.log("Получены данные от клиента:", inputData);

    // Отправка ответа клиенту с соответствующими данными
    const responseData = keywordUrls[inputData] ? keywordUrls[inputData] : [];
    io.emit("response-data", responseData);
  });
});

io.on("disconnect", () => {
  console.log("Клиент отключился");
});

// Настройка Express
app.use(cors()); // Включение CORS

// Обработка запросов на скачивание файлов
app.get("/files/:file", (req, res) => {
  console.log("получили запрос");

  const filePath = __dirname + "/files/" + req.params.file;

  // Получение информации о файле
  const fileStats = fs.statSync(filePath);
  const fileSize = fileStats.size;
  console.log(filePath);

  // Расчет скорости загрузки на каждый поток
  const downloadSpeedPerThread = Math.floor(fileSize / maxThreads);

  // Установка заголовков HTTP для передачи файла
  res.setHeader("Content-Length", fileSize);

  // Запуск потоков загрузки
  for (let i = 0; i < maxThreads; i++) {
    const startByte = i * downloadSpeedPerThread;
    const endByte = (i + 1) * downloadSpeedPerThread - 1;

    // Создание потока чтения файла
    const fileStream = fs.createReadStream(filePath);

    // Обработка ошибок чтения файла
    fileStream.on("error", (err) => {
      console.log(err);
    });

    // Установка типа содержимого (Content-Type) и передача данных потока в ответ HTTP
    res.setHeader("Content-Type", "image/jpeg");
    fileStream.pipe(res);
  }
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
