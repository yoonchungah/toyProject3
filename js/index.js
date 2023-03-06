//1.캔버스 셋팅
let canvas;
//그림을 그려주는 역할
let ctx;
//캔버스 만들어서 변수에 넣기
canvas = document.createElement('canvas');
//캔버스의 2d를 ctx에 넣기
ctx = canvas.getContext('2d');
//캔버스 사이즈
canvas.width = 400;
canvas.height = 700;
//appendChild 선택한 요소 안에 자식 요소를 추가
document.body.appendChild(canvas);

//이미지 가져오는 변수 생성
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;

//5.게임오버
//게임 상태값을 저장하는 변수 생성
let gameOver = false //ture면 게임 끝 false면 계속

//점수판
let score = 0;

//우주선 좌표는 앞으로 계속 바뀌므로 따로 지정
let spaceshipX = canvas.width/2-30;
let spaceshipY = canvas.height-60;


let bulletList = []; //총알들을 저장하는 리스트
function Bullet(){
  this.x = 0;
  this.y = 0;
  //총알값 초기화
  this.init=function(){
    //우주선의 x,y값으로 초기화 근데 정중앙에 총알이 안오므로 +15px만큼 더해줌 
    this.x = spaceshipX+15;
    this.y = spaceshipY;
    this.alive = true //true면 살아있는 총알 false면 사용한 총알
    bulletList.push(this);
  };
  this.update = function(){
    this.y -= 7;
  };

  this.checkHit = function(){
    for( let i = 0; i < enemyList.length; i++)
    if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x<=enemyList[i].x+50){
      //총알이 사라짐 적군 소멸, 점수획득
      score++;
      this.alive = false; //사용한 총알
      enemyList.splice(i, 1);
    }

  } 
}

//4.적군생성
function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min;
  return randomNum;
}

let enemyList = []; //적군들을 저장하는 리스트
function Enemy(){
  this.x = 0;
  this.y = 0;
  this.init=function(){
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width-50);
    enemyList.push(this);
  };
  this.update = function(){
    this.y += 2; //적군의 속도 조절

    if( this.y >= canvas.height-50 ){
      gameOver = true;
      console.log('게임오버');
    }
  };
}

//스크립트로 이미지 가져오기
function loadImage(){
  backgroundImage = new Image(); //이미지 객체 생성
  backgroundImage.src='img/bg.jpg';

  spaceshipImage = new Image();
  spaceshipImage.src='img/spaceship.png';

  bulletImage = new Image();
  bulletImage.src = 'img/bullet.png';

  enemyImage = new Image();
  enemyImage.src = 'img/enemy.png';

  gameOverImage = new Image();
  gameOverImage.src = 'img/gameover.png';
}



//2.방향키를 조절하여 우주선의 x,y좌표를 바꾸고 다시 render
let keysDown={};
function setupkeyboardListener(){
  // 키를 눌렀을때 값이 들어가고
  document.addEventListener('keydown',(event)=>{
    keysDown[event.keyCode] = true;
    console.log('키다운 객체에 들어간 값은?',keysDown);
  });
  //키를 떼면 값이 삭제된다 
  document.addEventListener('keyup',(event)=>{
    delete keysDown[event.keyCode]
    console.log('버튼 클릭 후',keysDown);

    //스페이스 키를 떼면 총알발사
    if( event.keyCode == 32 ){
      createBullet(); //총알 생성함수
    }
  });
}

//3.총알만들기
function createBullet(){
  console.log('총알생성');
  let b = new Bullet(); //총알 하나 생성
  b.init();
  console.log('총알리스트',bulletList);
}

//적군만들기
function createEnemy(){
  //setInterval(호출하고싶은 함수,시간)
  const interval = setInterval(function(){
    let e = new Enemy(); //적군 하나 생성
    e.init();
  },1000);
}


//좌표값 업데이트 함수
function update(){
  // ->이 눌리면  x좌표의 값이 증가, 감소한다 
  if( 39 in keysDown ){
    spaceshipX += 3; //우주선의 속도 조절
  }
  if( 37 in keysDown ){
    spaceshipX -= 3;
  }
  
  //우주선이 캔버스 밖으로 안나가게 하는 법
  if( spaceshipX <= 0 ){
    spaceshipX = 0;
  }
  if( spaceshipX >= canvas.width -60 ){
    spaceshipX = canvas.width -60;
  }

  //총알발사시 y좌표 업데이트하는 함수 호출
  for( let i = 0; i<bulletList.length; i++){
    if( bulletList[i].alive ){
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  //적군  y좌표 업데이트하는 함수 호출
  for( let i = 0; i<enemyList.length; i++){
    enemyList[i].update();
  }
   
}




//이미지 보여주는 함수
function render(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage,spaceshipX, spaceshipY);
  ctx.fillText(`score:${score}`,20,20);
  ctx.fillStyle = 'white';
  ctx.font = '20px Notosans';

  //총알
  for( let i = 0; i<bulletList.length; i++){
    //총알이 살아있으면 보여줘라
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
    }
  }
  
  //적군
  for( let i = 0; i<enemyList.length; i++){
    ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
  }
}

//이미지를 계속 호출하는 함수
function main(){
  if(!gameOver){
    update(); //좌표값을 업데이트하고
    render(); //그려주고
    requestAnimationFrame(main) //프레임을 계속 호출해주는 함수 
  } else{
    ctx.drawImage(gameOverImage,10,100,380,380);
  }
}

loadImage();
setupkeyboardListener();
createEnemy();
main();