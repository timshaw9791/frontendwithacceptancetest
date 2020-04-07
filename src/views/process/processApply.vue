<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process" v-if="show">
            <div class="apply-process-top" data-test="action_box">
                <text-input label="单号" v-model="order.number" :column="3" :disabled="true" class="odd-number"></text-input>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <text-input label="所在库房" v-model="order.warehouse.name" :column="3" :disabled="true"></text-input>
                    <date-select v-model="order.applyTime" :column="3" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="order.applicant" :column="3" :required="true" placeholder="请选择"></entity-input>
                    <text-input label="申请原因" v-model="order.note" :haveTip="true" :column="3" :tips="tips" :title="order.note"></text-input>
                </div>
                <div class="table-box">
                    <div :class="{'total-list':true,'active':tabsIndex==1}" @click="switchTab(1)">总清单</div>
                    <div :class="{'detail-list':true,'active':tabsIndex==2}" @click="switchTab(2)">明细</div>
                    <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                    <base-select label="硬件选择" v-model="select.selected" :column="2" align="right" :selectList="select.handWareList"></base-select>
                        <el-table :data="order.equips" fit height="505px" @current-change="selRow" highlight-current-row border v-if="!showDetail">
                            <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.param" :options="{}" format="{name}({model})"></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <text-input v-model="data.row.count" type="Number" :disabled="true"></text-input>
                            </define-column>
                        </el-table>
                        <el-table :data="detailTable.list" fit height="505px" border v-else>
                            <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont iconyichuliang" @click="changeDetailRow(data)"></i>
                            </define-column>
                            <define-column label="RFID" field="rfid"></define-column>
                        </el-table>
                </div>
                <!-- <text-input label="合计" :column="12" :disabled="true"></text-input> -->
				<div class="total"><span>合计</span><span>{{ total }}</span></div>
                <!-- <text-input label="备注" v-model="order.note" width="100%" :height="40" class="remark"></text-input> -->
                <div class="buttom">
                    <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
                    <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger"></base-button>
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
                tabsIndex: 1,
                rowData: '', // 选中的单选行数据
                showDetail: false, // 明细列表
                detailTable: {
                    list: [],
                },
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
                let organUnit = JSON.parse(localStorage.getItem('user'))
                getOrder({processDefinitionKey: this.$route.params.info.key}).then(res => {
                    let userInfo = JSON.parse(localStorage.getItem('user'));
                    this.order = Object.assign(this.order, res, {
                        warehouse: {id: '1', name: '1号公共库房'}
                    }, {
                        organUnit: {id: organUnit.organUnitId, name: organUnit.organUnitName}
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
                    res.processVariables.order.equips = _.values(_.reduce(res.processVariables.order.equips, (res, obj) => {
                        if(res[obj.model]) {
                        res[obj.model].count++;
                        res[obj.model].param.rfid.push(obj.rfid);
                        res[obj.model].param.id.push(obj.equipId);
                        } else {
                        res[obj.model] = {count: 1, param: Object.assign(obj, {rfid: [obj.rfid], id: [obj.equipId]})};
                        }
                        return res;
                    }, {}))
                    this.order = Object.assign(this.order, res.processVariables.order);
                    this.show = true;
                })
            },
            switchTab(index) { // 切换标签卡
                if(index == 1) {
                    this.showDetail = false;
                } else if(this.detailTable.list.length == 0) {
                    this.$message.warning('未选择装备信息');
                    return;
                } else {
                    this.showDetail = true;
                }
                this.tabsIndex = index;
            },
            selRow(current) { // 单选表格行
                if(!current) return; // 避免切换数据时报错
                this.detailTable.list = [];
                this.rowData = current;
                if(current.param.rfid == undefined) return;
                for(let rfid of current.param.rfid) {
                    this.detailTable.list.push({
                        rfid: rfid
                    })
                }
            },
            readData() { // 读取数据
                let data = [{param: {id: [4, 5], model: 'slsk', rfid: ['4', '5'], name: 'test_塑料手铐'}, count: 1, index: 0},
                            {param: {id: [3], model: 'gssk', rfid: ['3'], name: 'test_金属手铐'}, count: 1, index: 1}]
                    this.order.equips = data;
            },
            submit() {
                if(this.order.applicant.id == '') {
                    this.$message.warning('未选择申请人');
                    return;
                }
                 // 缺少rfid
                // equips = this.order.equips.map((obj, i)=>Object.assign({count: obj.count||1, rfid: i+1}, _.mapKeys(obj.param, (v,k) => k=='id'?'equipId':k)))
                //                     .filter(obj => obj.name&&obj.model); 
                let order = JSON.parse(JSON.stringify(this.order));
                order.equips = _.filter(_.flatten(_.map(this.order.equips, obj => _.map(obj.param.rfid, (v, i) => Object.assign({rfid: v}, _.pick(obj.param, ['name', 'model']), {equipId: obj.param.id[i]})))), obj=> obj.name&&obj.model);
                console.log(order);
            //    if(!order.equips.every(obj => obj.count>0&&!isNaN(obj.count))) {
            //         this.$message.warning("请规范填写装备数量");
            //         return;
            //     } 
                if(order.equips.length == 0) {
                    this.$message.warning('未扫入装备');
                    return;
                }
                if(this.$route.params.info.number) {
                    let userId = JSON.parse(localStorage.getItem('user')).id;
                    complete(this.$route.params.info.taskId, {userId: userId}, {
                        order: order
                    }).then(res => {
                        this.$message.success("申请成功")
                        this.$router.push({name: 'myProcess'});
                    }).catch(err => {
                        this.$message.error(err.response.data.message);
                    })
                } else {
                    processStart({processDefinitionKey: this.$route.params.info.key, orderType: this.order.type}, order).then(res => {
                        this.$message.success('流程申请成功');
                        this.$router.push({name: 'myProcess'});
                    }).catch(err => {
                        this.$message.error(err.response.data.message);
                    })
                }
            },
            changeRow(state, data) { // 总清单删除
                let temp = JSON.parse(JSON.stringify(this.order.equips));
				if(state) {
					temp.splice(data.$index+1, 0, {count: '', param: {}});
				} else if(this.order.equips.length>1) {
					temp.splice(data.$index, 1); 
				} else {
                    temp = [{count: '', param: {}}]
                }
				this.order.equips = temp;
            },
            changeDetailRow(data) { // 明细删除
                this.detailTable.list.splice(data.$index, 1);
                this.rowData.param.rfid.splice(data.$index, 1);
                this.rowData.param.id.splice(data.$index, 1);
                if(this.detailTable.list.length == 0) {
                    for(let index in this.order.equips) {
                        if(JSON.stringify(this.order.equips[index]) == JSON.stringify(this.rowData)) {
                            this.changeRow(false, {$index: index});
                            break;
                        }
                    }
                }
            }
		},
		computed: {
			total() {
                if(this.order.equips.length == 0) return 0;
                return _.reduce(this.order.equips, (r, v, k) => v.count==undefined?r:r+ +v.count, 0);
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
                .total-list,
                .detail-list {
                    display: inline-block;
                    border: 1px solid #EAEAEA;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 10px;
                    background-color: #DCDFE6;
                    cursor: pointer;
                }
                .active {
                    background-color: white;
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