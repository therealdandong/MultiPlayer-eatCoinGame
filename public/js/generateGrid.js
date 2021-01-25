const socket = io();
const grid = document.querySelector('.grid');
let squares;
const map=[];
let TID;

let hero0XLocation=0;
let hero0YLocation=0;
let direction={"up":3,"down":0,"left":1,"right":2};
let hero0Direction=direction["down"];
let score = 0;
let playerObject = {
    heroXLocation:0,
    heroYLocation:0,
    heroDirection:direction["down"],
    score:0,
    playerImage:'../images/hero0.png'
}
let guestObject = {
    heroXLocation:19,
    heroYLocation:19,
    heroDirection:direction["down"],
    score:0,
    playerImage:'../images/hero1.png'
}



// store the coin location, use representation of 20*x +y;
let coinLocation=[];
function generateMap(map){
    assignMap(map);
}

function assignMap(map){
    let ids = 0;
    for(let x=0;x<20;x++){
        let tempRow = [];
        for(let y=0;y<20;y++){
            let tempGround =Math.floor(Math.random()*4); 
            tempRow.push(tempGround);
            grid.innerHTML+=`<canvas id="${ids}"class="square" ></canvas>`;
            ids++;
        }
        map.push(tempRow);
    }
    squares = document.querySelectorAll('.square');
    let index=0;
    squares.forEach(function(element){
        element.classList.add(`ground${map[Math.floor(index/20)][index%20]}`);
        index++;
    })
}





function generateRandomCoin(){
    let coinNumber = 0;
    let tempx;
    let tempy;
    let coin = new Image();
    coin.onload=()=>{
        while(coinNumber<10){
            tempx=Math.floor(Math.random()*20);
            tempy=Math.floor(Math.random()*20);
            console.log(tempx);
            console.log(tempy);
            if(map[tempx][tempy]!=2 && !coinLocation.includes(tempx*20+tempy)){
                // draw coin on the map;
                let index = tempx*20+tempy;
                let coins = document.getElementById(`${index}`);
                let ctx = coins.getContext('2d');
                ctx.drawImage(coin,0,0,40,40,0,0,300,140);
                coinNumber++;
                coinLocation.push(tempx*20+tempy);
            }
        }
    }
    coin.src = "../images/goldcoin.png"
            
}

function displayScore(){
    let result = document.querySelector("h4 span");
    result.innerHTML = score;
}



function characterAnimatedScript(avatar){
    let intervalTime = 100;
    let avatarSize =40;
    let frame = 0;
    let imageWidth=120;
    let rowIndex;
    let character = new Image();
    let prevStep;
    character.onload=()=>{
        TID = setInterval(()=>{
            let temp = (avatar.heroXLocation*20)+(avatar.heroYLocation);
            if(prevStep!=null){
                prevStep.clearRect(0,0,300,140);
            }
            let hero = document.getElementById(`${temp}`);
            let ctx = hero.getContext('2d');
            prevStep = ctx;
            rowIndex = (frame*avatarSize) % imageWidth;
            frame++;
            ctx.drawImage(character,rowIndex,avatar.heroDirection*40,avatarSize,avatarSize,0,0,300,140);
            displayScore();
        },intervalTime);
    };
    character.src = avatar.playerImage;
}





function helperCoin(index){
    console.log(coinLocation);
    console.log(index);
    if(coinLocation.includes(index)){
        score+=1;
        coinLocation = coinLocation.filter(
            (num)=>{
                return num!=(index);
            }
        );
    }
}

function bindMovingKey(){
    window.addEventListener('keyup',(e)=>{
        if(e.key ==="ArrowLeft"){
            playerObject.heroDirection = direction["left"];
            //move left
            if(playerObject.heroYLocation-1>=0 && map[playerObject.heroXLocation][playerObject.heroYLocation-1]!=2){
                playerObject.heroYLocation-=1;
                helperCoin((playerObject.heroXLocation)*20 + playerObject.heroYLocation);
            }
        }
        else if(e.key ==="ArrowRight"){
            playerObject.heroDirection = direction["right"];
            //move right
            if(playerObject.heroYLocation+1<20&& map[playerObject.heroXLocation][playerObject.heroYLocation+1]!=2){
                playerObject.heroYLocation+=1;
                helperCoin((playerObject.heroXLocation)*20 + playerObject.heroYLocation);
            }
        }
        else if(e.key === "ArrowUp"){
            playerObject.heroDirection = direction["up"];
            //move up
            if(playerObject.heroXLocation-1>=0&& map[playerObject.heroXLocation-1][playerObject.heroYLocation]!=2){
                playerObject.heroXLocation-=1;
                helperCoin((playerObject.heroXLocation)*20 + playerObject.heroYLocation);
            }
        }
        else if(e.key ==="ArrowDown"){
            playerObject.heroDirection = direction["down"];
            // move down
            if(playerObject.heroXLocation+1<20&& map[playerObject.heroXLocation+1][playerObject.heroYLocation]!=2){
                playerObject.heroXLocation+=1;
                helperCoin((playerObject.heroXLocation)*20 + playerObject.heroYLocation);
            }
        }
    })
}





function main(){
    generateMap(map);
    characterAnimatedScript(playerObject);
    characterAnimatedScript(guestObject);
    bindMovingKey();    
    generateRandomCoin();
}

main();
