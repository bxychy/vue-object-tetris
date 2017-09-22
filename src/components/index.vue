<template>
	<div class="app" :style="size">
		<div class="rect" :class="drop?'drop':''">
			<Decorate />
			<div class="screen">
				<div class="panel">
					<Matrix :propMatrix="matrix" :cur="cur" :reset="reset" />
					<Logo :reset="reset" :cur="!!cur" />
					<div class="state">
						<Point :cur="!!cur" :maxPoint="maxPoints" :points="points" />
						<p>{{getNum}}</p>
						<Pnum :pNum="cur ? clearLines : startLines" />
						<p>{{level}}</p>
						<Level :level="cur ? speedRun : speedStart" />
						<p>{{nextType}}</p>
						<NextType :nextType="next" />
						<div class="bottom">
							<PropTime />
						</div>
					</div>
				</div>
			</div>
		</div>
		<Keyboard :fill="fill" />
	</div>
</template>

<script>
import { mapState } from 'vuex'
//import { isClear } from '../unit/index.js'
import { transform , lastRecord , i18n , lan , speeds } from '../unit/const.js'

import states from '../vuex/states.js'
import Decorate from './componentitem/decorate.vue'
import Matrix from './componentitem/matrix.vue'
import Logo from './componentitem/logo.vue'
import Keyboard from './componentitem/keyboard.vue'
import Point from './componentitem/point.vue'
import PropTime from './componentitem/propTime.vue'
import Pnum from './componentitem/pNum.vue'
import NextType from './componentitem/nextType.vue'
import Level from './componentitem/level.vue'

export default{
	name:'index',
	data(){
		return{
			size:{},
			indexWidth:document.documentElement.clientWidth,
			indexHeight:document.documentElement.clientHeight,
			fill:'',
			pNum:'',
			level:'',
			nextType:'',
		}
	},
	created(){
		this.setSize();
		this.getNumInit();
		this.getTextType();
		console.log(this.next);
	},
	mounted(){
		window.addEventListener('resize',this.setResize.bind(this),true)
//		console.log('matrixInitState',this.matrix);
	},
//	watch:{
//		pNum:function (newQuestion){
//			this.getNum();
//		}
//	},
	methods:{
		getNumInit(){
			this.pNum = this.cur ? i18n.clears[lan] : i18n.startLine[lan];
		},
		getTextType(){
			this.nextType = i18n.next[lan];
			this.level = i18n.level[lan];
		},
		setSize(){
			let fill=0;
			const size=(()=>{
				const w=this.indexWidth,
					h=this.indexHeight;
				const ratio=h/w;
				let scale,css={};
				if(ratio<1.5){
					scale=h/960;
				}else{
					scale=w/640;
					fill=(h-960*scale)/scale/3;
					css={
						'padding-top': Math.floor(fill) + 42 + 'px',
            			'padding-bottom': Math.floor(fill) + 'px',
            			'margin-top': Math.floor(-480 - fill * 1.5) + 'px'
					}
				} 
				css[transform]=`scale(${scale})`;
				return css;
			})()
			this.size=size;
			this.fill=fill;
//			console.log(this.fill);
		},
		setResize(){
//			console.log('67');
			this.indexWidth = document.documentElement.clientWidth;
      		this.indexHeight = document.documentElement.clientHeight;
      		this.setSize();
      		this.setStart();
//    		this.getPropsChange();
		},
		getPropsChange(){
//			console.log('nextProps');
//			const clears=isClear();
//			this.setOverState();
		},
//		setOverState(nextProps){
//			console.log('nextProps-58',nextProps);
//			let overState=this.getMatrixData(nextProps);
//			this.overState=overState;
//			const exLine=((index)=>{
//				overState = overState.set(19 - index, List(fillLine))
//			})
//			this.overState = overState
//		}
		setStart(){
//			console.log(lastRecord.cur,!lastRecord.cur);
			console.log('lastRecord',lastRecord,lastRecord.pause)
			if(lastRecord){
				console.log('lastRecord',lastRecord.cur,lastRecord.pause)
//				拿到上一次游戏的状态, 如果在游戏中且没有暂停, 游戏继续
				if(lastRecord.cur && !lastRecord.pause){
					const speedRun = this.$store.state.speedRun;
//					继续时, 给予当前下落速度一半的停留时间
					let timeout = speeds[speedRun - 1] / 2;
//					停留时间不小于最快速的速度
					timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
					states.auto(timeout);
				}
				if(!lastRecord.cur){
          			states.overStart()
        		}
			}else{
				states.overStart();
			}
		}
	},
	components:{
		Decorate,
		Matrix,
		Logo,
		Keyboard,
		Point,
		PropTime,
		Pnum,
		NextType,
		Level,
	},
	computed:{
		getNum(){
			return this.pNum = this.cur ? i18n.clears[lan] : i18n.startLine[lan];
		},
		...mapState([
			'matrix',
			'cur',
			'next',
			'reset',
			'keyboard',
			'drop',
			'pause',
			'music',
			'points',
			'maxPoints',
			'startLines',
      		'clearLines',
      		'speedRun',
      		'speedStart',
		])
	},
}
</script>

<style>
</style>
