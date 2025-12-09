import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "assets")));

const dataFilePath = path.join(__dirname, "assets", "courses.json");
let jsonData = [];
try {
  const fileContent = fs.readFileSync(dataFilePath, "utf8");
  jsonData = JSON.parse(fileContent);
} catch (error) {
  console.error("Error loading or parsing JSON data from file:", error);
}

app.get("/api/data", function (request, response) {
  response.json(jsonData);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
