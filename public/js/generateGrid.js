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
    hero0XLocation:0,
    hero0YLocation:0,
    hero0Direction:direction["down"],
    score:0,
    playerImage:'D:/resumeProject/public/images/hero0.png'
}



// store the coin location, use representation of 8*x +y;
let coinLocation=[];
function generateMap(){
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
    coin.src = "D:/resumeProject/public/images/goldcoin.png"
            
}

function displayScore(){
    let result = document.querySelector("h4 span");
    result.innerHTML = score;
}



function animatedScript(){
    let intervalTime = 100;
    let avatarSize =40;
    let frame = 0;
    let imageWidth=120;
    let rowIndex;
    let character = new Image();
    let prevStep;
    character.onload=()=>{
        TID = setInterval(()=>{
            let temp = hero0XLocation*20+hero0YLocation;
            if(prevStep!=null){
                prevStep.clearRect(0,0,300,140);
            }
            let hero0 = document.getElementById(`${temp}`);
            let ctx = hero0.getContext('2d');
            prevStep = ctx;
            rowIndex = (frame*avatarSize) % imageWidth;
            frame++;
            ctx.drawImage(character,rowIndex,hero0Direction*40,avatarSize,avatarSize,0,0,300,140);
            displayScore();
        },intervalTime);
    };
    character.src = 'D:/resumeProject/public/images/hero0.png';
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
            hero0Direction = direction["left"];
            //move left
            if(hero0YLocation-1>=0 && map[hero0XLocation][hero0YLocation-1]!=2){
                hero0YLocation-=1;
                helperCoin((hero0XLocation)*20 + hero0YLocation);
                
            }
        }
        else if(e.key ==="ArrowRight"){
            hero0Direction = direction["right"];
            //move right
            if(hero0YLocation+1<20&& map[hero0XLocation][hero0YLocation+1]!=2){
                hero0YLocation+=1;
                helperCoin((hero0XLocation)*20 + hero0YLocation);
            }
        }
        else if(e.key === "ArrowUp"){
            hero0Direction = direction["up"];
            //move up
            if(hero0XLocation-1>=0&& map[hero0XLocation-1][hero0YLocation]!=2){
                hero0XLocation-=1;
                helperCoin((hero0XLocation)*20 + hero0YLocation);
            }
        }
        else if(e.key ==="ArrowDown"){
            hero0Direction = direction["down"];
            // move down
            if(hero0XLocation+1<20&& map[hero0XLocation+1][hero0YLocation]!=2){
                hero0XLocation+=1;
                helperCoin((hero0XLocation)*20 + hero0YLocation);
            }
        }
    })
}





function main(){
    generateMap();
    animatedScript();
    bindMovingKey();    
    generateRandomCoin();
    gameLoop();
}

main();
