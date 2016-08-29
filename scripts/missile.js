/*
x,y:0-29
dir:l t r b
good:true false
*/

function Missile(x, y, dir, good){
	this.x = x;
	this.y = y;
	this.dir = dir;
	this.good = good;
}

//创建子弹
function createMissile(x ,y ,dir, good){
	var m = new Missile(x, y, dir, good);
	m.index = missiles.length;
	missiles.push(m);
	exploedAudio('../audio/missile.wav');
}

//产生子弹的数组填充信息
function setGameArrMissile(m){
	return {
		type:'missile',
		good:m.good,
		index:m.index
	}
}

//子弹的碰撞检测
function collidesMissile(m){
	var x = m.x;
	var y = m.y;
	if(m.dir === 'l'){
		if(gameArr[y][x-1]){
			return killTank(gameArr[y][x-1], m, x-1, y);
		}
	}else if(m.dir === 't'){
		if(gameArr[y-1][x]){
			return killTank(gameArr[y-1][x], m, x, y-1);
		}
	}else if(m.dir === 'r'){
		if(gameArr[y][x+1]){
			return killTank(gameArr[y][x+1], m, x+1, y);
		}
	}else if(m.dir === 'b'){
		if(gameArr[y+1][x]){
			return killTank(gameArr[y+1][x], m, x, y+1);
		}
	}
	return true;
}

//子弹碰到东西之后的事情，参数：要碰的地方的内容，要碰的子弹，要碰的地方的位置
function killTank(t, m, x, y){
	if(t.type === 'myTank'){//撞到了我的坦克
		if(m.good){//好弹
			return true;
		}else{//坏弹，打死myTank，游戏结束
			exploedAudio('../audio/gameover.wav');
			gameover();
		}
	}else if(t.type === 'tank'){//撞到了普通坦克
		if(m.good){//好弹
			//打击到了敌人
			killTankCount++;
			delMissile(m.index);//去掉子弹
			delTank(t.index);//去掉敌人
			createExploed(x, y);//在碰撞的位置产生一个爆炸
			exploedAudio('../audio/exploed.wav');//产生一个爆炸声音
			return false;
		}else{//坏弹
			return true;
		}
	}else if(t.type === 'missile'){//子弹碰子弹
		if(t.good === m.good){//一样的弹什么都不做
			return true;
		}else{//好弹碰坏弹就把两个弹都删掉
			delMissile(t.index);
			delMissile(m.index);
			return false;
		}
	}else if(t.type === 'wall'){//子弹碰到墙
		delWall(t.index);//去掉墙
		delMissile(m.index);//去掉子弹
		exploedAudio('../audio/wall.wav');
		return false;
	}
}

//画子弹
function drawMissile(){
	for(var i = 0; i < missiles.length; i++){
		var x = missiles[i].x;
		var y = missiles[i].y;
		if(missiles[i].dir === 'l'){
			if(x > 0 && collidesMissile(missiles[i]) ){
				missiles[i].x -= 1;
				gameArr[y][x-1] = setGameArrMissile(missiles[i]);
			}else{
				delMissile(i);
			}
		}else if(missiles[i].dir === 't'){
			if(y > 0 && collidesMissile(missiles[i]) ){
				missiles[i].y -= 1;
				gameArr[y-1][x] = setGameArrMissile(missiles[i]);
			}else{
				delMissile(i);
			}
		}else if(missiles[i].dir === 'r'){
			if(x < 29 && collidesMissile(missiles[i]) ){
				missiles[i].x += 1;
				gameArr[y][x+1] = setGameArrMissile(missiles[i]);
			}else{
				delMissile(i);
			}
		}else if(missiles[i].dir === 'b'){
			if(y < 29 && collidesMissile(missiles[i]) ){
				missiles[i].y += 1;
				gameArr[y+1][x] = setGameArrMissile(missiles[i]);
			}else{
				delMissile(i);
			}
		}
	}
}

//将指定位置的子弹删除并整理数组和剩余子弹的索引值
function delMissile(i){
	missiles.splice(i, 1);
	if(!missiles.length){
		return;
	}
	for(var j = i; j < missiles.length; j++){
		missiles[j].index--;
	}
}

//四个方向发射子弹
function superMissile(){
	createMissile(myTank.x, myTank.y, 'l', true);
	createMissile(myTank.x, myTank.y, 't', true);
	createMissile(myTank.x, myTank.y, 'r', true);
	createMissile(myTank.x, myTank.y, 'b', true);
}