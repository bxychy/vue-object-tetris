<template>
	<div class="pTime">
		<Number :propTime="data" />
	</div>
</template>

<script>
import Number from './number/number.vue'
export default{
	data(){
		return{
			data:'',
			time_count:'',
		}
	},
	beforeMount(){
    	setInterval(this.onTime,1000);
  	},
	components:{
    	Number
  	},
//	props: ['propTime'],
//	watch:{
//		$props:{
//			handler(val,oldVal){
//				console.log(val);
//				this.onTime(val);
//			},
//			deep: true,
//		}
//	},
	methods:{
		onTime(){
			const now = new Date();
        	const hour = this.formate(now.getHours());
        	const min = this.formate(now.getMinutes());
        	const sec = now.getSeconds() % 2;
        	const zt = hour.concat(sec ? 'd' : 'd_c', min);
        	this.data = zt;
//      	console.log(this.data);
		},
		formate(numTime){
			return  numTime < 10 ? `0${numTime}`.split('') : `${numTime}`.split('');
		}
	}
}
</script>

<style>
</style>