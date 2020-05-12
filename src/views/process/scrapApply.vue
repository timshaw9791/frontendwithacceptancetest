<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process" v-if="show">
            <div class="apply-process-top" data-test="action_box">
                <define-input label="单号" v-model="order.number" :disabled="true" class="odd-number"></define-input>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <define-input label="所在库房" v-model="order.warehouse.name" :disabled="true"></define-input>
                    <date-select v-model="order.createTime" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="order.applicant" :required="true" placeholder="请选择"></entity-input>
                    <text-input label="申请原因" v-model="order.note" :tips="tips" :title="order.note"></text-input>
                </div>
                <div class="table-box">
                    <bos-tabs>
                        <template slot="slotHeader">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
                        <define-table :data="order.equips" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true" :showSummary="true" :summaryFunc="sumFunc" slot="total">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg" :options="{}" :tableEdit="true" format="{name}({model})"></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                        <define-table :data="detailTable.list" height="2.8646rem" :havePage="false" slot="detail">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont iconyichuliang" @click="changeDetailRow(data)"></i>
                            </define-column>
                            <define-column label="RFID" field="rfid"></define-column>
                        </define-table>
                    </bos-tabs>
                </div>
                <div class="buttom">
                    <base-button label="提交" align="right" size="large" @click="submit"></base-button>
                    <base-button label="清空" align="right" size="large" type="danger"></base-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import { complete, getOrder, processStart, processDetail } from 'api/process'
    var _ = require('lodash');
    export default {
        name: "scrapApply",
        components:{
            myHeader,
            bosTabs
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
                    createTime: 0,
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
                        label: "读写器",
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
                    this.order.equips = [{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    },{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    },{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    },{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    },{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    },{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    },{
                        equipArg: {},
                        rfid: [],
                        count: ''
                    }]
                    this.show = true;
                }).catch(err => {
                    this.$message.error(err.response.data.message);
                })
            },
            getData() {
                processDetail({processInstanceId: this.$route.params.info.processInstanceId}).then(res => {
                    res.processVariables.order.equips = _.values(_.reduce(res.processVariables.order.equips, (result, obj) => {
                        if(result[obj.equipArg.model]) {
                            result[obj.equipArg.model].count++;
                            result[obj.equipArg.model].rfid.push(obj.rfid);
                            result[obj.equipArg.model].equipId.push(obj.equipId);
                        } else {
                            result[obj.equipArg.model] = {count: 1, rfid: [obj.rfid], equipId: [obj.equipId], equipArg: obj.equipArg};
                        }
                        return result;
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
                if(current.rfid == undefined) return;
                for(let rfid of current.rfid) {
                    this.detailTable.list.push({
                        rfid: rfid
                    })
                }
            },
            readData() { // 读取数据
                let data = [{equipId: [4, 5], rfid: ['4', '5'], count: 2, equipArg: {"id": "3",
                            "updateTime": 1585892996324,
                            "createTime": 1585892992627,
                            "name": "test_金属手铐",
                            "model": "gssk",
                            "shelfLife": 31104000000,
                            "upkeepCycle": 0,
                            "chargeCycle": 0,
                            "supplier": {
                                "id": "1",
                                "updateTime": 1586498582568,
                                "createTime": 1586498581845,
                                "name": "测试_供应商",
                                "person": "测试_人员",
                                "phone": "13922224444"
                            },
                            "alphabetic": "JSSK",
                            "image": "",
                            "pdf": null,
                            "video": null,
                            "categoryId": "1"}},
                            {equipId: [3], rfid: ['3'], count: 1, equipArg: {"id": "4",
                            "updateTime": 1585892996324,
                            "createTime": 1585892992628,
                            "name": "test_塑料手铐",
                            "model": "slsk",
                            "shelfLife": 31104000000,
                            "upkeepCycle": 0,
                            "chargeCycle": 0,
                            "supplier": {
                                "id": "1",
                                "updateTime": 1586498582568,
                                "createTime": 1586498581845,
                                "name": "测试_供应商",
                                "person": "测试_人员",
                                "phone": "13922224444"
                            },
                            "alphabetic": "SLSK",
                            "image": "",
                            "pdf": null,
                            "video": null,
                            "categoryId": "2"}}];
                    // this.order.equips = data;
                data.forEach((obj, index) => {
                    this.order.equips[index].count = obj.count; // 这样赋值是为了避免绑定源丢失，导致页面不刷新
                    this.order.equips[index].rfid = obj.rfid;
                    this.order.equips[index].equipArg = obj.equipArg;
                    this.order.equips[index].equipId = obj.equipId;
                })
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                columns.forEach((colum, index) => {
                    if(index == 0) {
                        sums[index] =  '合计';
                    } else if(index == columns.length-1) {
                        const values = data.map(item => item.count?Number(item.count):0);
                        if(!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((pre, cur) => !isNaN(cur)?pre+cur:pre);
                        }
                    } else {
                        sums[index] = '';
                    }
                })
                return sums;
            },
            submit() {
                if(this.order.applicant.id == '') {
                    this.$message.warning('未选择申请人');
                    return;
                }
                let order = JSON.parse(JSON.stringify(this.order));
                // order.equips = _.filter(_.flatten(_.map(this.order.equips, obj => _.map(obj.param.rfid, (v, i) => Object.assign({rfid: v}, _.pick(obj.param, ['name', 'model']), {equipId: obj.param.id[i]})))), obj=> obj.name&&obj.model);
                order.equips = _.filter(_.flatten(_.map(this.order.equips, obj => _.map(obj.rfid, (v, i) => Object.assign({rfid: v}, _.pick(obj, 'equipArg'), {equipId: obj.equipId[i]})))), obj=> obj.rfid&&obj.equipId);
                console.log(order);
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
					temp.splice(data.$index+1, 0, {count: '', rfid: [], equipId: [], equipArg: {}});
				} else if(this.order.equips.length>1) {
					temp.splice(data.$index, 1); 
				} else {
                    temp = [{count: '', rfid: [], equipId: [], equipArg: {}}]
                }
				this.order.equips = temp;
            },
            changeDetailRow(data) { // 明细删除
                this.detailTable.list.splice(data.$index, 1);
                this.rowData.rfid.splice(data.$index, 1);
                this.rowData.equipId.splice(data.$index, 1);
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
    // /deep/ .el-table {
    //     .el-table__body-wrapper { // 因为表格切换后，带有合计行的表格高度会变少，所以手动设置其高度
    //         height: 2.3594rem !important;
    //     }
    // }
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
        }
    }
</style>