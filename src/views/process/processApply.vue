<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false" @h_black="black"></my-header>
        <div class="apply-process" v-if="show">
            <div class="apply-process-top" data-test="action_box">
                <text-input label="单号" v-model="order.number" :disabled="true" class="odd-number"></text-input>
                <base-button label="读取数据" :disabled="!select.selected" class="read" :width="96"></base-button>
                <process-select label="硬件选择" v-model="select.selected" :selectList="select.handWareList" class="handheld"></process-select>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <text-input label="所在库房" v-model="order.warehouse.name" :disabled="true"></text-input>
                    <date-select v-model="order.applyTime" :disabled="true"></date-select>
                    <!-- <text-input label="申请人员" v-model="order.applicant.name" :disabled="true"></text-input> -->
                    <entity-input label="申请人员" v-model="order.applicant" :required="true" placeholder="请选择"></entity-input>
                    <text-input label="申请原因" v-model="order.applyReson" :haveTip="true" :tips="tips"></text-input>
                </div>
                <div class="table">表格组件</div>
                <text-input label="备注" v-model="order.note" width="100%" :height="40" class="remark"></text-input>
                <div class="buttom">
                    <base-button label="提交" :width="128" :height="72" :fontSize="20" class="submit" @click="submit"></base-button>
                    <base-button label="清空" :width="128" :height="72" :fontSize="20" type="danger" class="clear"></base-button>
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
    import entityInput from '@/componentized/entity/entityInput'
    import { complete, getOrder, processStart, processDetail } from 'api/process'
    export default {
        name: "applyProcess",
        components:{
            myHeader,
            textInput,
            processSelect,
            baseButton,
            dateSelect,
            entityInput
        },
        data(){
            return{
                title: "",
                show: false,
                order: {
                    type: 'scrap',
                    processInstanceId: '',
                    number: "",
                    warehouse: {
                        id: 'sjkfa',
                        name: '市局库房a'
                    },
                    applyTime: 0,
                    applicant: {
                        id: '',
                        name: '',
                        organUnitId: ''
                    },
                    applyReson: "",
                    note: "",
                    equips: []
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
            init() {
                getOrder({processDefinitionKey: this.$route.params.info.key}).then(res => {
                    let userInfo = JSON.parse(localStorage.getItem('user'));
                    this.order = Object.assign(this.order, res, {
                        warehouse: {id: '1', name: '1号公共库房'}
                    });
                    this.order.equips = [{
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
                    this.show = true;
                }).catch(err => {
                    this.$message.error(err.response.data.message);
                })
            },
            getData() {
                processDetail({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
                    this.order = Object.assign(this.order, res.processVariables.order)
                    this.show = true;
                })
            },
            submit() {
                if(this.$route.params.info.number) {
                    let userId = JSON.parse(localStorage.getItem('user')).id;
                    complete(this.$route.params.taskId, {userId: userId}, {
                        order: this.order
                    }).then(res => {
                        this.$message.success("申请成功")
                        this.$router.push({name: 'myProcess'});
                    })
                } else {
                    processStart({key: this.$route.params.info.key, orderType: this.order.type}, this.order).then(res => {
                    this.$message.success('流程申请成功');
                    this.$router.push({name: 'myProcess'});
                })
                }
            },
            black(data){
                this.$router.back()
            },
        },
        created() {
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回新启流程");
                this.$router.push({name: 'newProcess'});
                return
            }
            this.title = "我的流程/申请" + this.$route.params.info.name.substr(0, 2);
            if(this.$route.params.info.number) {
                this.getData();
            } else {
                this.init();
            }
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