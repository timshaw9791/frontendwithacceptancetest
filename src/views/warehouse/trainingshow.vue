<template>
	<div class="training-container">
		<div class="training-header">
			<span style="font-size: 20px;">查看</span>
			<base-button label="<-返回" align="right" type="none" @click="$router.go(-1)"></base-button>
		</div>
		<div class="training-body" >
			<instructional :ins="insData" title=""></instructional>
		</div>
	</div>
</template>

<script>
    import instructional from 'components/teaching/instructional'
    var _ = require("lodash");
    export default {
        name: "trainingShow",
        data() {
            return {
                insData: {
                    keyname: '',
                    name: '',
                    typeName: '',
                },
            };
        },
        created() {
            this.insData={
                key:this.$route.query.info.item,
                name:this.$route.query.info.item,
                typeName:this.$route.query.info.data
            }
        },
        components: {instructional},
    };
</script>

<style lang="scss" scoped>
	.training-container {
		font-size: 16px;
	}
	.training-body {
		padding: 0 7px;
		widows: 100%;
	}
    .training-header{
		margin-bottom: 50px;
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 57px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        color: rgba(112,112,112,1);
        border-bottom: 1px solid rgba(112,112,112, 0.13);
    }
</style>
