<template>
    <div class="apply-process-container">
        <my-header :title="title" :searchFlag="false" :haveBlack="!status.tableOrUniversalFlag" @h_black="black"></my-header>
        <div class="apply-process">
            <div class="apply-process-top" data-test="action_box" v-if="status.tableOrUniversalFlag">
                <text-input label="单号" v-model="oddNumber" :disabled="true" class="odd-number"></text-input>
                <base-button name="读取数据" :disabled="!select.selected" class="read" :width="96"></base-button>
                <process-select label="硬件选择" v-model="select.selected" :selectList="select.handWareList" class="handheld"></process-select>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <text-input label="当前库房" v-model="processInfo.currentHouse" :disabled="true"></text-input>
                    <date-select v-model="processInfo.date" :disabled="true"></date-select>
                    <text-input label="申请人员" v-model="processInfo.applyPerson" :disabled="true"></text-input>
                    <text-input label="申请原因" v-model="processInfo.applyReson" :haveTip="true" :tips="processInfo.tips"></text-input>
                </div>
                <div class="table">表格组件</div>
                <text-input label="备注" v-model="reMarks" width="100%" :height="40" class="remark"></text-input>
                <div class="buttom">
                    <base-button name="提交" :width="128" :height="72" :fontSize="20" class="submit"></base-button>
                    <base-button name="清空" :width="128" :height="72" :fontSize="20" type="danger" class="clear"></base-button>
                    <div class="sum-equip">装备总数： {{ sumEquip }}</div>
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
                title: "",
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
                reMarks: "",
                sumEquip: 0
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
        created() {
            this.title = this.$route.params.title;
        }
    }
</script>

<style lang="scss" scoped>
    .apply-process-container{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
    }
    .apply-process {
        width: 100%;
        border: 1px slid orange;
        .apply-process-top {
            padding: 18px;
            border-bottom: 1px solid #EBEEF5;
            overflow: hidden;
            .odd-number {
                float: left;
            }
            .read {
                float: right;
            }
            .handheld {
                margin-right: 18px;
                float: right;
            }
        }
        .apply-process-body {
            padding: 18px;
            .process-info {
                padding: 18px 0;
                display: flex;
                justify-content: space-between;
                overflow: hidden;
            }
            .table {
                height: 500px;
                border: 1px solid orange;
            }
            .remark {
                margin-top: 18px;
            }
            .buttom {
                height: 72px;
                margin-top: 25px;
                box-shadow:0px 0px 12px rgba(235,238,245,1);
                .submit {
                    float: right;
                }
                .clear {
                    float: right;
                }
                .sum-equip {
                    float: right;
                    font-size:20px;
                    color: #3F5FE0;
                    line-height: 72px;
                    margin-right: 72px;
                }
            }
        }
    }
</style>