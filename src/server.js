import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); // httpサーバーにアクセス
const wss = new WebSocket.Server({ server }); // httpサーバーにwsサーバーを生成

wss.on("connection", (socket) => {
    console.log("Connected to Browser ✅");
    socket.on("close", ()=> {
        console.log("Disconnected from the Browser X");
    })
    socket.on("message", (messsage) => {
        console.log(messsage.toString('utf8'));
    })
    socket.send("hello!!!");
}); // frontendからconnectionがあったときに実行

server.listen(3000, handleListen); // localhost:3000ではhttp,ws両方受け取れる