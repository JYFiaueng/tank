// 2017年09月05日12:14:21

let ctrls = {
  killTankCount: 0,
  stop: true,
  pause: false,
  id: -1,
  speed: 40,
  clickStop: true,
  welcomeAnimationTime: 300
};

let tools = {
  $ (str) {
    return document.querySelector(str);
  },
  $all (str) {
    return document.querySelectorAll(str);
  },
  playAudio (src) {
    var audio = document.createElement('audio');
    audio.src = src;
    audio.autoplay = true;
  },
  getPos(x, y){
    return {
      x: x * views.style.blockX,
      y: y * views.style.blockY
    };
  },
  drawRect(ctx, x, y){
    ctx.beginPath();
    ctx.fillStyle = views.style.blockColor;
    ctx.fillRect(x - views.style.border, y - views.style.border, views.style.blockX + views.style.border, views.style.blockY + views.style.border);
    ctx.clearRect(x, y, views.style.blockX - views.style.border, views.style.blockY - views.style.border);
    ctx.fillRect(x + views.style.padding, y + views.style.padding, views.style.blockX - views.style.border - views.style.padding, views.style.blockY - views.style.border - views.style.padding);
    ctx.stroke();
  }
}

function loadAudios(){
  let host = './audio/';
  let names = ['exploed.wav', 'gameover.wav', 'missile.wav', 'wall.wav'];
  let ps = [];
  for (let i = 0; i < names.length; i++) {
    ps.push(new Promise((resolve, reject) => {
      let audio = document.createElement('audio');
      audio.src = `${host}${i}`;
      audio.onload = () => {
        resolve();
      }
    }));
  }
  let p = Promise.all(ps);
  p.then(() => {
    console.log('========================');
    console.log('===audio loading over===');
    console.log('========================');
    // 这里等待音频加载时让页面显示loading
  });
};

function welcome(){
	var pos = [//welcome JYF
    [[18,18],[19,18],[20,18],[21,18],[22,18],[23,18],[24,18],[25,18],[18,19],[18,20],[18,21],[21,19],[21,20],[21,21]],
    [[20,14],[20,15],[21,14.5],[22,14.5],[23,14.5],[24,14.5],[25,14.5],[18,13],[19,13.5],[19,15.5],[18,16]],
    [[18,8],[18,9],[18,10],[18,11],[19,11],[20,11],[21,11],[22,11],[23,11],[24,11],[25,8.5],[24,8],[25,9.5],[25,10.5]],
    [[11,26], [12,26], [13,26], [10,27], [10,28], [14,27], [14,28], [12,27], [12,28], [12,29], [11,29]],
    [[11,20.5], [12,20.5], [13,20.5], [14,20.5], [10,21.5], [11,22.5], [12, 22.5], [13,22.5], [14,22.5], [10,23.5], [11,24.5], [12,24.5], [13,24.5], [14,24.5]],
    [[11,16], [12,16], [13,16], [10,17], [10,18], [14,17], [14,18], [11,19], [12,19], [13,19]],
    [[11,11.5], [12,11.5], [13,11.5], [10,12.5], [10,13.5], [14,12.5], [14,13.5], [11,14.5], [13,14.5]],
    [[6,10], [7,10], [8,10], [9,10], [10,10], [11,10], [12,10], [13,10], [14,10]],
    [[11,5.5], [12,5.5], [13,5.5], [10,6.5], [10,7.5], [14,6.5], [14,7.5], [12,6.5], [12,7.5], [12,8.5], [11,8.5]],
    [[10,0], [11,0], [12,0.5], [13,0.5], [14,1], [13,1.5], [12,2], [13,2.5], [14,3], [13,3.5], [12,3.5], [11,4], [10,4]]
  ];
	var i = pos.length, p = null;
	var t = setInterval(function(){
		if (Object.is(i, 0)) {
			clearInterval(t);
			ctrls.clickStop = false;//欢迎页显示完才能点击开始
			return;
		}
		for (var j = pos[i-1].length-1; j >= 0; j--) {
			p = tools.getPos(pos[i-1][j][0], pos[i-1][j][1]);
			tools.drawRect(view.ctx, p.y, p.x);
		}
		i--;
	}, ctrls.welcomeAnimationTime);
}

function draw(){
	var p = null;
	ctx.fillStyle = views.style.panelColor;
	ctx.clearRect(0, 0, view.gamePanel.width, view.gamePanel.height);
	for(var i = 0; i < views.style.numBlockX; i++){
		for(var j = 0; j < views.style.numBlockY; j++){
			if(models.gameArr[i][j]){
				p = tools.getPos(j, i);
				tools.drawRect(p.x, p.y);
			}
		}
	}
	drawExploed();//把爆炸加到画面中
}

{
  // 事件区
}