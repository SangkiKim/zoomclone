const socket = io(); // socket.ioを実行しているサーバーを探してconnect

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", {payload: input.value.toString()},5,"hello",true); // emit(event : なんでも可能, param : StringもintもJavascript Objectもそのまま転送可能, func : サーバーに関数を転送→サーバーが関数を実行→frontendで実行される)
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);