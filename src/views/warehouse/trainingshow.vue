<template>
  <div class="training-form-container">
    <my-header title="查看" :haveBlack="false"></my-header>
    <div class="training-form-top">
        <base-button size="default" align="right" label="返回" @click="$router.go(-1)"></base-button>
    </div>
    <div class="training-form-body" >
        <instructional :ins="insData" title=""></instructional>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
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
        methods: {
            
            
        },
        created() {
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回教学培训");
                this.$router.push({name: 'warehouse/training'});
                return
            }
            this.insData={
                key:this.$route.params.info.item,
                name:this.$route.params.info.item,
                typeName:this.$route.params.info.data
            }
        },
        components: {
            instructional,
            myHeader
        },
    };
</script>

<style lang="scss" scoped>
  .training-form-container {
    font-size: 16px;
  }
  .training-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .training-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
