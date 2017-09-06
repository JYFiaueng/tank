// 2017年09月05日12:14:15

let models = {
  gameArr: [],
  tanks: [],
  walls: [],
  missiles: [],
  exploeds: []
};

function initGameArr(){
	for(var i = 0; i < 30; i++){
		models.gameArr[i] = [];
		for(var j = 0; j < 30; j++){
			models.gameArr[i][j] = 0;
		}
	}
}