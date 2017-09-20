<template>
	<div class="matrix">
		<p v-for="(mtem,index) in matrix._tail.array">
			<b v-for="(btem,index) in mtem._tail.array" class="b" :class="{c:btem===1,d:btem===2}"></b>
		</p>
	</div>
</template>

<script>
import { List, fromJS, toJS } from 'immutable'
import { fillLine, blankLine } from '../../unit/const.js'
import unit from '../../unit/index.js'
import states from '../../vuex/states.js'
//const t = setTimeout;
export default{
	data(){
		return{
			clearLines: false,
      		animateColor: 2,
      		isOver: false,
      		overState: null,
      		matrix:'',
		}
	},
	props:['propMatrix','reset','cur'],
	watch:{
		$props:{
			handler(val,oldVal){
				this.getPropsChange(val);
			},
			deep:true
		}
	},
	created(){
		console.log('36-getMatrix',this.isOver);
		this.getMatrix();
	},
	methods:{
		getMatrix(){
			if(this.isOver){
				this.matrix=this.overState;
			}else{
//				console.log('matrix-44');
				this.matrix=this.getMatrixData();
			}
//			console.log('matrix',this.matrix);
		},
		getMatrixData(props){
//			console.log('props',props);
			if(!props){
				props=this.$props;
			}
//			当前方块本身对象
			const cur = props.cur;
//			上下2侧方块颜色数组0-灰色 1-黑色
			const shape = cur && cur.shape;
//			当前方块的坐标轴 0-X轴 1-Y轴
			const xy = fromJS(cur && cur.xy);
//			基础方块矩阵
			let matrix=fromJS(props.propMatrix);
			
			const clearLines = this.clearLines;

//			判断是否有需要消除的方块
			if(clearLines){
//			console.log('matrix-66',clearLines);
//				消除排满的那一行方块并重现循环基础矩阵对象
				const animateColor = this.animateColor;
//				console.log('matrix-66',clearLines,animateColor);
//				消除之前动画
				clearLines.forEach(cLine => {
					matrix = matrix.set(cLine, List([
	            			animateColor,
	            			animateColor,
				            animateColor,
				            animateColor,
				            animateColor,
				            animateColor,
				            animateColor,
				            animateColor,
				            animateColor,
				            animateColor
	            		])
          			)
				})
			}else if(shape){
//				在基础矩阵对象上循环建立初始化方块对象
				shape.forEach((sp,index1) => sp.forEach((p,index2) => {
						// 初始化竖坐标,可以为负
						if(p && xy.get(0) + index1 >= 0){
							let line = matrix.get(xy.get(0) + index1);
//							console.log(line.toJS(),xy.get(0),index1,matrix.get(xy.get(0) + index1));
							let color;
							// 矩阵与方块重合
							if(line.get(xy.get(1) + index2) === 1 && !clearLines){
								color = 2
							}else{
								color = 1
							}
							line = line.set(xy.get(1) + index2, color)
              				matrix = matrix.set(xy.get(0) + index1, line)
//            				console.log(line.toJS(),matrix.toJS());
						}
					})
				)
			}
			
			var matrixjson = {}
		    for(var i=0;i<props.propMatrix.length;i++){
		    	for(var j=0;j<props.propMatrix[i].length;j++){
//		    		console.log(matrixjson[i],props.propMatrix[i][j]);
		    		matrixjson[i] = props.propMatrix[i];
		    	}
		    }
//		    console.log(matrix.toJS());
			return matrix;
//			console.log('matrix',matrix);
		},
		getPropsChange(props){
//			console.log(states.clearLines);
//			this.isOver = props.reset;
//			console.log('nextProps',nextProps);
//			判断是否有那一行达到消除条件?返回那一行:返回false
			const clears = unit.isClears(props.propMatrix);
//			console.log('104',clears);
			const overs=props.reset;
//			this.setOverState(nextProps);
			
			
			setTimeout(() => {
				this.clearLines = clears;
				this.isOver = props.reset;
//				console.log('matrix-129',this.clearLines);
			},0);
//			console.log('135-getMatrix',this.isOver);
			this.getMatrix();
//			console.log(clears,overs,this.isOver,this.clearLines);
			if(clears && !this.clearLines){
//				console.log('matrix-134',this.clearLines);
				this.clearAnimate(clears);
//				return false;
			}
			if(!clears && overs && !this.isOver){
				this.setOverState(props);
			}

			
		},
		setOverState(props){
//			console.log('matrix-150');
			let overState=this.getMatrixData(props);
			this.overState=overState;
//			console.log('nextProps-58',props);
			if(props.reset==false){
				return false;
			}
			const exLine= ((index) => {
				if(index <= 19){
					overState = overState.set(19-index,List(fillLine));
//					console.log(overState.toJS());
				}else if(index >= 20 && index <= 39){
					overState = overState.set(index - 20,List(blankLine));
				}else{
					states.overEnd();
					return;
				}
				this.overState = overState;
//				console.log('167-getMatrix',this.isOver);
				this.getMatrix();
//				console.log(index,this.overState.toJS());
			})
			
			for(let i = 0;i <= 40;i++) {
        		setTimeout(exLine.bind(null, i), 40 * (i + 1))
      		}
		},
//		方块消除动画方法
		clearAnimate(clears){
			console.log('matrix-178');
//			传入当前矩阵数组对象.传入当前可消除行的数组下标
//			states.clearLines(this.propMatrix, clears);
			setTimeout(() => {
				this.animateColor = 0;
				this.getMatrix();
				console.log('st1');
				setTimeout(() => {
					this.animateColor = 2;
					this.getMatrix();
					console.log('st2');
					setTimeout(() => {
						this.animateColor = 0;
						this.getMatrix();
						setTimeout(() => {
							console.log('st3');
							states.clearLines(this.propMatrix, clears);
//							this.getMatrix();
							this.clearLines=false;
						},150)
					},150);
				},150);
			},150);
		}
	}
}
</script>

<style>
.matrix{border: 2px solid #000;padding: 3px 1px 1px 3px;width: 228px;}
.matrix p{width: 220px;height: 22px;}
</style>