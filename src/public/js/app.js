const socket = io(); // socket.ioを実行しているサーバーを探してconnect

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");
const room = document.getElementById("room");
const addNick = document.getElementById("add_nick");
const nameForm = addNick.querySelector("form");

welcome.hidden = true;
room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value.toString();
    socket.emit("new_message", input.value.toString(), roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoomInput(){
    addNick.hidden = true;
    welcome.hidden = false;
    roomForm.addEventListener("submit",handleRoomSubmit);
}


function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("enter_room",input.value.toString(),showRoom); // emit(event : なんでも可能, param : StringもintもJavascript Objectもそのまま転送可能, func : サーバーに関数を転送→サーバーが関数を実行→frontendで実行される)
    roomName = input.value.toString();
    input.value = "";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = addNick.querySelector("input");
    socket.emit("nickname", input.value.toString(), showRoomInput);
}

nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome" ,(user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} joined! `);
})

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left T_T`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
}); 

