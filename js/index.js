//캔버스 세팅
let canvas;
let ctx;
//캔버스 만들어서 변수에 넣기
canvas = document.createElement('canvas');
//캔버스의 2d를 ctx에 넣기
ctx = canvas.getContext('2d');
//캔버스 사이즈 정하기
canvas.width = 400;
canvas.height = 700;
//appendChild 선택한 요소 안에 자식 요소를 추가하겠다
document.body.appendChild(canvas);