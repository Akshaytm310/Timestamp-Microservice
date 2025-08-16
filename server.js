import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


function buildResponse(dateObj) {
  return {
    unix: dateObj.getTime(),
    utc: dateObj.toUTCString()
  };
}

app.get("/api", (req, res) => {
  const now = new Date();
  res.json(buildResponse(now));
});


app.get("/api/:date", (req, res) => {
  const { date: dateParam } = req.params;

  let date;

  
  if (/^-?\d+$/.test(dateParam)) {
    const ms = Number(dateParam);
    date = new Date(ms);
  } else {
   
    date = new Date(dateParam);
  }

  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  return res.json(buildResponse(date));
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Timestamp Microservice listening on http://localhost:${PORT}`);
});
