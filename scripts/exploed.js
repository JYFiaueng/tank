/*
x, y:0-19
*/

function Exploed(x, y){
	this.x = x;
	this.y = y;
}

//创建爆炸
function createExploed(x, y){
	var e = new Exploed(x, y);
	e.step = 5;//用于控制爆炸进行到哪一步
	exploeds.push(e);
}

//画爆炸
function drawExploed(){
	var html = '';
	for(var i = 0; i < exploeds.length; i++){
		var x = exploeds[i].x;
		var y = exploeds[i].y;
		var s = exploeds[i].step;
		var p;
		if(s === 2 || s === 3 || s === 4){//创建一个9格的大爆炸
			for(var j = x-1; j <= x+1; j++){
				for(var k = y-1; k <= y+1; k++){
					p = getPos(j, k);
					drawRect(p.x, p.y);
				}
			}
			exploeds[i].step--;
		}else if(s === 1 || s === 5){//创建一个1格的小爆炸
			p = getPos(x, y);
			drawRect(p.x, p.y);
			exploeds[i].step--;
		}else if(s === 0){//把爆炸从画面中删掉
			exploeds.splice(i, 1);
		}
	}
	return html;
}