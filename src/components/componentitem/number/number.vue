<template>
	<div class="number">
		<span v-for="(item,index) in data" :class="'bg s_'+item"></span>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				data:[],
				length:6,
			}
		},
		watch:{
			$props:{
				handler(val,oldVal){
//					console.log(val)
					this.numCreation(val);
				},
				deep:true,
			}
		},
		props: ['number','propTime','plevel'],
		created(){
			this.numInit();
			this.numCreation();
		},
		methods:{
			numInit(){
//				console.log(this.number)
				for(let m = 0;m < this.length;m++){
					if(this.number == 0 && m == 0){
						this.data.unshift('0');
					}else{
						this.data.unshift('n');
					}
				}
			},
			numCreation(num){
//				console.log(num);
				let numMatrix;
				if(this.propTime){
					numMatrix = (this.propTime+'').split(',');
//					return false;
					this.length = this.propTime.length;
//					console.log('41',numMatrix)
				}else if(this.plevel){
					numMatrix = (this.plevel+'').split('');
				}else{
					numMatrix = (this.number+'').split('');
//					this.data=[];
//					console.log('45',numMatrix);
				}
				
//				if(typeof this.number == 'number'){
//					this.length = 6;
//				}
//				console.log(num,this.number,this.number+'',numMatrix,this.length,typeof this.number);
				for(let n = 0,len = this.length - numMatrix.length;n < len;n++){
        			numMatrix.unshift('n');
				}
				this.data = numMatrix;
				return false;
			}
		}
	}
</script>

<style>
</style>