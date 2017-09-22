<template>
	<div class="level">
		<Number :plevel="level" />
	</div>
</template>

<script>
import Number from './number/number.vue'
export default{
	data(){
		return{
			
		}
	},
	props: ['level'],
	created(){
		console.log(this.level);
	},
	components:{
    	Number
  	},
}
</script>

<style>
</style>