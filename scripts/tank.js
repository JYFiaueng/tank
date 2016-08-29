/*
dir:l t r b
x:1-28
y:1-28
good:true false
*/

function Tank(dir, x, y, good){
	this.dir = dir;
	this.x = x;
	this.y = y;
	this.good = good;
	if(good){//根据敌我设置移动速度
		this.speed = speed || 10;
	}else{
		this.speed = speed || 20;
	}
	this.live = true;
}

//游戏初始创建四个AI
function createInitAI(){
	for(var i = 0; i < AIPos.length; i++){
		var ai = new Tank(createDir(), AIPos[i][0], AIPos[i][1], false);
		ai.step = createStep();
		ai.index = i;
		tanks.push(ai);
	}
}

//创建一个AI
function createOneAI(){
	if(tanks.length < AINumber){
		//在随机位置产生一个AI
		var r1;
		var r2;
		while(true){
			r1 = parseInt(Math.random()*27+1);
			r2 = parseInt(Math.random()*27+1);
			if(!gameArr[r2][r1]){
				var ai = new Tank(createDir(), r1, r2, false);
				ai.step = createStep();
				ai.index = tanks.length;
				tanks.push(ai);
				break;
			}
		}
	}
}

//随机化AI的移动
function moveAI(){
	for(var i = 0; i < tanks.length; i++){
		if(tanks[i].step){
			tanks[i].step--;
			if(tanks[i].dir === 'l'){
				moveLeft(tanks[i]);
			}else if(tanks[i].dir === 't'){
				moveTop(tanks[i]);
			}else if(tanks[i].dir === 'r'){
				moveRight(tanks[i]);
			}else if(tanks[i].dir === 'b'){
				moveBottom(tanks[i]);
			}
		}else{
			tanks[i].step = createStep();
			tanks[i].dir = createDir();
		}
		//随机化产生子弹
		if( parseInt(Math.random()*10) > level ){
			createMissile(tanks[i].x, tanks[i].y, tanks[i].dir, false);
		}
	}
}

//画AI
function drawAI(){
	var l = tanks.length;
	for(var i = 0; i < l; i++){
		drawTank(tanks[i]);
	}
}

//画坦克
function drawTank(tank){
	if(tank.dir === 'l'){
		lTank(tank.x, tank.y, tank);
	}
	if(tank.dir === 't'){
		tTank(tank.x, tank.y, tank);
	}
	if(tank.dir === 'r'){
		rTank(tank.x, tank.y, tank);
	}
	if(tank.dir === 'b'){
		bTank(tank.x, tank.y, tank);
	}
}

//将指定位置的坦克删除并整理数组和剩余坦克的索引
function delTank(i){
	tanks.splice(i, 1);
	if(!tanks.length){
		return;
	}
	for(var j = i; j < tanks.length; j++){
		tanks[j].index--;
	}
}

//设置数组中坦克的信息
function setGameArrTank(tank){
	var t = {};
	if(tank.good){
		t.type = 'myTank';
	}else{
		t.type = 'tank';
		t.index = tank.index;
	}
	return t;
}

//设置此方向的坦克div
function lTank(x, y, tank){
	var t = setGameArrTank(tank);
	gameArr[y][x] = t;
	gameArr[y-1][x+1] = t;
	gameArr[y-1][x] = t;
	gameArr[y][x-1] = t;
	gameArr[y+1][x+1] = t;
	gameArr[y+1][x] = t;
}
//返回此方向的坦克div
function tTank(x, y, tank){
	var t = setGameArrTank(tank);
	gameArr[y][x] = t;
	gameArr[y-1][x] = t;
	gameArr[y][x-1] = t;
	gameArr[y][x+1] = t;
	gameArr[y+1][x-1] = t;
	gameArr[y+1][x+1] = t;
}
//返回此方向的坦克div
function rTank(x, y, tank){
	var t = setGameArrTank(tank);
	gameArr[y][x] = t;
	gameArr[y-1][x-1] = t;
	gameArr[y-1][x] = t;
	gameArr[y][x+1] = t;
	gameArr[y+1][x-1] = t;
	gameArr[y+1][x] = t;
}
//返回此方向的坦克div
function bTank(x, y, tank){
	var t = setGameArrTank(tank);
	gameArr[y][x] = t;
	gameArr[y-1][x-1] = t;
	gameArr[y-1][x+1] = t;
	gameArr[y][x-1] = t;
	gameArr[y][x+1] = t;
	gameArr[y+1][x] = t;
}

// 坦克碰撞检测
function collidesTank(tank){
	var x = tank.x;
	var y = tank.y;
	if(tank.dir === 'l'){
		if(gameArr[y][x-2]===0 && gameArr[y-1][x-1]===0 && gameArr[y+1][x-1]===0){
			return true;
		}
	}else if(tank.dir === 't'){
		if(gameArr[y-2][x]===0 && gameArr[y-1][x-1]===0 && gameArr[y-1][x+1]===0){
			return true;
		}
	}else if(tank.dir === 'r'){
		if(gameArr[y][x+2]===0 && gameArr[y-1][x+1]===0 && gameArr[y+1][x+1]===0){
			return true;
		}
	}else if(tank.dir === 'b'){
		if(gameArr[y+2][x]===0 && gameArr[y+1][x-1]===0 && gameArr[y+1][x+1]===0){
			return true;
		}
	}
	return false;
}

//坦克的移动，传入一个坦克对象
function moveLeft(tank){
	if(tank.dir === 'l'){//坦克的方向和当前事件的方向一致，就向前走一步
		if(tank.x > 1 && collidesTank(tank)){
			tank.x -= 1;
		}
	}else{//不一致就改变方向为当前方向
		tank.dir = 'l';
	}
}

//坦克的移动，传入一个坦克对象
function moveTop(tank){
	if(tank.dir === 't'){//坦克的方向和当前事件的方向一致，就向前走一步
		if(tank.y > 1 && collidesTank(tank)){
			tank.y -= 1;
		}
	}else{//不一致就改变方向为当前方向
		tank.dir = 't';
	}
}

//坦克的移动，传入一个坦克对象
function moveRight(tank){
	if(tank.dir === 'r'){//坦克的方向和当前事件的方向一致，就向前走一步
		if(tank.x < 28 && collidesTank(tank)){
			tank.x += 1;
		}
	}else{//不一致就改变方向为当前方向
		tank.dir = 'r';
	}
}

//坦克的移动，传入一个坦克对象
function moveBottom(tank){
	if(tank.dir === 'b'){//坦克的方向和当前事件的方向一致，就向前走一步
		if(tank.y < 28 && collidesTank(tank)){
			tank.y += 1;
		}
	}else{//不一致就改变方向为当前方向
		tank.dir = 'b';
	}
}

//产生1-10之间随机的步数
function createStep(){
	return parseInt(Math.random()*10);
}

//产生随机方向
function createDir(){
	var i = parseInt(Math.random()*4);
	if(i === 4) i = 3;
	if(i === 0) return 'l';
	if(i === 1) return 't';
	if(i === 2) return 'r';
	if(i === 3) return 'b';
}