<template>
    <div class="overview">
        <el-card shadow="never" :body-style="{ padding:'0.156rem'}" v-if="$store.getters.roles.includes('ADMINISTRATOR')">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div class="ov-content">

                <div class="statistics">
                    <div class="total">
                        <div>在库总数<span>{{topList.inHouseCount}}</span></div>
                        <div>出库总数<span>{{topList.outHouseCount}}</span></div>
                    </div>
                    <div class="ss-content" v-for="(item,index) in topList.genreStatisticList" :key="index">
                        <div class="title">
                            {{item.name}}
                        </div>
                        <div class="bulk" @click="gotoInfo('statistics',item.name)">
                            <progress-circular :width="70" :strokeWidth="6"
                                               :percentage="item.percentage"
                                               color="#3B86FF">
                                <div class="inside">
                                    <span class="percentage">{{item.percentage}}%</span>
                                    <span class="percentageName">出库</span>
                                </div>
                            </progress-circular>
                            <div class="inside-info">
                                <div class="sort">
                                    <div class="icon icon-on"></div>
                                    <div class="piece">在库 {{item.inHouseCount}}件</div>
                                </div>
                                <div class="sort">
                                    <div class="icon icon-ok"></div>
                                    <div class="piece">出库 {{item.outHouseCount}}件</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="block">

                    <div class="bk-style" v-for="(item,index) in contentList" :key="index+0.1">
                        <div class="bk-top">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="bk-content">
                            <el-scrollbar wrap-class="scroll-bar">
                                <div class="scroll-bar">
                                    <el-table :data="item.list" fit @row-click="gotoInfo">
                                        <div v-if="index===0">
                                            <bos-table-column lable="类型"
                                                              remWidth="170px"
                                                              :filter="(row)=>workType(row.type)"></bos-table-column>
                                            <bos-table-column lable="编号" field="number"></bos-table-column>
                                            <bos-table-column lable="状态"
                                                              :filter="(row)=>workState(row.state)"></bos-table-column>
                                        </div>
                                        <div v-if="index===1">
                                            <bos-table-column lable="倒计时"
                                                              :filter="(row)=>`${row.day}天`"></bos-table-column>

                                            <bos-table-column lable="名称" field="equipName"></bos-table-column>

                                            <bos-table-column lable="装备序号" field="equipSerial"></bos-table-column>


                                            <bos-table-column lable="类型" field="type"></bos-table-column>


                                        </div>
                                        <div v-if="index===2">
                                            <bos-table-column lable="倒计时"
                                                              :filter="(row)=>`${row.day}天`"></bos-table-column>

                                            <bos-table-column lable="名称"
                                                              field="equipArgInfo.equipName"></bos-table-column>

                                            <bos-table-column lable="型号"
                                                              field="equipArgInfo.equipModel"></bos-table-column>
                                            <bos-table-column lable="数量" field="count"></bos-table-column>
                                        </div>

                                        <div v-if="index===3">
                                            <bos-table-column lable="超时"
                                                              :filter="(row)=>countdown1(row.receiveTime)"></bos-table-column>
                                            <bos-table-column lable="名称" field="name"></bos-table-column>
                                            <bos-table-column lable="型号" field="equipArg.model"></bos-table-column>
                                        </div>
                                    </el-table>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>


                    <div class="bk-style">
                        <div class="bk-top">
                            <span>温/湿度</span>
                        </div>
                        <div class="bk-content center" @click="gotoInfo('surroundings')">
                            <progress-circular :width="180" :strokeWidth="6" :percentage="100" color="#2F2F76"
                                               style="cursor: pointer;">
                                <div class="inside">
                                    <div>当前温度</div>
                                    <div>{{surroundings.temperature}}°</div>
                                    <div>相对湿度:{{surroundings.humidity}}%</div>
                                </div>
                            </progress-circular>
                        </div>
                    </div>
                    <div class="bk-style">
                        <div class="bk-top">
                            <span @click="gotoInfo('video')" style="cursor:pointer">视频监控</span>
                        </div>
                        <div class="bk-content">
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card shadow="never" :body-style="{ padding:'0.156rem'}" v-else>
            正在注销!
        </el-card>

        <service-dialog ref="dialogMaturity" title="到期报废装备" width="60%" :button="false" :secondary="false">
            <el-table :data="maturityList" fit>
                <bos-table-column lable="RFID" field="rfid"></bos-table-column>
                <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
                <bos-table-column lable="架体AB面" field="location.surface"></bos-table-column>
                <bos-table-column lable="架体节号" field="location.section"></bos-table-column>
                <bos-table-column lable="架体层号" field="location.floor"></bos-table-column>
            </el-table>
        </service-dialog>

    </div>
</template>


