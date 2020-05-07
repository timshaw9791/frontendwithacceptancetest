<template>
    <div class="overview" v-loading="loading" element-loading-text="正在导入中...">
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
                        <div>{{ event.processInstanceName }}</div>
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
                        <div>领用总数</div>
                        <div class="num">{{ totalIsUse }}</div>
                        <div class="temp"></div>
                        <div>可用总数</div>
                        <div class="num">{{ totalCanUse }}</div>
                    </div>
                </div>
                <!-- 表格类 -->
                <div class="body">
                    <div class="body-left">
                        <div class="header-type">装备大类</div>
                        <div class="header-num">领用数量</div>
                        <div class="header-num">可用数量</div>
                    </div>
                    <div class="body-right">
                        <div class="item" v-for="(item, i) in inventoryList" :key="i">
                            <div class="header-type">{{ item.name }}</div>
                            <div class="header-num">{{ item.isUse }}</div>
                            <div class="header-num">{{ item.canUse }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>


<script>
    import progressCircular from 'components/base/progressCircular'
    import { findAllData, findEquipsNeedChange, findByOneLine } from 'api/overview'
    import { writeFile } from "common/js/rfidReader"
    import { todoProcess } from 'api/process'
    
    export default {
        data() {
            return {
                topRemindList: [
                {count: 0,key: 'CHARGE',tag: "充电提醒"},
                {count: 0,key: 'KEEP',tag: "保养提醒"},
                {count: 0,key: 'NOT_RETURN',tag: "未归还提醒"},
                {count: 0,key: 'SCRAP',tag: "到期报废提醒"},
                { key: 'SYNC',tag: "导入手持机"}
                ],
                toDoList: [],
                inventoryList: [],
                totalCanUse: 0,
                totalIsUse: 0,
                loading: false,
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
                        isUse += item.isUse
                        canUse += item.canUse
                        list.push(item)
                    })
                    //当个数超过7个，需要换行显示。添加 i 标签，解决flex:justify-content: space-around;最后一行不能左对齐问题
                    // length = list.length
                    // if(length > 7) {
                    //     this.showCircular = false; // 不显示进度图形
                    //     for(let i = 1; i< 8; i++) {
                    //         this.$refs.inventory.appendChild(document.createElement('i'))
                    //     }
                    // }
                    this.inventoryList = list
                    this.totalIsUse = isUse
                    this.totalCanUse = canUse
                }).catch(err => {
                    this.$message.error("请求超时")
                })
            },
            getToDoTasks() {
                todoProcess({assignee: JSON.parse(localStorage.getItem('user')).id}).then(res => {
                    this.toDoList = res.content.map(item => Object.assign({}, item, {time: this.$filterTime(item.createTime)}))
                })
            },
            syncHandheld() {
                function handheld(data, filename, cb) {
                    return new Promise((reslove, reject) => {
                        writeFile(data, cbData => {
                            if(cbData.state) {
                                reslove("导入成功")
                            } else {
                                reject(cbData.message)
                            }
                        }, filename)
                    })
                }
                Promise.all([findEquipsNeedChange(), findByOneLine()]).then(res => {
                    Promise.all([handheld(res[0], "statisticsEquip.json"), handheld(res[1], "allEquip.json")]).then(state => {
                        this.loading = false
                        this.$message.success(typeof state == 'object'?state[0]:state)
                    }).catch(err => {
                        console.log(err);
                        this.loading = false
                        this.$message.error(err)
                    })
                }).catch(err => {
                    this.loading = false;
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
            this.getToDoTasks()
        },
    }
</script>

<style lang="scss">
    @import '~common/css/Adaptive';
    .el-message {
        font-size: 0.0833rem;
    }
</style>

<style lang="scss" scoped>
    .app-main {
        box-shadow: none !important;
    }

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
                height: 1.2656rem;
                max-height: 1.2656rem;
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
                    display: flex;
                    font-size:14px;
                    align-items: center;
                    justify-content: space-between;
                    margin: 0 0 10px 0;
                    .num {
                        margin: 0 10px;
                        font-size: 25px;
                        font-weight: bold;
                    }
                    .temp {
                        width: 10px;
                    }
                }
            }

            // 表格类
            .body {
                height: 300px;
                border-top: 1px solid #F0F0F0;
                border-left: 1px solid #F0F0F0;
                .body-left {
                    width: 10%;
                    float: left;
                    font-size:16px;
                    font-weight:800;
                    color: #4D4F5C;
                    display: grid;
                    grid-template-rows: 130px 85px 85px;
                    .header-type {
                        border-right: 1px solid #F0F0F0;
                        border-bottom: 1px solid #F0F0F0;
                        text-align: center;
                        line-height: 130px;
                    }
                    .header-num {
                        text-align: center;
                        line-height: 85px;
                        border-right: 1px solid #F0F0F0;
                        border-bottom: 1px solid #F0F0F0;
                    }
                }
                .body-right::-webkit-scrollbar {
                    height: 10px;
                }
                .body-right::-webkit-scrollbar-thumb {
                    background: rgba(47,47,118,0.30);
                    border-radius: 20px;
                }
                .body-right {
                    width: 90%;
                    max-width: 90%;
                    overflow-x: scroll;
                    overflow-y: hidden;
                    float: left;
                    display: flex;
                    color: #4D4F5C;
                    justify-content: flex-start;
                    .item {
                        width: 100%;
                        min-width: 141px;
                        display: grid;
                        grid-template-rows: 130px 85px 85px;
                        .header-type {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-right: 1px solid #F0F0F0;
                            border-bottom: 1px solid #F0F0F0;
                            padding: 0 13px;
                            font-weight: 500;
                        }
                        .header-num {
                            text-align: center;
                            line-height: 85px;
                            border-right: 1px solid #F0F0F0;
                            border-bottom: 1px solid #F0F0F0;
                        }
                    }
                }
            }   
        }
    }
        
</style>


