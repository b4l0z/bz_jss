console.log(`[SETUP] Loading modules`);

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const { Server } = require("socket.io");
const io = new Server(server);

// Servir les fichiers statiques depuis le dossier src
app.use(express.static(path.join(__dirname, "../src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src", "index.html"));
});

server.listen(3000, () => {
  console.log(`[SETUP] Server is running at http://localhost:3000`);
});

// Variables globales pour la vitesse minimale et maximale
let minSpeed = Infinity;
let maxSpeed = 0;

// ----------- speedtest

let fileUrl = "http://ipv4.download.thinkbroadband.com/1GB.zip";
let testTime = 13;

setTimeout(() => {
  startTest();
}, 2000);

function startTest() {
  downloadFile(fileUrl);
}

async function downloadFile(url) {
  let uniqueUrl = url + "?t=" + new Date().getTime();
  const response = await fetch(uniqueUrl);
  const reader = response.body.getReader();
  let receivedLength = 0;
  let startTime = new Date();
  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      receivedLength += value.length;
    }
    let currentTime = new Date();
    let timeElapsed = (currentTime - startTime) / 1000;
    let speed = (8 / 1000000) * (receivedLength / timeElapsed);
    let progress = Math.min((timeElapsed / testTime) * 100, 100);
    let totalGB = (receivedLength / (1024 * 1024 * 1024)).toFixed(2);

    // Mettre à jour les vitesses minimale et maximale
    if (speed < minSpeed) {
      minSpeed = speed;
      io.emit("min_speed", minSpeed.toFixed());
    }
    if (speed > maxSpeed) {
      maxSpeed = speed;
      io.emit("max_speed", maxSpeed.toFixed());
    }

    io.emit("current_speed", speed.toFixed());
    io.emit("progress", progress.toFixed());
    io.emit("totalGB", totalGB);

    console.log(`[PROGRESS] ${progress.toFixed()}%, Speed: ${speed.toFixed()} Mbps, Downloaded: ${totalGB} GB`);

    if (done || timeElapsed > testTime) {
      break;
    }
  }
  currentTime = new Date();
  timeElapsed = (currentTime - startTime) / 1000;
  let averageSpeed = (8 / 1000000) * (receivedLength / timeElapsed);
  averageSpeed = averageSpeed.toFixed();
  console.log(`[AVG SPEED] ${(averageSpeed / 8).toFixed()} Mo/s  (${averageSpeed} Mb/s)`);
}
