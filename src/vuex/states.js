//状态公用方法
import store from './store.js'
import { blankLine,blankMatrix,speeds,eachLines } from '../unit/const.js'
import unit from '../unit/index.js'
import { List, fromJS, toJS } from 'immutable'
import { music } from '../unit/music.js'

// 生成startLines
const getStartMatrix = (startLines) => {
	// 返回高亮个数在min~max之间一行方块, (包含边界)
	const getLines = (min,max) => {
//		console.log(min,max);
		const count = parseInt((max - min + 1) * Math.random() + min, 10);
		const lines = [];
//		插入高亮-1为高亮
		for(let i = 0; i < count;i++){
			lines.push(1);
		}
//		在随机位置插入灰色-0为灰色(不高亮)
		for(let j = 0,len = 10 - count; j < len;j++){
			const index = parseInt((lines.length + 1) * Math.random(),10)
			lines.splice(index,0,0);
		}
//		console.log(lines);
		return List(lines)
	}
//	选择级别时随机插入方块
	let startMatrix = List([]);
	for(let k = 0;k < startLines; k++){
//		每一行方块3-9之间随机;
		startMatrix = startMatrix.push(getLines(3,9));
	}
//	console.log('states-startMatrix.30',startMatrix.toJS(),getLines(5, 8))
	// 插入上部分的灰色
	for (let i = 0, len = 20 - startLines; i < len; i++) {
    	startMatrix = startMatrix.unshift(List(blankLine))
  	}
//	console.log('states-startMatrix.35',startMatrix.toJS())
	return startMatrix.toJS();
}

const states={
//	自动下落setTimeout变量
  	fallInterval: null,
//	游戏开始
	start(){
//		游戏开始音效判断
		if(music.start){
      		music.start();
    	}
		const state = store.state;
		const startLines = state.startLines;
//		console.log('states.-53',startLines);
		const startMatrix = getStartMatrix(startLines);
		console.log(state.speedStart);
		store.commit('speedRun', state.speedStart)
//		分数初始化
		states.calculationPoints(0);
//		传入基本方块对象
		store.commit('matrix', startMatrix)
//  	传入当前当前方块的类型,并返回当前类型的对象
    	store.commit('moveBlock', { type: state.next })
//  	下一块方块
    	store.commit('nextBlock', '')
//		console.log('states.-48',Array.isArray(startMatrix));
		states.auto();
		
	},
//	开始下落/自动下落
	auto(timeout){
		const tout = timeout < 0 ? 0 : timeout;
		let state = store.state;
		let cur = state.cur;
//		console.log(state,cur);
//		方块移动方法fall
		const fall = () => {
			state = store.state
      		cur = state.cur
//			console.log(state,cur);
			const next = cur.fallDown();
//			方块向下移动
//			console.log(unit.want(next,state.matrix))
			if(unit.want(next,state.matrix)){
				store.commit('moveBlock', next);
				states.fallInterval = setTimeout(fall, speeds[state.speedRun - 1])
			}else{
//				前一个方块触底/叠加至其他方块上

//				重新建立基础方块对象，矩阵对象
				const shape = cur && cur.shape;
				const xy = fromJS(cur && cur.xy);
				let matrix = fromJS(state.matrix);
//				在基础矩阵对象上循环建立方块对象
				shape.forEach((sp,index1) => sp.forEach((p,index2) => {
//						console.log(xy.get(0) + index1)
						if (p && xy.get(0) + index1 >= 0) {
//               			竖坐标可以为负
              				let line = matrix.get(xy.get(0) + index1)
              				line = line.set(xy.get(1) + index2, 1)
              				matrix = matrix.set(xy.get(0) + index1, line)
            			}
					})
				)
				states.nextAround(matrix);
			}
		}
		clearTimeout(states.fallInterval)
		states.fallInterval = setTimeout(fall,tout === undefined ? speeds[state.speedRun - 1] : tout);	
	},
//	当前方块结束,下一个方块开始/按down时传入方法判断当前方块是否结束
	nextAround(matrix,stopDownTrigger){
//		console.log('states-91');
		clearTimeout(states.fallInterval);
		store.commit('lock', true);
    	store.commit('matrix', matrix);
    	
    	if(typeof stopDownTrigger === 'function'){
    		stopDownTrigger();
    	}
    	
    	if(unit.isOver(matrix)){
    		states.overStart();
    		return;
    	}
    	setTimeout(() => {
      		store.commit('lock', false)
      		store.commit('moveBlock', { type: store.state.next });
      		store.commit('nextBlock', '');
      		states.auto();
    	}, 100)
	},
//	游戏暂停
	pause(isPause){
		store.commit('pause', isPause);
		if(isPause){
			clearTimeout(states.fallInterval);
			return false;
		}
		states.auto();
	},
//	方块消除行
	clearLines(matrix,lines){
		const state = store.state;
    	let newMatrix = fromJS(matrix);
//  	console.log('states-142',lines.length);
//  	循环传入可消除行的数组对象
	    lines.forEach(n => {
//	    	console.log('state-151');
//	    	根据传入可消除行的数组子元素作为下标删除传入的矩阵数组对象中对应的那一个子元素
	      	newMatrix = newMatrix.splice(n,1);
//	      	删除后重新添加空行
	      	newMatrix = newMatrix.unshift(List(blankLine));
	    });
//	    console.log('state-157');
//		把处理后的数组对象重新传入数据控制库/方块重新开始下落运行
    	store.commit('matrix', newMatrix.toJS());
//  	store.commit('moveBlock', { type: state.next });
//  	store.commit('nextBlock', '');
    	states.auto();
    	store.commit('lock', false);
    	const clearLines = state.clearLines + lines.length;
    	store.commit('clearLines', clearLines);
    	console.log(clearLines,state.clearLines)
//		一次消除的行越多, 加分越多
		const addPoints = store.state.points + (lines.length * 10) 
		states.calculationPoints(addPoints);
//		消除行数, 增加对应速度
		const speedAdd = Math.floor(clearLines / eachLines) 
	    let speedNow = state.speedStart + speedAdd
	    speedNow = speedNow > 6 ? 6 : speedNow
	    store.commit('speedRun', speedNow)
	},
//	分数传入
	calculationPoints(points){
//		console.log('points',points);
		store.commit('points',points);
//		console.log(points,store.state.maxPoints);
		if(points > 0 && points > store.state.maxPoints){
			console.log(points,store.state.maxPoints);
      		store.commit('maxPoints', points)
    	}
	},
//	游戏结束/游戏开始前,触发动画
	overStart(){
//		console.log("states-133");
		clearTimeout(states.fallInterval);
		store.commit('lock', true)
    	store.commit('reset', true);
    	store.commit('pause', false)
	},
//	游戏结束动画完成
	overEnd(){
//		console.log("states-140");
		store.commit('matrix', blankMatrix);
		store.commit('moveBlock', { reset: true });
		store.commit('reset', false);
		store.commit('lock', false);
		store.commit('clearLines', 0);
	},
	
}

export default states
