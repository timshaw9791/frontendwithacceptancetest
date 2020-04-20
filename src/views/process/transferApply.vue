<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process" v-if="show">
            <div class="apply-process-top" data-test="action_box">
                <define-input label="单号" v-model="order.number" :disabled="true" placeholder="-"></define-input>
            </div>
            <div class="apply-process-body">
                <div class="process-info">
                    <date-select label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="order.applicant" :required="true" placeholder="请选择"></entity-input>
                    <entity-input label="入库机构" v-model="order.inboundOrganUnit" format="{name}" :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
                    <entity-input  label="入库库房" :disabled="true" placeholder="-"></entity-input>
                </div>
                <div class="process-info">
                    <entity-input label="入库人员" :disabled="true"  placeholder="-"></entity-input>
                    <entity-input label="出库机构" v-model="order.outboundOrganUnit" format="{name}" :options="{search:'organUnits'}" placeholder="请选择"></entity-input>
                    <entity-input label="出库库房"  :disabled="true"  placeholder="-"></entity-input>
                    <entity-input label="出库人员" :disabled="true"  placeholder="-"></entity-input>
                </div>
                <div class="process-info">
                    <text-input label="申请原因" v-model="order.note" :column="12" :tips="tips"></text-input>
                </div>
                <div class="table-box">
                    <bos-tabs :label="[{label: '总清单',key: 'total'}]">
                        <define-table :havePage="false" :data="order.equips" height="2.8646rem"
                            :showSummary="true" :summaryFunc="sumFunc" slot="total">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg" :options="{detail:'equipParam'}" format="{name}({model})"></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count" type="number"></define-input>
                            </define-column>
                        </define-table>
                    </bos-tabs>
                </div>
                <div class="buttom">
                    <base-button label="提交" align="right" :width="128" :height="72" :fontSize="20" @click="submit"></base-button>
                    <base-button label="清空" align="right" :width="128" :height="72" :fontSize="20" type="danger" @click="clean"></base-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import bosTabs from '@/componentized/table/bosTabs'
    import { complete, getOrder, processStart, processDetail } from 'api/process'
    var _ = require('lodash');
    export default {
        name: "scrapApply",
        components:{
            myHeader,
            textInput,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            divTmp,
            bosTabs
        },
        data(){
            return{
                title: "",
                show: false,
                order: {},
                tips: [{value: '直接报废', key: '1'}, {value: '装备拿去维修，无法修补', key: '2'}]
            }
        },
        methods:{
            init() {
                getOrder({processDefinitionKey: this.$route.params.info.key}).then(res => {
                    this.order = res
                    for(let i = 0;i<10;i++){
                        this.order.equips.push({
                            equipArg: {},
                            count: ''
                            }
                        )
                    }
                    this.show = true;
                }).catch(err => {
                    this.$message.error(err.response.data.message);
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
                let order = JSON.parse(JSON.stringify(this.order));
                order.equips = _.filter(_.flatten(_.map(this.order.equips, obj =>Object.assign({count:obj.count},_.pick(obj, 'equipArg')))), function(a) {return a.count!=0});
                if(order.equips.length == 0) {
                    this.$message.warning('未选择装备');
                    return;
                }
                processStart({processDefinitionKey: this.$route.params.info.key}, order).then(res => {
                    this.$message.success('流程申请成功');
                    this.$router.push({name: 'myProcess'});
                }).catch(err => {
                    this.$message.error(err.response.data.message);
                })
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
            clean(){//清空
                for(let i in this.order.equips){
					this.order.equips.splice(this.order.equips.i, 0, {count: '', rfid: [], equipId: [], equipArg: {}});
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
            this.init();
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-table {
        .el-table__body-wrapper { // 因为表格切换后，带有合计行的表格高度会变少，所以手动设置其高度
            height: 2.3594rem !important;
        }
    }
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
        }
    }
</style>