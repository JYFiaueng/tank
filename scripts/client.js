var gamePanel = $('#gamePanel');
var info = $('#info');
var id = -1;
var speed = 40;
var gameArr = [];//游戏数组，30X30
var myTank = new Tank('t', 13, 28, true);//我的坦克
var tanks = [];//敌人坦克数组
var walls = [];//墙
var missiles = [];//子弹
var exploeds = [];//爆炸
var AINumber = $('#AINumber').value;//AI的最大数量
var AIPos = [[1,1], [10,1], [20,1], [28,1]];//AI的产生位置
var pause = false;//暂停
var level = 9 - $('#level').value;//控制子弹的产生频率0-8，下面用的是random*10
var killTankCount = 0;
var stop = true;//结束
var createAISpeed = $('#createAISpeed').value*2;
var wallNumber = $('#wallNumber').value;

//页面初始化就缓存好音频文件
var audio1 = document.createElement('audio');
audio1.src = './audio/exploed.wav';
var audio2 = document.createElement('audio');
audio2.src = './audio/gameover.wav';
var audio3 = document.createElement('audio');
audio3.src = './audio/missile.wav';
var audio4 = document.createElement('audio');
audio4.src = './audio/wall.wav';

welcome();//显示欢迎

//初始化
function init(){
	id = -1;
	myTank = new Tank('t', 13, 28, true);
	tanks = [];
	walls = [];
	missiles = [];
	pause = false;
	AINumber = $('#AINumber').value;
	level = 9 - $('#level').value;
	createAISpeed = $('#createAISpeed').value*2;
	wallNumber = $('#wallNumber').value
	killTankCount = 0;
	stop = false;
	initGameArr();
	createInitAI();//初始根据AIPos产生几个坦克
	createInitWall();
	game();
}

//更新界面信息
function updateInfo(){
	var html = '';
	html += 'killTankCount:'+killTankCount+'<br/>';
	html += 'tanks:'+tanks.length+'<br/>';
	html += 'missiles:'+missiles.length+'<br/>';
	html += 'exploeds:'+exploeds.length+'<br/>';
	html += 'walls:'+walls.length+'<br/>';
	info.innerHTML = html;
}

//游戏开始运行
function game(){
	var step = 5;
	var AIctrl = 20;
	id = setInterval(function (){
		initGameArr();//这个必须在draw之前
		drawTank(myTank);
		drawAI();
		drawWall();
		drawMissile();
		updateInfo();
		if(!AIctrl){
			createOneAI();
			AIctrl = parseInt(Math.random()*createAISpeed+10);//用随机数来控制AI的产生时间，用10ms限制一下速度
		}
		AIctrl--;
		draw();
		//控制AI的移动速度，这里必须放在draw函数之后
		if(!step){
			moveAI();
			step = 5;
		}
		step--;
	}, speed);
}

//游戏结束
function gameover(){
	clearInterval(id);
	stop = true;
	$('#pause').innerHTML = 'pause';
	$('#stop').innerHTML = 'start';
	$('#pause').title = '暂停';
	$('#stop').title = '开始';
	setTimeout(function(){
		gameoverAnmiation();
	}, 500);
}

//游戏结束动画
function gameoverAnmiation(){
	var i = 30, p, d;
	var t = setInterval(function(){
		if(i===1){
			clearInterval(t);
			welcome();
			return;
		}
		for(var j = 29; j >= 0; j--){
			p = getPos(i-1, j);
			d = document.createElement('div');
			d.style.position = 'absolute';
			d.style.left = p.y+'px';
			d.style.top = p.x+'px';
			gamePanel.appendChild(d);
		}
		i--;
	}, 40);
}

