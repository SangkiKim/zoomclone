import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); // httpサーバーにアクセス
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    socket.on("enter_room", (roomName,done) => {
        socket.join(roomName); // roomNameを持ったroomにjoin
        done();
        socket.to(roomName).emit("welcome", socket.nickname); // (event name)
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname, done) => {
        console.log(nickname);
        socket["nickname"] = nickname;
        done();
    });
});

// const sockets = []; // fake database : 接続があったすべてのsocketを格納

// wss.on("connection", (socket) => { // frontendからconnectionがあったときに実行
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser ✅");
//     socket.on("close", ()=> {
//         console.log("Disconnected from the Browser X");
//     })
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload.toString()}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload.toString();
//                 break;
//         }
//     })
// }); 

httpServer.listen(3000, handleListen); // localhost:3000ではhttp,ws両方受け取れる