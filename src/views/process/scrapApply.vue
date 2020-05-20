<template>
    <div class="apply-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="apply-process">
            <div class="apply-process-body">
                <div class="process-info">
                    <scrap-order :order="order" :equip-items="equipItems"></scrap-order>
                </div>
                <div class="buttom" v-if="!isInfo">
                    <base-button label="提交" align="right" size="large" @click="submit"></base-button>
                    <base-button label="清空" align="right" size="large" type="danger"></base-button>
                </div>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import {complete, processStart, processDetail} from 'api/process'
    import {findByRfids} from "../../api/storage";
    import {transEquips} from "../../common/js/transEquips";
    import {getHouseInfo} from "../../api/organUnit";
    import ScrapOrder from "../../components/processNew/scrapOrder";

    var _ = require('lodash');
    export default {
        name: "scrapApply",
        components: {
            ScrapOrder,
            myHeader,
            bosTabs,
        },
        data() {
            return {
                title: "",
                rowData: '', // 选中的单选行数据
                //申请单
                order: {
                    warehouse: {},
                    organUnit: {},
                    applicant: {}
                },
                //任务
                task: {},
                //需要申请的装备列表
                scrapEquips: [],
                findIndex: 0,
                isInfo: false,
                isEdit: false,
            }
        },
        methods: {
            init() {
                getHouseInfo().then(res => {
                    // A端数据和平台数据不一致
                    this.order.warehouse.id = res.houseId
                    this.order.warehouse.name = res.houseName
                    this.order.organUnit.id = res.organUnitId
                    this.order.organUnit.name = res.organUnitName
                })
                this.order.applicant = JSON.parse(localStorage.getItem("user"))
            },
            selRow(current) { // 单选表格行
                if (!current) return; // 避免切换数据时报错
                this.detailTable.list = [];
                this.rowData = current;
                if (current.rfid === undefined) return;
                for (let rfid of current.rfid) {
                    this.detailTable.list.push({
                        rfid: rfid
                    })
                }
            },
            fetchData() {

            },
            readData() { // 读取数据
                findByRfids(this.mockRFIDs).then(res => {
                    this.order.scrapEquips = transEquips(res, 'args', 'args').simplifyItems
                    this.equipItems = transEquips(res,).equipItems
                })
            },
            sumFunc(param) { // 表格合并行计算方法
                let {columns, data} = param, sums = [];
                columns.forEach((colum, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                    } else if (index === columns.length - 1) {
                        const values = data.map(item => item.count ? Number(item.count) : 0);
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((pre, cur) => !isNaN(cur) ? pre + cur : pre);
                        }
                    } else {
                        sums[index] = '';
                    }
                })
                return sums;
            },
            submit() {
                processStart({
                    processDefinitionKey: this.$route.query.key,
                }, this.order).then(() => {
                    this.$router.push({name: 'myProcess'});
                })
            },
        },
        created() {
            let {processInstanceId, name} = this.$route.query
            if (!processInstanceId) {
                this.title = name + '详情'
                this.fetchData()
            } else {
                this.title = name + '申请'
                this.init();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .apply-process-container {
        width: 100%;
        color: #707070FF;
        font-size: 16px;
    }

    .apply-process {
        width: 100%;

        .apply-process-top {
            padding: 18px 7px;
            border-bottom: 1px solid #EBEEF5;
            overflow: hidden;
        }

        .apply-process-body {
            padding: 0 7px;
            overflow: auto;

            .process-info {
                padding: 18px 0;
                display: flex;
                justify-content: space-between;
                overflow: hidden;
            }

            .remark {
                margin-top: 18px;
            }

            .buttom {
                height: 72px;
                margin-top: 25px;
                box-shadow: 0px 0px 12px rgba(235, 238, 245, 1);

                .sum-equip {
                    float: right;
                    font-size: 20px;
                    color: #3F5FE0;
                    line-height: 72px;
                    margin-right: 72px;
                }
            }
        }
    }
</style>