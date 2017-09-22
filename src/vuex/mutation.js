//数据更新/数据状态判断-公用方法
import unit from '../unit/index.js'
import Block from '../unit/block.js'

const mutations={
//	下一个方块
	nextBlock(state, data){
    	if (!data) {
      		data = unit.getNextType();
    	}
    	state.next = data;
  	},
//	基础矩阵
  	matrix(state, data){
    	state.matrix = data;
//  	console.log('state.matrix',state.matrix);
  	},
	moveBlock(state, data){
    	state.cur = data.reset === true ? null : new Block(data);
//  	console.log('state.cur',state.cur);
  	},
	reset(state, data){
//		console.log(data);
    	state.reset = data;
  	},
//	开始动画/结束动画
  	lock(state, data){
    	state.lock = data;
  	},
//	下落/触底
  	drop(state, data){
    	state.drop = data;
  	},
//	暂停
  	pause(state, data){
    	state.pause = data;
  	},
//	消除行数
	clearLines(state, data){
    	state.clearLines = data;
	},
//	音效
	music(state, data){
    	state.music = data;
  	},
//	方块下落速度
	speedRun(state, data){
    	state.speedRun = data;
	},
//	方块级别
	speedStart(state, data) {
    	state.speedStart = data;
  	},
//	计分
	points(state, data){
    	state.points = data;
  	},
//	最高分
  	maxPoints(state, data){
  		console.log()
    	state.maxPoints = data;
  	},
  	startLines(state, data){
    	state.startLines = data;
  	},
//	key_drop(state, data) {
//  	state.keyboard['drop'] = data;
//	},
}

export default mutations