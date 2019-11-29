<template>
    <div class="overview" v-loading="loading" element-loading-text="正在同步中">
        <el-card shadow="never" :body-style="{ padding:'0.156rem'}">
            <div class="topRemind">
                <div class="remind-box" v-for="(item, i) in topRemindList" :key="i" @click="toOther(item.key)">
                    <div class="count">{{ item.count }}</div>
                    <div :class="{'tag': true, 'only-tag': item.count == undefined}">{{ item.tag }}</div>
                </div>
            </div>

            
        </el-card>
        
        <el-card  shadow="never" :body-style="{ padding:'0.156rem'}">
            <div class="to-do">
                <div class="title">待办事宜</div>
                <div class="event-list">
                    <div class="event-box" v-for="(event, i) in toDoList" :key="i">
                        <div>{{ event.name }}</div>
                        <div>{{ event.type }}</div>
                        <div>{{ event.time }}</div>
                    </div>
                </div>
            </div>
        </el-card>

        <el-card shadow="never" :body-style="{ padding:'0.156rem'}">
            <div class="inventory-statistics">
                <div class="header">
                    <div class="title">库存统计</div>
                    <div class="sum-info">
                        <div class="info-box">
                            <div class="num">{{ totalIsUse }}</div>
                            <div class="tag">领用总数</div>
                        </div>
                        <svg-icon icon-class="领用总数" class="svg-icon"></svg-icon>
                        <div class="info-box">
                            <div class="num">{{ totalCanUse }}</div>
                            <div class="tag">可用总数</div>
                        </div>
                        <svg-icon icon-class="可用总数" class="svg-icon"></svg-icon>
                    </div>
                </div>
                <div class="body" ref="inventory">
                    <div class="item" v-for="(item, i) in inventoryList" :key="i">
                        <progress-circular 
                            :width="131" 
                            :strokeWidth="9"
                            :percentage="item.percentage"
                            color="#3B86FF"
                            v-show="showCircular"
                            style="margin: 0 auto">
                            <div class="inside">
                                <span>{{ item.percentage }}%</span>
                                <span>领用</span>
                            </div>
                        </progress-circular>
                        <div class="other-info">
                            <div class="info">
                                <div class="icon-white"></div>
                                <div class="tip">可用数量 {{ item.canUse }}</div>
                            </div>
                            <div class="info">
                                <div class="icon-blue"></div>
                                <div class="tip">领用数量 {{ item.isUse }}</div>
                            </div>
                        </div>
                        <div class="item-type">{{ item.genreName }}</div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>


