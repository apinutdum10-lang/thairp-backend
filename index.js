const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let queue = [];
let playerList = [];
let alertList = [];

app.get("/commands", (req, res) => {
    res.json({ commands: queue });
    queue = [];
});

app.post("/admin/command", (req, res) => {
    queue.push(req.body);
    res.json({ success: true });
});

app.post("/players/update", (req, res) => {
    playerList = req.body.players || [];
    res.json({ success: true });
});

app.get("/players", (req, res) => {
    res.json({ players: playerList });
});

app.post("/alert", (req, res) => {
    alertList.push({ ...req.body, time: new Date().toISOString() });
    res.json({ success: true });
});

app.get("/alerts", (req, res) => {
    res.json({ alerts: alertList });
});

app.get("/", (req, res) => {
    res.json({ status: "ok", players: playerList.length });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Backend พร้อมแล้วครับ!");
});
