<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false" @h_black="black"></my-header>
        <div class="apply-process" v-if="show">
            <div class="apply-process-top" data-test="action_box">
                <text-input label="单号" v-model="order.number" :column="3" :disabled="true" class="odd-number"></text-input>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <text-input label="所在库房" v-model="order.warehouse.name" :column="3" :disabled="true"></text-input>
                    <date-select v-model="order.applyTime" :column="3" :disabled="true"></date-select>
                    <!-- <text-input label="申请人员" v-model="order.applicant.name" :disabled="true"></text-input> -->
                    <entity-input label="申请人员" v-model="order.applicant" :column="3" :required="true" placeholder="请选择"></entity-input>
                    <text-input label="申请原因" v-model="order.note" :haveTip="true" :column="3" :tips="tips" :title="order.note"></text-input>
                </div>
                <div class="table-box">
                    <base-button label="总清单" type="none"></base-button>
                    <div-tmp :column="8.49"></div-tmp>
                    <base-select label="硬件选择" v-model="select.selected" :column="2" :selectList="select.handWareList"></base-select>
                    <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96"></base-button>
                        <el-table :data="order.equips" fit height="505px" border>
                            <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.param" :options="{search: 'equipParam'}" format="{name}({model})"></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <text-input v-model="data.row.count" type="Number"></text-input>
                            </define-column>
                        </el-table>
                </div>
                <!-- <text-input label="合计" :column="12" :disabled="true"></text-input> -->
				<div class="total"><span>合计</span><span>{{ total }}</span></div>
                <!-- <text-input label="备注" v-model="order.note" width="100%" :height="40" class="remark"></text-input> -->
                <div class="buttom">
                    <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
                    <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"></base-button>
                    <div class="sum-equip">装备总数： {{ sumEquip }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import defineColumn from '@/componentized/entity/defineColumn'
    import { complete, getOrder, processStart, processDetail } from 'api/process'
    var _ = require('lodash');
    export default {
        name: "applyProcess",
        components:{
            myHeader,
            textInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            divTmp,
            defineColumn
        },
        data(){
            return{
                title: "",
                show: false,
                isReset: false, // 是否是重填申请
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
                tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}]
            }
        },
        methods:{
            init() {
                getOrder({processDefinitionKey: this.$route.params.info.key}).then(res => {
                    let userInfo = JSON.parse(localStorage.getItem('user'));
                    this.order = Object.assign(this.order, res, {
                        warehouse: {id: '1', name: '1号公共库房'}
                    });
                    // this.order.equips = [{
                    //     id: '1',
                    //     rfid: '00001',
                    //     name: "伸缩警棍",
                    //     model: 'ssjg',
                    //     count: 1
                    // },{
                    //     id: '2',
                    //     rfid: '00002',
                    //     name: "手铐",
                    //     model: 'sk',
                    //     count: 1
                    // },{
                    //     id: '3',
                    //     rfid: '00003',
                    //     name: '照明灯',
                    //     model: 'zmd',
                    //     count: 1
                    // }]
                    this.order.equips = [{
                        param: {},
                        count: ''
                    },{
                        param: {},
                        count: ''
                    },{
                        param: {},
                        count: ''
                    },{
                        param: {},
                        count: ''
                    },{
                        param: {},
                        count: ''
                    },{
                        param: {},
                        count: ''
                    },{
                        param: {},
                        count: ''
                    }]
                    this.show = true;
                }).catch(err => {
                    this.$message.error(err.response.data.message);
                })
            },
            getData() {
                processDetail({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
                    console.log(res);
                    this.order = Object.assign(this.order, res.processVariables.order);
                    this.order.equips = this.order.equips.map(obj => ({
                        param: _.pick(obj, ['id', 'name', 'model', 'rfid']),
                        count: obj.count || 0
                    }))
                    this.show = true;
                })
            },
            submit() {
                if(this.order.applicant.id == '') {
                    this.$message.warning('未选择申请人');
                    return;
                }
                 // 缺少rfid
                let temp = JSON.parse(JSON.stringify(this.order.equips)), equips; // 用以提交失败，还原equips
                equips = this.order.equips.map((obj, i)=>Object.assign({count: obj.count||1, rfid: i+1}, obj.param))
                                    .filter(obj => obj.name&&obj.model); 
                if(!equips.every(obj => obj.count>0&&!isNaN(obj.count))) {
                    this.$message.warning("请规范填写装备数量");
                    return;
                } else if(equips.length == 0) {
                    this.$message.warning('未扫入装备');
                    return;
                }
                this.order.equips = JSON.parse(JSON.stringify(equips));
                if(this.$route.params.info.number) {
                    let userId = JSON.parse(localStorage.getItem('user')).id;
                    complete(this.$route.params.info.taskId, {userId: userId}, {
                        order: this.order
                    }).then(res => {
                        this.$message.success("申请成功")
                        this.$router.push({name: 'myProcess'});
                    }).catch(err => {
                        this.$message.error(err.response.data.message);
                        this.order.equips = JSON.parse(JSON.stringify(temp));
                    })
                } else {
                    processStart({key: this.$route.params.info.key, orderType: this.order.type}, this.order).then(res => {
                        this.$message.success('流程申请成功');
                        this.$router.push({name: 'myProcess'});
                    }).catch(err => {
                        this.order.equips = JSON.parse(JSON.stringify(temp));
                        this.$message.error(err.response.data.message);
                    })
                }
            },
            changeRow(state, data) {
                let temp = JSON.parse(JSON.stringify(this.order.equips));
				if(state) {
					temp.splice(data.$index+1, 0, {count: '', param: {}});
				} else if(this.order.equips.length>1) {
					temp.splice(data.$index, 1); 
				}
				this.order.equips = temp;
            },
            black(data){
                this.$router.back()
            },
		},
		computed: {
			total() {
                if(this.order.equips.length == 0) return 0;
				return this.order.equips.reduce((pre, cur) => typeof pre == 'object'?Number(pre.count)+Number(cur.count):pre+Number(cur.count))
			},
			sumEquip() {
                if(this.order.equips.length == 0) return 0;
                return this.order.equips.filter(obj => obj.param.name&&obj.param.model).length;
			}
		},
        created() {
            if(this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回新启流程");
                this.$router.push({name: 'newProcess'});
                return
            }
            this.title = "我的流程/申请" + this.$route.params.info.name.substr(0, 2);
            if(this.$route.params.info.number) {
                this.isReset = true;
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
            padding: 18px 7px;
            border-bottom: 1px solid #EBEEF5;
            overflow: hidden;
        }
        .apply-process-body {
            padding: 0 7px;
            .process-info {
                padding: 18px 0;
                display: flex;
                justify-content: space-between;
                overflow: hidden;
            }
            .table-box {
                padding: 0 10px;
                .iconfont {
                    margin: 0 5px;
                }
            }
            .remark {
                margin-top: 18px;
            }
            .buttom {
                height: 72px;
                margin-top: 25px;
                box-shadow:0px 0px 12px rgba(235,238,245,1);
                .sum-equip {
                    float: right;
                    font-size:20px;
                    color: #3F5FE0;
                    line-height: 72px;
                    margin-right: 72px;
                }
            }
			.total {
				height: 36px;
				border: 1px solid #DCDFE6;
				display: flex;
				justify-content: space-between;
				margin: 0 10px;
				padding: 0 15px;
				font-size: 16px;
				align-items: center;
			}
        }
    }
</style>