<script>
    import progressCircular from 'components/base/progressCircular'
    import { findAllData, findEquipsNeedChange } from 'api/overview'
    import { writeFile } from "common/js/rfidReader"
    // import FlvPlayerVue from 'components/videoPlayer/FlvPlayer.vue';
    // import {temperatureValue} from "api/surroundings";
    // import {equipmentAmount, equipmentScrapped, equipmentCharging, getProcess} from "api/statistics";
    // import {transformMixin} from 'common/js/transformMixin'
    // import {formRulesMixin} from 'field/common/mixinComponent';
    // import {baseURL} from "api/config";
    // import serviceDialog from 'components/base/serviceDialog/index'
    // import {equipmentScrappedInfo} from "api/statistics";
    // import {getReceiveList} from 'api/overview'
    
    export default {
        data() {
            return {
                topRemindList: [{
                    count: 0,
                    key: 'CHARGE',
                    tag: "充电提醒"
                },{
                    count: 0,
                    key: 'KEEP',
                    tag: "保养提醒"
                },{
                    count: 0,
                    key: 'NOT_RETURN',
                    tag: "未归还提醒"
                },{
                    count: 0,
                    key: 'SCRAP',
                    tag: "到期报废提醒"
                },{
                    key: 'SYNC',
                    tag: "同步手持机"
                }],
                toDoList: [{
                    name: "调拨流程申请-王小明",
                    type: "调拨流程",
                    time: "2019-11-30"
                },{
                    name: "调拨流程申请-王小明",
                    type: "调拨流程",
                    time: "2019-11-30"
                },{
                    name: "调拨流程申请-王小明",
                    type: "调拨流程",
                    time: "2019-11-30"
                },{
                    name: "调拨流程申请-王小明",
                    type: "调拨流程",
                    time: "2019-11-30"
                },{
                    name: "调拨流程申请-王小明",
                    type: "调拨流程",
                    time: "2019-11-30"
                },{
                    name: "调拨流程申请-王小明",
                    type: "调拨流程",
                    time: "2019-11-30"
                }],
                inventoryList: [{
                    percentage: 0,
                    canUse: 0,
                    isUse: 0,
                    genreName: "警械类"
                },
                {
                    percentage: 0,
                    canUse: 0,
                    isUse: 0,
                    genreName: "防护、防爆装备类"
                },
                {
                    percentage: 0,
                    canUse: 0,
                    isUse: 0,
                    genreName: "观象、通信及照明器材类"
                },
                {
                    percentage: 0,
                    canUse: 0,
                    isUse: 0,
                    genreName: "生活保障物资类"
                },
                {
                    percentage: 0,
                    canUse: 0,
                    isUse: 0,
                    genreName: "抢险救援装备类"
                },
                {
                    percentage: 45,
                    canUse: 0,
                    isUse: 0,
                    genreName: "其他装备物资类"
                }],
                totalCanUse: 0,
                totalIsUse: 0,
                loading: false, // 手持机同步等待
                showCircular: true, // 个数超过8个则不显示
            }
        },
        methods: {
            getAllData() {
                findAllData().then(res => {
                    let result = JSON.parse(JSON.stringify(res)), list = [], isUse = 0, canUse = 0, length = 0;
                    this.topRemindList[0].count = result.needChargeNum
                    this.topRemindList[1].count = result.needKeepNum
                    this.topRemindList[2].count = result.needReceiveNum
                    this.topRemindList[3].count = result.needScrapNum
                    result.workDataDtoList.forEach(item => {
                        let molecule = item.isUse, denominator = item.isUse + item.canUse, percentage = 0;
                        isUse += item.isUse
                        canUse += item.canUse
                        if(molecule.item == 0 || denominator == 0) {
                            percentage = 0
                        } else {
                            percentage = (molecule/denominator*100).toFixed(2)
                        }
                        list.push(Object.assign(item, {percentage: Number(percentage)}))
                    })
                    //当个数超过8个，需要换行显示。添加 i 标签，解决flex:justify-content: space-around;最后一行不能左对齐问题
                    // length = list.length
                    // if(length > 8) {
                    //     this.showCircular = false; // 不显示进度图形
                    //     for(let i = 1; i< 8; i++) {
                    //         this.$refs.inventory.appendChild(document.createElement('i'))
                    //     }
                    // }
                    this.inventoryList = list
                    this.totalIsUse = isUse
                    this.totalCanUse = canUse
                })
            },
            syncHandheld() {
                findEquipsNeedChange().then(res => {
                    writeFile(res, cbData => {
                        this.loading = false
                        if(cbData.state) {
                            this.$message.success(cbData.message)
                        } else {
                            this.$message.error(cbData.message)
                        }
                    })
                }).catch(err => {
                    this.loading = false
                    this.$message.error(err.response.message)
                })
            },
            toOther(key) {
                switch (key) {
                    case 'CHARGE':
                        this.$router.push({name: 'charging'})
                        break;
                    case 'KEEP':
                        this.$router.push({name: 'maintenance'})
                        break;
                    case 'NOT_RETURN':
                        this.$router.push({name: 'warehouse/noreturn'})
                        break;
                    case 'SCRAP':
                        this.$router.push({name: 'warehouse/expired'})
                        break;
                    case 'SYNC':
                        this.loading = true
                        this.syncHandheld()
                        break;
                    default:
                        break;
                }
            }
        },
        components: {
            progressCircular
        },
        created() {
            this.getAllData()
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
        font-size: 16px;
        font-family:PingFang SC;

        .el-card {
            border: none !important;
        }

        .topRemind {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .remind-box {
                width: 1.4167rem;
                height: 0.776rem;
                box-shadow:0px 0px 12px rgba(235,238,245,1);
                text-align: center;
                padding-top: 0.0781rem;
                border-radius:10px;
                cursor: pointer;
                .count {
                    font-size:0.3229rem;
                    font-weight:bold;
                    color:rgba(47,47,118,0.75);
                }
                .tag {
                    font-size:0.125rem;
                    color: #C0C4CC;
                }
                .only-tag {
                    font-size: 0.1563rem;
                    color: #2F2F76;
                    margin-top: 0.2083rem;
                }
            }
        }

        .to-do {
            box-shadow:0px 0px 12px rgba(235,238,245,1);
            border-radius:10px;
            padding: 0.0521rem;
            .title {
                font-size: 20px;
                color: #707070;
                border-bottom: 2px solid #F0F0F0;
                padding-bottom: 0.0625rem;
            }
            .event-list::-webkit-scrollbar {
                width: 6px;
            }
            .event-list::-webkit-scrollbar-thumb {
                background: rgba(47,47,118,0.37);
                border-radius: 20px;
             }
            .event-list {
                margin-top: 0.0781rem;
                width: 100%;
                height: 1.4063rem;
                max-height: 1.4063rem;
                overflow-x: hidden;
                overflow-y: auto;
                .event-box {
                    display: flex;
                    justify-content: space-between;
                    height: 30px;
                    font-size: 18px;
                    color: #707070;
                    padding-right: 16px;
                    margin-bottom: 10px;
                }
            }
        }

        .inventory-statistics {
            box-shadow:0px 0px 12px rgba(235,238,245,1);
            border-radius: 10px;
            padding: 0.0521rem;
            .header {
                display: flex;
                justify-content: space-between;
                .title {
                    font-size: 20px;
                    color: #707070;
                }
                .sum-info {
                    width: 2.0833rem;
                    display: flex;
                    justify-content: space-between;
                    margin: 0.1042rem 0;
                    .info-box {
                        display: grid;
                        color: rgba(77, 79, 92, 1);
                        text-align: center;
                        .num {
                            font-size:0.1302rem;
                            font-weight:bold;
                            color: #4D4F5C;
                        }
                        .tag {
                            font-size: 0.0833rem;
                        }
                    }
                    .svg-icon {
                        width: 0.5833rem;
                        height: 0.2083rem;
                    }
                }
            }
           
           .body {
               display: flex;
               justify-content: space-around;
               flex-wrap: wrap;
               .item {
                   width: 1.1979rem;
                    .inside {
                        font-size: 0.1146rem;
                        display: grid;
                        color: rgba(77, 79, 92, 1);
                        text-align: center;
                    }
                    .other-info {
                        .info {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-top: 0.0625rem;
                            .icon-white {
                                width: 0.0521rem;
                                height: 0.0521rem;
                                border-radius: 50%;
                                background: rgba(232, 234, 239, 1);
                            }
                            .icon-blue {
                                width: 0.0521rem;
                                height: 0.0521rem;
                                border-radius: 50%;
                                background: rgba(59, 134, 255, 1);
                            }
                            .tip {
                                margin-left: 0.0521rem;
                            }
                        }
                    }
                    .item-type {
                        margin-top: 0.0625rem;
                        text-align: center;
                    }
                }
                i { // 补位元素
                    width: 1.1979rem;
                }
            }
        }
    }
        
</style>


