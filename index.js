const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// คิวคำสั่งจากเว็บ → Roblox
let queue = [];

// ข้อมูลผู้เล่นที่ Roblox ส่งมาอัพเดท
let playerList = [];

// Roblox ดึงคำสั่ง
app.get("/commands", (req, res) => {
  res.json({ commands: queue });
  queue = [];
});

// เว็บส่งคำสั่งไป Roblox
app.post("/admin/command", (req, res) => {
  queue.push(req.body);
  res.json({ success: true });
});

// Roblox อัพเดทรายชื่อผู้เล่น (ทุก 5 วินาที)
app.post("/players/update", (req, res) => {
  playerList = req.body.players || [];
  res.json({ success: true });
});

// เว็บดึงรายชื่อผู้เล่น
app.get("/players", (req, res) => {
  res.json({ players: playerList });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend พร้อมแล้วครับ!");
});
