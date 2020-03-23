<template>
    <div class="agency-matters">
        <my-header :title="'我的流程'" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
         <div class="agency-matters_action_box" data-test="action_box" v-if="status.tableOrUniversalFlag">
             <text-input titleName="请求标题" v-model="requestTitle"></text-input>
             <process-select></process-select>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import processSelect from '@/componentized/textBox/processSelect.vue'
    export default {
        name: "myProcessNew",
        components:{
            myHeader,
            textInput,
            processSelect
        },
        data(){
            return{
                status:{
                    tableOrUniversalFlag:true,
                },
                requestTitle: "",
            }
        },
        methods:{
            black(data){
                this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
                if(data==='refetch'){
                    this.refetch();
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .agency-matters{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
        .agency-matters_action_box {
            width: 100%;
            padding-left: 0.09375rem;
            padding-right: 0.1198rem;
            .text-input-container {
                float: left;
            }
            .process-select-container {
                float: left;
            }
        }
    }
    .agency-matters .agency-matters_header{
        height: 0.3021rem;
        width: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        padding-left: 0.09375rem;
        border-bottom:1px solid rgba(112,112,112,0.13);
    }
    // .agency-matters .agency-matters_action_box{
    //     height: 0.2917rem;
    //     width: 100%;
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     padding-left: 0.09375rem;
    //     padding-right: 0.1198rem;
    //     color: #2F2F76FF!important;
    //     border-bottom:0.0052rem solid rgba(112,112,112,0.13);
    // }
    // .agency-matters_action_box .action_right_box{

    // }
</style>