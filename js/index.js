// 2017年09月05日12:15:45

let view = {
	gamePanel: $('#gamePanel'),
	infoPanel: $('#info'),
	pauseBtn: $('#pause'),
	stopBtn: $('#stop'),
	AINumber: $('#AINumber'),
	level: $('#level'),
	createAISpeed: $('#createAISpeed'),
  wallNumber: $('#wallNumber'),
  ctx: null,
  style: {
    panelColor: '#828069',
    blockColor: '#000',
    border: 2,
    padding: 4,
    blockX: 20,
    blockY: 20,
    numBlockX: 30,
    numBlockY: 30
  }
};

function initView(){
  view.gamePanel.width = 600;
  view.gamePanel.height = 600;
  view.ctx = view.gamePanel.getContext("2d");
}

function updateInfoPanel(){
	let html = `
		killTankCount: ${killTankCount}<br/>
		tanks: ${tanks.length}<br/>
		missiles: ${missiles.length}<br/>
		exploeds: ${exploeds.length}<br/>
		walls: ${walls.length}<br/>
	`;
	info.innerHTML = html;
}