<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="true" @h_black="black"></my-header>
        <div class="apply-process">
            <div class="apply-process-top" data-test="action_box">
                <text-input label="单号" v-model="applyOrder.number" :disabled="true" class="odd-number"></text-input>
                <base-button name="读取数据" :disabled="!select.selected" class="read" :width="96"></base-button>
                <process-select label="硬件选择" v-model="select.selected" :selectList="select.handWareList" class="handheld"></process-select>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <text-input label="当前库房" v-model="applyOrder.warehouse.name" :disabled="true"></text-input>
                    <date-select v-model="applyOrder.applyTime" :disabled="true"></date-select>
                    <text-input label="申请人员" v-model="applyOrder.applicant.name" :disabled="true"></text-input>
                    <text-input label="申请原因" v-model="applyOrder.applyReson" :haveTip="true" :tips="tips"></text-input>
                </div>
                <div class="table">表格组件</div>
                <text-input label="备注" v-model="applyOrder.note" width="100%" :height="40" class="remark"></text-input>
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
                applyOrder: {
                    type: 'scrap',
                    processInstanceId: '',
                    number: 20200324,
                    warehouse: {
                        id: 'sjkfa',
                        name: '市局库房a'
                    },
                    applyTime: new Date().getTime(),
                    applicant: {
                        id: '',
                        name: '',
                        organUnitId: ''
                    },
                    applyReson: "",
                    note: "",
                    equips: [{
                        id: '1',
                        rfid: '00001',
                        name: "伸缩警棍",
                        model: 'ssjg',
                        count: 1
                    },{
                        id: '2',
                        rfid: '00002',
                        name: "手铐",
                        model: 'sk',
                        count: 1
                    },{
                        id: '3',
                        rfid: '00003',
                        name: '照明灯',
                        model: 'zmd',
                        count: 1
                    }]
                },
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
                tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}],
                sumEquip: 0
            }
        },
        methods:{
            black(data){
                this.$router.back()
            },
        },
        created() {
            this.title = this.$route.params.title;
            let userInfo = JSON.parse(localStorage.getItem('user'));
            this.applyOrder.applicant = {id: userInfo.id, name: userInfo.name, organUnitId: userInfo.organUnitId}
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
            padding: 0 18px;
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