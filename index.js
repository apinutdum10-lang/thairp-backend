const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let queue = [];

app.get("/commands", (req, res) => {
  res.json({ commands: queue });
  queue = [];
});

app.post("/admin/command", (req, res) => {
  queue.push(req.body);
  res.json({ success: true });
});

app.listen(process.env.PORT || 3000);
