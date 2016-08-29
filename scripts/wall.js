/*
x, y:0-29
*/

function Wall(x, y){
	this.x = x;
	this.y = y;
}

//创建墙
function createWall(x, y){
	var w = new Wall(x, y);
	w.index = walls.length;
	walls.push(w);
}

//在画面中产生一堆墙
function createInitWall(){
	var r1,r2;
	for(var i = 0; i < wallNumber; i++){
		r1 = parseInt(Math.random()*29);
		r2 = parseInt(Math.random()*29);
		if(!gameArr[r2][r1]){
			createWall(r1, r2);
			gameArr[r2][r1] = {
				type:'wall',
				index:i
			};
		}else{
			i--;
		}
	}
}

//画墙
function drawWall(){
	var html = '', p;
	for(var i = 0, j = walls.length; i < j; i++){
		var x = walls[i].x;
		var y = walls[i].y;
		gameArr[y][x] = {
			type:'wall',
			index:walls[i].index
		};
		p = getPos(y, x);
		html += '<div style="position:absolute;left:'+p.x+'px;top:'+p.y+'px;"></div>';
	}
}

//将指定位置的墙删除并整理数组和剩余坦克的索引
function delWall(i){
	walls.splice(i, 1);
	if(!walls.length){
		return;
	}
	for(var j = i, k = walls.length; j < k; j++){
		walls[j].index--;
	}
}