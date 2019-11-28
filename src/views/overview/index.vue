<template>
    <div class="overview">
        <el-card shadow="never" :body-style="{ padding:'0.156rem'}">
            <div class="topRemind">
                <div class="remind-box" v-for="(item, i) in topRemindList" :key="i">
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
                            <div class="num">600</div>
                            <div class="tag">领用总数</div>
                        </div>
                        <svg-icon icon-class="领用总数" class="svg-icon"></svg-icon>
                        <div class="info-box">
                            <div class="num">600</div>
                            <div class="tag">可用总数</div>
                        </div>
                        <svg-icon icon-class="可用总数" class="svg-icon"></svg-icon>
                    </div>
                </div>
                <div class="body">
                    <div class="item" v-for="(item, i) in inventoryList" :key="i">
                        <progress-circular 
                            :width="108" 
                            :strokeWidth="8"
                            :percentage="item.percentage"
                            color="#3B86FF"
                            style="margin: 0 auto">
                            <div class="inside">
                                <span>{{ item.percentage }}%</span>
                                <span>领用</span>
                            </div>
                        </progress-circular>
                        <div class="other-info">
                            <div class="info">
                                <div class="icon-white"></div>
                                <div class="tip">可用数量 {{ item.available }}</div>
                            </div>
                            <div class="info">
                                <div class="icon-blue"></div>
                                <div class="tip">领用数量 {{ item.recive }}</div>
                            </div>
                        </div>
                        <div class="item-type">{{ item.type }}</div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>


<script>
    import progressCircular from 'components/base/progressCircular'
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
                    tag: "充电提醒"
                },{
                    count: 0,
                    tag: "保养提醒"
                },{
                    count: 0,
                    tag: "未归还提醒"
                },{
                    count: 0,
                    tag: "到期报废提醒"
                },{
                    tag: "同步手持机"
                }],
                toDoList: [{
                    name: "XXXXX流程申请-王小明",
                    time: "2019-11-30"
                },{
                    name: "XXXXX流程申请-王小明",
                    time: "2019-11-30"
                },{
                    name: "XXXXX流程申请-王小明",
                    time: "2019-11-30"
                },{
                    name: "XXXXX流程申请-王小明",
                    time: "2019-11-30"
                },{
                    name: "XXXXX流程申请-王小明",
                    time: "2019-11-30"
                },{
                    name: "XXXXX流程申请-王小明",
                    time: "2019-11-30"
                }],
                inventoryList: [{
                    percentage: 45,
                    available: 260,
                    recive: 143,
                    type: "警械类"
                },
                {
                    percentage: 45,
                    available: 260,
                    recive: 143,
                    type: "防护、防爆装备类"
                },
                {
                    percentage: 45,
                    available: 260,
                    recive: 143,
                    type: "观象、通信及照明器材类"
                },
                {
                    percentage: 45,
                    available: 260,
                    recive: 143,
                    type: "生活保障物资类"
                },
                {
                    percentage: 45,
                    available: 260,
                    recive: 143,
                    type: "抢险救援装备类"
                },
                {
                    percentage: 45,
                    available: 260,
                    recive: 143,
                    type: "其他装备物资类"
                }]
            }
        },
        
        methods: {
        },
        components: {
            progressCircular
        }
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
                font-size:0.125rem;
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
                height: 1.4583rem;
                max-height: 1.4583rem;
                overflow-x: hidden;
                overflow-y: auto;
                .event-box {
                    display: flex;
                    justify-content: space-between;
                    height: 0.1719rem;
                    font-size:0.125rem;
                    color: #707070;
                    padding-right: 16px;
                    margin-bottom: 0.0938rem;
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
                    font-size:0.125rem;
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
               .item {
                    .inside {
                        display: grid;
                        color: rgba(77, 79, 92, 1);
                        text-align: center;
                    }
                    .other-info {
                        margin-top: 0.0521rem;
                        .info {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-bottom: 0.0625rem;
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
                        text-align: center;
                    }
                }
            }
        }
    }
        
</style>