<script>
    import progressCircular from 'components/base/progressCircular'
    import {temperatureValue} from "api/surroundings";
    import {equipmentAmount, equipmentScrapped, equipmentCharging, getProcess} from "api/statistics";
    import api from 'gql/home.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {baseURL} from "api/config";
    import serviceDialog from 'components/base/serviceDialog/index'
    import {equipmentScrappedInfo} from "api/statistics";
    import {getReceiveList} from 'api/overview'
    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;todo

    export default {
        data() {
            return {
                list: [],
                flag: false,
                surroundings: {
                    temperature: 0,
                    humidity: 0,
                }
                ,
                topList: [],
                contentList:
                    [{name: '调拨通知'}, {name: '保养/充电通知'}, {name: '到期报废提醒'}, {name: '未归还提醒'}],
                videoTime: '',
                maturityList: [],
            }
        },
        mixins: [formRulesMixin, transformMixin],
        methods: {
            getList() {
                let data = {
                    page: 1,
                    size: 20,
                    applicantId: JSON.parse(localStorage.getItem('user')).id,
                    property: 'time',
                    direction: 'DESC'
                };

                getProcess(data).then(res => {
                    this.contentList[0] = {
                        list: res.content,
                        name: '调拨通知',
                    };
                    console.log(res);
                });


                equipmentScrapped().then(res => {
                    console.log(res);
                    this.contentList[2] = {
                        list: res,
                        name: '到期报废提醒',
                    };
                    this.contentList.push('');
                    this.contentList.pop();
                }).catch(err => {
                    console.log(err);
                });

                equipmentCharging().then(res => {
                    console.log(res);
                    this.contentList[1] = {
                        list: res,
                        name: '保养/充电通知',
                    }
                }).catch(err => {
                    console.log(err);
                });

                equipmentAmount().then(res => {
                    res.genreStatisticList.forEach((item, index) => {
                        res.genreStatisticList[index]['percentage'] = item.outHouseCount !== 0 ? Math.round((item.outHouseCount / item.count) * 100) : 0;
                    });
                    this.topList = res;
                }).catch(err => {
                    console.log(err);
                });
                getReceiveList().then(res=>{
                    console.log(res);
                    this.contentList[3] = {
                        list: JSON.parse(JSON.stringify(res)),
                        name: '未归还提醒',
                    };
                    this.contentList.push('');
                    this.contentList.pop();
                });
                // this.gqlQuery(api.getEquipList, {
                //     "paginator": {
                //         "page": 1,
                //         "size": 20
                //     },
                //     "qfilter": {
                //         "key": "receiveTime",
                //         "operator": "GREATTHAN",
                //         "value": "0",
                //         "combinator": "AND",
                //         "next": {
                //             "key": "receiveTime",
                //             "operator": "GREATTHAN",
                //             "value": new Date - 1000 * 60 * 60 * 24 * 3
                //         }
                //     }
                // }, (res) => {
                //     this.contentList[3] = {
                //         list: JSON.parse(JSON.stringify(res.data.EquipList.content)),
                //         name: '未归还提醒',
                //     };
                //     this.contentList.push('');
                //     this.contentList.pop();
                // });
            },
            gotoInfo(row, route) {
                console.log(row,route);
                if (row.type === '充电') {
                    this.$router.push({path: '/equipmentOperation/charging', query: {name: row.equipRfid}});
                } else if (row.type === '保养') {
                    this.$router.push({path: '/equipmentOperation/maintenance', query: {name: row.equipRfid}});
                }
                if (row === 'surroundings') {
                    this.$router.push('/surroundings/index');
                }
                if (row === 'video') {
                    this.$router.push({path: '/surroundings/index', query: {name: 'video'}});
                }
                if (row === 'statistics') {
                    this.$router.push({path: '/report/index', query: {name: route}});
                }

                if (row.state && row.inputTime) {
                    this.$router.push({path: '/record/borrow', query: {name: row.rfid}});
                }
                if (row.count) {
                    equipmentScrappedInfo({
                        model: row.equipArgInfo.equipModel,
                        name: row.equipArgInfo.equipName
                    }).then(res => {
                        this.maturityList = res;
                    });
                    this.$refs.dialogMaturity.show();
                }

                if (row.processInstanceId) {
                    switch (row.type) {
                        case 'DOWN_TO_UP':
                            this.$router.push({
                                path: '/process/transfer',
                                query: {
                                    state: row.state,
                                    type: row.type,
                                    id: row.id,
                                    number:row.number,
                                    processInstanceId: row.processInstanceId
                                }
                            });
                            break;
                        case 'BORROW':
                            this.$router.push({
                                path: '/process/secondment',
                                query: {
                                    state: row.state,
                                    type: row.type,
                                    id: row.id,
                                    number:row.number,
                                    processInstanceId: row.processInstanceId
                                }
                            });
                            break;
                        case 'SCRAP':
                            this.$router.push({
                                path: '/process/scrapped',
                                query: {
                                    state: row.state,
                                    type: row.type,
                                    id: row.id,
                                    number:row.number,
                                    processInstanceId: row.processInstanceId
                                }
                            });
                            break;
                        case 'DIRECT_TRANSFER':
                            this.$router.push({
                                path: '/process/directAdjustment',
                                query: {
                                    state: row.state,
                                    type: row.type,
                                    id: row.id,
                                    number:row.number,
                                    processInstanceId: row.processInstanceId
                                }
                            });
                            break;
                    }
                }
            },
            getHumiture() {
                this.$ajax({
                    method: 'post',
                    url: baseURL + '/environment/humitureQuery',
                }).then((res) => {
                    this.surroundings.temperature = res.data.data.temperature;
                    this.surroundings.humidity = res.data.data.humidity;
                }).catch(err => {
                    this.$message.error(err);
                });
            },

        },

        mounted() {
            this.getList();
            this.getHumiture();
            this.videoTime = setInterval(() => {
                window.location.reload();
            }, 180000);  //180000
        },
        beforeDestroy() {
            clearTimeout(this.videoTime);
        },

        components: {
            progressCircular,
            serviceDialog
        },

    }
