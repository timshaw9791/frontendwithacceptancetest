<template>
    <div class="overview">
        <el-card shadow="never" :body-style="{ padding:'30px'}">
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
                            <progress-circular :width="76" :strokeWidth="6"
                                               :percentage="item.percentage"
                                               color="#3B86FF">
                                <div class="inside">
                                    <span class="percentage">{{Math.round((item.outHouseCount/item.inHouseCount)*100)}}%</span>
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


                    <div class="bk-style" v-for="(item,index) in contentList" :key="index">
                        <div class="bk-top">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="bk-content">
                            <el-scrollbar wrap-class="scroll-bar">
                                <div class="scroll-bar">
                                    <el-table :data="item.list" fit @row-click="gotoInfo">
                                        <div v-if="index===0">
                                            <bos-table-column lable="编号" field="name"></bos-table-column>
                                            <bos-table-column lable="类型" field="name"></bos-table-column>
                                            <bos-table-column lable="状态" field="name"></bos-table-column>
                                        </div>
                                        <div v-if="index===1">
                                            <bos-table-column lable="倒计时"
                                                              :filter="(row)=>`${row.day}天`"></bos-table-column>

                                            <bos-table-column lable="类型" field="type"></bos-table-column>

                                            <bos-table-column lable="装备序号" field="equipSerial"></bos-table-column>

                                            <bos-table-column lable="名称" field="equipName"></bos-table-column>
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
                            <progress-circular :width="180" :strokeWidth="6" :percentage="100" color="#2F2F76">
                                <div class="inside ">
                                    <div>当前温度</div>
                                    <div>{{surroundings.temperature}}°</div>
                                    <div>相对湿度:{{surroundings.humidity}}%</div>
                                </div>
                            </progress-circular>
                        </div>
                    </div>

                    <div class="bk-style">
                        <div class="bk-top">
                            <span @click="gotoInfo('video')">视频监控</span>
                        </div>
                        <div class="bk-content">
                            <my-video :playerOptions="playerOptions" @click="console.log('awsl')"></my-video>
                        </div>
                    </div>

                </div>
            </div>
        </el-card>
    </div>
</template>


<script>
    import progressCircular from 'components/base/progressCircular'
    import myVideo from 'components/videoPlayer/index'
    import {temperatureValue} from "api/surroundings";
    import {equipmentAmount, equipmentScrapped, equipmentCharging} from "api/statistics";
    import api from 'gql/home.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {formRulesMixin} from 'field/common/mixinComponent';


    export default {
        data() {
            return {
                list: [],
                playerOptions: {
                    live: true,
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    preload: 'auto', //视频预加载
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    muted: false, // 默认情况下将会消除任何音频。
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    techOrder: ['flash'],
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    // poster: "@/assets/logo.png", //你的封面地址
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true //全屏按钮
                    },
                    controls: true, //控制条
                    flash: {
                        hls: {
                            withCredentials: false
                        },
                    },
                    sources: [{
                        type: "rtmp/flv",
                        src: "rtmp://58.200.131.2:1935/livetv/hunantv",
                    }],
                },
                surroundings: {
                    temperature: 0,
                    humidity: 0,
                },
                topList: [],
                contentList: [1, 2, 3, 4],
            }
        },
        mixins: [formRulesMixin, transformMixin],
        methods: {
            getList() {
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

                // temperatureValue().then(res => {
                //     this.surroundings = res.data.data ? res.data.data : {};
                // }).catch(err => {
                //     console.log(err);
                // });

                equipmentAmount().then(res => {
                    res.genreStatisticList.forEach((item, index) => {
                        res.genreStatisticList[index]['percentage'] = Math.round((item.outHouseCount / item.inHouseCount) * 100);
                    });
                    this.topList = res;
                }).catch(err => {
                    console.log(err);

                });
                this.gqlQuery(api.getEquipList, {
                    "paginator": {
                        "page": 1,
                        "size": 20
                    },
                    "qfilter": {
                        "key": "receiveTime",
                        "operator": "GREATTHAN",
                        "value": "0",
                        "combinator": "AND",
                        "next": {
                            "key": "receiveTime",
                            "operator": "GREATTHAN",
                            "value": new Date - 1000 * 60 * 60 * 24 * 3
                        }
                    }
                }, (res) => {
                    this.contentList[3] = {
                        list: JSON.parse(JSON.stringify(res.data.EquipList.content)),
                        name: '未归还提醒',
                    };
                    this.contentList.push('');
                    this.contentList.pop();
                })

            },
            gotoInfo(row, route) {
                console.log(row);
                if (row.type === '充电') {
                    this.$router.push('/equipmentOperation/charging');
                } else if (row.type === '保养') {
                    this.$router.push('/equipmentOperation/maintenance');
                }
                if (row === 'surroundings') {
                    this.$router.push('/surroundings/index');
                }
                if (row === 'video') {
                    this.$router.push({path: '/surroundings/index', params: {name: 'video'}});
                }
                if (row === 'statistics') {
                    this.$router.push({path: '/report/index', params: {name: route}});
                }
            }
        },
        mounted() {
            this.getList();
        },
        components: {
            progressCircular,
            myVideo
        },

    }
</script>

<style lang="scss" scoped>
    .overview {
        .el-card {
            border: none !important;
        }

        .center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .ov-content {

            .statistics {
                padding: 0 1vw;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                display: flex;
                align-items: center;
                height: 148px;
                width: 100%;
                margin-bottom: 30px;
                flex-wrap: wrap;
                justify-content: space-around;

                .total {
                    font-size: 16px;
                    font-weight: bold;
                    color: rgba(77, 79, 92, 1);

                    div {
                        padding-bottom: 10px;
                    }

                    span {
                        margin-left: 14px;
                        font-size: 20px;
                    }
                }

                .ss-content {

                    .title {
                        text-align: center;
                        font-size: 18px;
                        color: rgba(77, 79, 92, 1);
                        margin-bottom: 8px;
                    }

                    .bulk {
                        display: flex;
                        justify-content: center;
                        align-items: center;

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
                            margin-left: 12px;
                            display: flex;
                            flex-direction: column;

                            .sort {
                                display: flex;
                                align-items: center;
                                margin-bottom: 4px;

                                .icon {
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 50%;

                                }

                                .icon-on {
                                    background: rgba(232, 234, 239, 1);
                                }

                                .icon-ok {
                                    background: rgba(59, 134, 255, 1);
                                }

                                .piece {
                                    margin-left: 10px;
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
                    width: 510px;
                    height: 321px;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                    margin-bottom: 30px;
                    color: rgba(112, 112, 112, 1);

                    .bk-top {
                        height: 42px;
                        border-left: 4px solid rgba(47, 47, 118, 0.75);
                        padding: 14px;
                        margin-bottom: 10px;

                        span {
                            font-size: 18px;

                        }
                    }

                    .bk-content {
                        padding: 0 30px;

                        .scroll-bar {
                            max-height: 250px;
                            min-height: 250px;
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
                                font-size: 16px;
                            }

                            div:nth-child(2) {
                                font-size: 55px;
                                margin-left: 18px;
                            }

                            div:last-child {
                                font-size: 14px;

                            }
                        }
                    }
                }
            }
        }

    }


</style>