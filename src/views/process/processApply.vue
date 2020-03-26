<template>
    <div class="agency-matters">
        <my-header title="我的流程/流程申请" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
        <div class="apply-process-container">
            <div class="apply-process-top" data-test="action_box" v-if="status.tableOrUniversalFlag">
                <div class="odd-number">单号： {{ oddNumber }}</div>
                <base-button name="读取数据"></base-button>
                <process-select v-model="select.selected" :selectList="select.handWareList"></process-select>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <text-input titleName="当前库房" v-model="processInfo.currentHouse" :disabled="true"></text-input>
                    <date-select v-model="processInfo.date" :disabled="true"></date-select>
                    <text-input titleName="申请人员" v-model="processInfo.applyPerson" :disabled="true"></text-input>
                    <text-input titleName="申请原因" v-model="processInfo.applyReson" :haveTip="true" :tips="processInfo.tips"></text-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import processSelect from '@/componentized/textBox/processSelect.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    export default {
        name: "applyProcess",
        components:{
            myHeader,
            textInput,
            processSelect,
            baseButton,
            dateSelect
        },
        data(){
            return{
                status:{
                    tableOrUniversalFlag:true,
                },
                oddNumber: 20200324,
                select: {
                    handWareList: [{
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读卡器",
                        value: "reader"
                    }],
                    selected: ""
                },
                processInfo: {
                    currentHouse: "XXXXXX",
                    date: new Date().getTime(),
                    applyPerson: "王小明",
                    applyReson: "",
                    tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}]
                },
            }
        },
        methods:{
            black(data){
                this.status.tableOrUniversalFlag=!this.status.tableOrUniversalFlag;
                if(data==='refetch'){
                    this.refetch();
                }
            },
        },
        mounted() {
          console.log(this.$route.params);
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
    .apply-process-container{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
        .apply-process-top {
            width: 100%;
            overflow: hidden; // Ⅹ浮动的子元素也能称其父元素
            padding: 16px 0.1198rem 16px 0.09375rem;
            border-bottom: 1px solid #EBEEF5;
            .odd-number {
                float: left;
                font-size:18px;
                font-family:PingFang SC;
                font-weight:600;
                color:rgba(112,112,112,1);
                vertical-align: middle;
                line-height: 40px;
            }
            .process-select-container {
                float: right;
                margin-left: 0.1615rem;
            }
            .base-button-container {
                float: right;
                margin-left: 16px;
            }
        }
    }
    .apply-process-body {
        padding: 16px 0.1198rem 16px 0.09375rem;
        .process-info {
            .text-input-container {
                margin-right: 16px;
                float: left;
            }
            .date-select-continer {
                margin-right: 16px;
                float: left;
            }
        }
    }
</style>