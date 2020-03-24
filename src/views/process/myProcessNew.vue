<template>
    <div class="agency-matters">
        <my-header :title="title" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
        <div class="agency-matters-body" data-test="action_box" v-if="indexPage">
            <text-input titleName="请求标题" v-model="requestTitle"></text-input>
            <process-select v-model="select.selected" :selectList="select.processList"></process-select>
            <base-button name="查询"></base-button>
            <base-button name="申请报废" style="float:right" @click.native="apply"></base-button>
        </div>
        <apply-process v-if="!indexPage"></apply-process>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import processSelect from '@/componentized/textBox/processSelect.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import applyProcess from "@/components/process/applyProcess"
    export default {
        name: "myProcessNew",
        components:{
            myHeader,
            textInput,
            processSelect,
            baseButton,
            applyProcess
        },
        data(){
            return{
                status:{
                    tableOrUniversalFlag:true,
                },
                title: "我的流程",
                requestTitle: "",
                indexPage: true,
                select: {
                    processList: [{ // 选择列表
                        label: "报废流程",
                        value: "scrap"
                    },{
                        label: "直调流程",
                        value: "dirrect_allot"
                    },{
                        label: "调拨流程",
                        value: "transfer"
                    }],
                    selected: "", // 选择结果
                }
            }
        },
        methods:{
            black(data){
                this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
                if(data==='refetch'){
                    this.refetch();
                }
            },
            apply() { // 申请流程
               this.indexPage = false;
               this.title = "我的流程/申请流程"
            }
        }
    }
</script>

<style lang="scss" scoped>
    .agency-matters{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
        .agency-matters-body {
            width: 100%;
            padding: 16px 0.1198rem 16px 0.09375rem;
            .text-input-container {
                float: left;
            }
            .process-select-container {
                float: left;
                margin-left: 0.1615rem;
            }
            .base-button-container {
                margin-left: 16px;
            }
        }
    }
    // .agency-matters .agency-matters_header{
    //     height: 0.3021rem;
    //     width: 100%;
    //     font-size: 20px;
    //     display: flex;
    //     align-items: center;
    //     padding-top: 16px;
    //     padding-left: 0.09375rem;
    //     border-bottom:1px solid rgba(112,112,112,0.13);
    // }
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