</script>

<style lang="scss">
    @import '~common/css/Adaptive';
    .el-message {
        font-size: 0.0833rem;
    }
    // .el-table__header {
    //     display: flex;
    // }

</style>

<style lang="scss" scoped>

    /deep/ .hover-row {
        cursor: pointer;
    }

    .overview {
        font-size: .1rem;

        .el-card {
            border: none !important;
        }

        // ._card-title {
        //     font-size: 0.0938rem;
        // }
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .ov-content {

            .statistics {
                padding: 0 1vw;
                box-shadow: 0 .01rem .03rem rgba(0, 0, 0, 0.16);
                display: flex;
                align-items: center;
                height: .67rem;
                width: 100%;
                flex-wrap: wrap;
                justify-content: space-around;

                .total {
                    font-size: .08rem;
                    font-weight: bold;
                    color: rgba(77, 79, 92, 1);

                    div {
                        padding-bottom: .05rem;
                    }

                    span {
                        margin-left: .07rem;
                        font-size: .1rem;
                    }
                }

                .ss-content {
                    .title {
                        text-align: center;
                        font-size: .09rem;
                        color: rgba(77, 79, 92, 1);
                        margin-bottom: 0.0879rem;
                    }

                    .bulk {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;

                        .ProgressCircular {
                            height: 0 !important;
                        }

                        .inside {
                            display: grid;
                            color: rgba(77, 79, 92, 1);
                            text-align: center;

                            .percentage {

                            }

                            .percentageName {

                            }
                        }

                        .inside-info {
                            margin-left: .06rem;
                            display: flex;
                            flex-direction: column;

                            .sort {
                                display: flex;
                                align-items: center;
                                margin-top: .02rem;

                                .icon {
                                    width: .052rem;
                                    height: .05rem;
                                    border-radius: 50%;

                                }

                                .icon-on {
                                    background: rgba(232, 234, 239, 1);
                                }

                                .icon-ok {
                                    background: rgba(59, 134, 255, 1);
                                }

                                .piece {
                                    margin-left: .05rem;
                                }

                            }
                        }
                    }


                }
            }

            .block {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .bk-style {
                    width: 2.656rem;
                    height: 1.6927rem;
                    box-shadow: 0 .015rem .031rem rgba(0, 0, 0, 0.16);
                    // margin-bottom: 14px;
                    margin-top: .135rem;
                    color: rgba(112, 112, 112, 1);

                    .bk-top {
                        height: .218rem;
                        border-left: .02rem solid rgba(47, 47, 118, 0.75);
                        padding: .072rem;
                        margin-bottom: .052rem;

                        span {
                            font-size: .093rem;

                        }
                    }


                    .bk-content {

                        .el-table {
                            font-size: 0.0729rem;
                        }

                        .el-table /deep/ th.is-leaf,
                        .el-table td {
                            font-size: 0.0833rem;
                        }

                        // .el-table /deep/ .el-table__header {
                        //     width: 100% !important;
                        //     display: flex;
                        // }

                        .el-table /deep/ th {
                            padding: 3px 0;
                        }

                        .el-table /deep/ div.cell {
                            padding: 0;
                        }





                        .monitor {
                            width: 1.562rem;
                            height: 1.562rem;
                        }

                        .scroll-bar {
                            max-height: 1.302rem;
                            width: 100%;
                        }

                        .inside {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;

                            div {
                                color: rgba(47, 47, 118, 1);
                            }

                            div:first-child {
                                font-size: .083rem;
                            }

                            div:nth-child(2) {
                                font-size: .286rem;
                                margin-left: .093rem;
                            }

                            div:last-child {
                                font-size: .072rem;

                            }
                        }
                    }
                }
            }
        }

    }

    .el-table__body-wrapper is-scrolling-left /deep/ .el-table__empty-block {
        width: 2.25rem !important;
    }

</style>


