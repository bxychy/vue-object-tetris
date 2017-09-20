<template>
	<div class="pnum">
		<Number :number="pNum" />
	</div>
</template>

<script>
//import { mapState } from 'vuex'
import Number from './number/number.vue'
export default{
	data(){
		return{
			
		}
	},
	props: ['pNum'],
	components:{
    	Number
  	},
	computed:{
//		...mapState([
//			'cur',
//			'startLines',
//    		'clearLines',
//		])
	}
}
</script>

<style>
</style>