document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  socket.on("current_speed", function (speed) {
    document.getElementById("current-speed").innerText = `${speed} Mbps`;
  });

  socket.on("totalGB", function (totalGB) {
    document.getElementById("downloaded-amount").innerText = `${totalGB} GB`;
  });

  socket.on("progress", function (progress) {
    document.getElementById("progress").style.width = `${progress}%`;
  });

  socket.on("min_speed", function (minSpeed) {
    document.getElementById("min-speed").innerHTML = `Min: <strong>${minSpeed}</strong> Mbps`;
  });

  socket.on("max_speed", function (maxSpeed) {
    document.getElementById("max-speed").innerHTML = `Max: <strong>${maxSpeed}</strong> Mbps`;
  });
});