//等待和欢迎界面
function welcome(){
	gamePanel.innerHTML = '';
	var pos = [
				[[11,26], [12,26], [13,26], [10,27], [10,28], [14,27], [14,28], [12,27], [12,28], [12,29], [11,29]],
				[[11,21], [12,21], [13,21], [14,21], [10,22], [11,23], [12, 23], [13,23], [14,23], [10,24], [11,25], [12,25], [13,25], [14,25]],
				[[11,17], [12,17], [13,17], [10,18], [10,19], [14,18], [14,19], [11,20], [12,20], [13,20]],
				[[11,13], [12,13], [13,13], [10,14], [10,15], [14,14], [14,15], [11,16], [13,16]],
				[[6,12], [7,12], [8,12], [9,12], [10,12], [11,12], [12,12], [13,12], [14,12]],
				[[11,8], [12,8], [13,8], [10,9], [10,10], [14,9], [14,10], [12,9], [12,10], [12,11], [11,11]],
				[[10,0], [11,0], [12,1], [13,1], [14,2], [13,3], [12,3.5], [13,4], [14,5], [13,6], [12,6], [11,7], [10,7]]
			];
	var i = 7, p, d;
	var t = setInterval(function(){
		if(i===0){
			clearInterval(t);
			clickStop = false;//欢迎页显示完才能点击开始
			return;
		}
		for(var j = pos[i-1].length-1; j >= 0; j--){
			p = getPos(pos[i-1][j][0], pos[i-1][j][1]);
			d = document.createElement('div');
			d.style.position = 'absolute';
			d.style.left = p.y+'px';
			d.style.top = p.x+'px';
			gamePanel.appendChild(d);
		}
		i--;
	}, 300);
}

//keypress事件监听
document.addEventListener('keydown', function(event){
	if(stop || pause){
		return;
	}
	switch(event.keyCode){
		case 37:
			event.preventDefault();
			moveLeft(myTank);
			break;
		case 38:
			event.preventDefault();
			moveTop(myTank);
			break;
		case 39:
			event.preventDefault();
			moveRight(myTank)
			break;
		case 40:
			event.preventDefault();
			moveBottom(myTank);
			break;
		case 74:
			event.preventDefault();
			superMissile();
		default:
			break;
	}
});

//keyup事件监听
document.addEventListener('keyup', function(event){
	if(stop || pause){
		return;
	}
	if(event.keyCode === 17){
		event.preventDefault();
		createMissile(myTank.x, myTank.y, myTank.dir, true);
	}
});

$('#pause').addEventListener('click', function (){
	if(stop){
		return;
	}
	if(!pause){
		clearInterval(id);
		pause = true;
		$('#pause').innerHTML = 'play';
		$('#pause').title = '继续';
	}else{
		pause = false;
		game();
		$('#pause').innerHTML = 'pause';
		$('#pause').title = '暂停';
	}
});

var clickStop = true;//对点击进行限制，初次加载欢迎页显示完成后会改为false
$('#stop').addEventListener('click', function (){
	if(clickStop){
		return;
	}
	if(!stop){
		clickStop = true;
		gameover();
		exploedAudio('./audio/gameover.wav');
		$('#stop').innerHTML = 'start';
		$('#stop').title = '开始';
	}else{
		init();
		$('#stop').innerHTML = 'stop';
		$('#stop').title = '结束';
	}
});

//绘制函数，将全部的坦克、子弹、墙，全部根据位置绘制出来
function draw(){
	var html = '';
	var p;
	for(var i = 0; i < 30; i++){
		for(var j = 0; j < 30; j++){
			if(gameArr[i][j]){
				p = getPos(j, i);
				html += '<div style="position:absolute;left:'+p.x+'px;top:'+p.y+'px;"></div>';
			}
		}
	}
	html += drawExploed();//把爆炸加到画面中
	gamePanel.innerHTML = html;
}

//根据参数获取位置
function getPos(x, y){
	return {
		x:x*20,
		y:y*20
	};
}

//重置gameArr数组
function initGameArr(){
	for(var i = 0; i < 30; i++){
		gameArr[i] = [];
		for(var j = 0; j < 30; j++){
			gameArr[i][j] = 0;
		}
	}
}

//播放一次声音
function exploedAudio(src){
	var audio = document.createElement('audio');
	audio.src = src;
	audio.autoplay = true;
}

//获取单个DOM元素
function $(str){
	return document.querySelector(str);
}

//获取DOM集合
function $all(str){
	return document.querySelectorAll(str);
}