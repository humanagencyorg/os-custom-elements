const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.get("/", (_req, res) => {
  const filePath = path.join(__dirname, "/dist/index.html");
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.type("text/html").send(content);
    }
  });
});

app.use(express.static(path.join(__dirname, "/dist")));

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
