const socket = io();

let waitList = [];
let currentRoom;
let ableToEnter=true;
let prev;
let curr;
let allRoom;
let isCreator=false;
let otherPlayer;
let myself;
// need some extra variable to specify which room was selected and enter.



function bindCreateRoom(){
    let roomsList = document.getElementById('roomsList');
    let createRoomBtn = document.getElementById('createRoom'); 
    let enterRoomBtn = document.getElementById('enterRoom');
    createRoomBtn.addEventListener('click',createRoom);
    enterRoomBtn.addEventListener('click',enterRoom);
}


socket.on('connect',()=>{
    console.log("here");
    
});




socket.on('update',(e)=>{
    console.log(e);
    let dictObject = JSON.parse(e);

    updateRoom(dictObject);
    bindList();
    if(!ableToEnter){
        unbindList();
    }
    getallRoom();
})

socket.on('updateRoom',(data)=>{

    createWaitRoom(data.room,data);
    if(isCreator){
        bindstartGame();
    }
})




function getallRoom(){
    let rooms = document.querySelectorAll('#roomsList li .room');
    let creators = document.querySelectorAll('#roomList li .creator');
    allRoom = [];
    for(let i=0;i<rooms.length;i++){
        allRoom.push({roomName:rooms.item(i),creator:creators.item(i)});
    }
}


function  createRoom(){
    let roomName = document.getElementById("roomName").value;
    let userName = document.querySelector('.uName').innerHTML;
    waitList.push(userName);
    myself = userName;
    currentRoom = roomName;
    isCreator = true;
    ableToEnter = false;
    socket.emit('cRoom',{"userName":userName,"roomName":roomName});
    let createBtn = document.getElementById('createRoom');
    let enterBtn = document.getElementById('enterRoom');
    
    enterBtn.disabled = true;
    createBtn.disabled = true;
    createWaitRoom(roomName);
    unbindList();
    socket.emit('register',{"userName":userName,"socketId":socket.id});
    isCreator = true;
    
}

function createWaitRoom(roomName,data){
    let waitRoom = document.querySelector('.waitRoom');
    waitRoom.innerHTML = `<container>
    <h3>current room:${roomName}</h3>
    <h4>current players: </h4>
    <ul><li>${waitList[0]}</li></ul></container>`;
    waitRoom.style.border = "thick solid #000015";
    if(data!=null){
        waitRoom.innerHTML = `<container>
        <h3>current room:${roomName}</h3>
        <h4>room creator:${data.creator}</h4>
        <ul>
        <li>${data.otherUser}</li>
        <li>${data.creator}</li>
        </ul>`;
        if(isCreator){
            waitRoom.innerHTML+=`<button class='startGame'>startGame</button>`;
            otherPlayer = data.otherUser;
        }
        waitRoom.innerHTML+= `</container>`;
    }


}


function enterRoom(){

    let userName = document.querySelector('.uName').innerHTML;
    let roomName = curr.children[0].innerHTML;
    let creator = curr.children[1].innerHTML;
    //2. make sure there is a spot  in the room.
    socket.emit('joinRoom',{targetUser:creator,user:userName,targetRoomName:roomName});
}

function bindstartGame(){
    let startBtn = document.querySelector('.startGame');
    startBtn.addEventListener('click',startGame);
}











// in the room that contain two player name, we need to send those two socket
// to the that room and launch the game.
// only creator can start the game.
// when the game is launch those socket need to force into the room
// 
function startGame(){
    console.log('game start.');
    socket.emit('startGame',{
        room:currentRoom,
        creator:myself,
        others:otherPlayer,
    })
}














function updateRoom(rooms){
    let roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = "";
    rooms.forEach(element => {
        roomsList.innerHTML += `
        <li empty="${element.empty}">
        roomName: <span class='room'>${element.roomName}</span>
         creator: <span class='creator'>${element.creator}</span>
         </li>`
    });
}




function bindList(){
    let allRoom = document.querySelectorAll('#roomsList li');
    allRoom.forEach(function(element){
        if(element.getAttribute('empty') == 1){
            element.addEventListener('click',bindlisthelper);
        }
        else if(element.getAttribute('empty') == 0){
            element.removeEventListener('click',bindlisthelper);
        }
    })
}

function bindlisthelper(event){
    curr = event.target;
    curr.style.background = 'red';
    let enterBtn = document.getElementById('enterRoom');
    enterBtn.disabled = false;
    if(prev !=null && prev != curr){
        prev.style.background = '';
    }
    prev = curr;
}




function unbindList(){
    let allRoom = document.querySelectorAll('#roomsList li');
    allRoom.forEach(function(element){
        element.removeEventListener('click',bindlisthelper);
    })
}

function bindAction(){
    let createBtn = document.getElementById('createRoom');
    let enterBtn = document.getElementById('enterRoom');
    createBtn.addEventListener('click',createRoom);
    enterBtn.addEventListener('click',enterRoom);
    bindList();
    enterBtn.disabled = true;
}
bindAction();
