const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const body_parser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { json } = require('body-parser');



// id: username
const onlineUser = {"id1":"jackie"};
//socket id and user name
const userList = [];
const userRoom = new Map();
//socket id : username
const userSocket = new Map();
const Rooms=[{roomName:"jack1",creator:"testRoom",empty:1}];
const Room = [
    {
        roomName:"someRoom",
        player0:"someone",
        socketId0:"dfdf",
        player1:"someone2",
        socketId1:"adsf",
        map:null,
        player0:null,
        player1:null
    }
]
app.set('view engine','ejs');


app.use(function(req,res,next){
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.path);
    next();
})


app.use(express.static("public"));
app.use(express.static("views"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended:true
}))




// routing path:

app.post("/enterGame",entergame,indexpage);
app.get("/gameRoom/:uid",LoadUser,displayGameRoom);
// app.post("/gameRoom",createroom);
app.use("/",indexpage);


// socket path and handler
 

io.on('connection',(socket)=>{
    //console.log(socket.id+" has been in here!");
    socket.on('cRoom',(data)=>{
        // console.log(data["userName"]);
        // console.log(data["roomName"]);
        Rooms.push({roomName:data["roomName"],creator:data["userName"],empty:1});
        onlineUser
        io.emit('update',JSON.stringify(Rooms));
    });
    socket.on('joinRoom',(data)=>{
        // room creator
        console.log(data.targetUser);
        // user 
        console.log(data.user);
        // room name
        console.log(data.targetRoomName);
        updateRoomObject(data.targetRoomName);
        // find another creator socket
        let targetSocket;
        userSocket.forEach(function(uname,sId){
            console.log('exist socket id: '+sId);
            console.log('exist name: '+uname);
            if(uname == data.targetUser){
                targetSocket = sId;
            }
        })
        console.log("target socket is "+targetSocket);
        // register the room with those two socket.
        io.to(targetSocket).to(socket.id).emit("updateRoom",{creator:data.targetUser,otherUser:data.user,room:data.targetRoomName});
        io.emit('update',JSON.stringify(Rooms));
        //send command to two socket.
    })
    socket.on('register',(data)=>{
        console.log(data);
        console.log('register socket id:'+data.socketId);
        console.log('register user data:'+data.userName);
        userSocket.set(data.socketId,data.userName);
    })
    socket.on('startGame',(data)=>{

    })
})




function updateRoomObject(RoomName){
    
    Rooms.forEach(function(element){
        if(element.roomName==RoomName){
            element.empty = 0;
        }
    })
    
}





function indexpage(req,res,next){
    //console.log("must have"+req.message);
    res.render("index.ejs",{message:req.message});
}







function entergame(req,res,next){
    if(userList.includes(req.body.userName)){
        console.log("hero");
        req.message="username already exist, please enter another";
        return next();
    }
    let tempId = uuidv4();
    onlineUser[tempId] = req.body.userName;
    userList.push(req.body.userName);
    res.redirect("/gameRoom/"+tempId);
}




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function LoadUser(req,res,next){
    console.log(req.params.uid);
    console.log(onlineUser[req.params.uid]);
    req.userName = onlineUser[req.params.uid];
    next();
}





function displayGameRoom(req,res,next){
    
    res.render("lobbyRoom.ejs",{rooms:Rooms,username:req.userName});

}






//
app.listen(3000,function(){
    http.listen(5000,function(){
        console.log("server is running at http://localhost:5000");
    })
})
