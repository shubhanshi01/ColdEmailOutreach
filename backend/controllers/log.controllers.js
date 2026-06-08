let clients = [];

const streamLogs = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
};

const sendLog = (message) => {
  clients.forEach((res) => {
    res.write(`data: ${message}\n\n`);
  });
};

module.exports = { streamLogs, sendLog };