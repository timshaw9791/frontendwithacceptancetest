<template>
    <div>
        <div class="msgContents">
            <div>
                <div class="top">
                    <tb-select :options="options" indexDefault="全部" style="margin-left: 1vw"
                               @selected="selected"></tb-select>

                    <div class="_buttonsLeft" style="margin-left: 1vw">
                        <BosInput
                                placeholder="装备/序号/编号/AB面"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:13vw;">
                        </BosInput>
                    </div>
                </div>
                <div class="ulList" ref="ulList" :v-loading="true">
                    <div v-for="(item,index) in list" :key="index" @click="ulClick(item,index)" class="megDiv"
                         :class="{divColor:contentTrue===index,unread:!item.readed}">
                        {{item.title}}
                        <span>{{formatTime(item.time)}} {{conversion(item.readed)}}</span>
                    </div>
                </div>
                <div class="msgBottom">
                    消息只保存三个月，请及时查看
                </div>
            </div>


            <transition name="el-fade-in-linear">
                <div class="contents" v-if="content">
                    <div class="title">
                        <h2>{{content.title}}</h2>
                        <h4>推送时间 : {{formatTime(content.time)}}</h4>
                    </div>
                    <div v-html="content.content" class="msgText"></div>
                </div>
                <div class="mes" v-if="!content">
                    <img src="@/common/images/消息空白.png"/>
                    <div>我是消息盒子,主人需要看点什么吗?</div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import api from 'gql/msg.gql'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import tabs from 'components/base/tabs/index'
    import {transformMixin} from 'common/js/transformMixin'
    import tbSelect from 'components/base/tabs-select'

    export default {
        data() {
            return {
                list: [],
                userId: JSON.parse(localStorage.getItem('user')).id,
                content: null,
                contentTrue: null,
                inquire: '',
                oldScrollTop: '',
                options: [
                    {label: '全部', value: '全部'},
                    {label: '报废', value: 'EQUIP_SCRAP_MESSAGE'},
                    {label: '充电', value: 'CHARGE_REMIND'},
                    {label: '保养', value: 'MAINTAIN_REMIND'},
                    {label: '未归还', value: 'LONG_TIME_NOT_RETURN'},
                    {label: '过保', value: 'PERIOD_EXCEED_SHELF_LIFE'},
                    {label: '安全库存', value: 'SAFE_SOCK_REMIND'},
                ],
                qfilter: {},
            }
        },
        mixins: [formRulesMixin, transformMixin],
        components: {
            tabs,
            tbSelect
        },

        computed: {
            isOpened() {
                return this.$store.state.socket.message;
            },
        },


        methods: {
            getList() {
                console.log(this.$store.state.socket.message);

                this.gqlQuery(api.getMessageList,
                    {qfilter: this.qfilter}, (res) => {
                        console.log(res.data.MessageList.content);
                        this.list = JSON.parse(JSON.stringify(res.data.MessageList.content));
                        if (this.oldScrollTop) {
                            this.$nextTick(() => {
                                this.$refs.ulList.scrollTop = this.oldScrollTop;
                            });
                        }
                    });
            },

            read(id) {
                console.log(id);
                this.oldScrollTop = this.$refs.ulList.scrollTop;
                this.gqlMutate(api.houseUser_readMessage,
                    {
                        messageId: id
                    }, (res) => {
                        this.list = [];
                        this.getList();
                    });
            },
            ulClick(data, index) {
                console.log(this.$refs.ulList.scrollTop);
                if (!data.readed) {
                    this.read(data.id);
                }
                this.content = data;
                this.contentTrue = index;
            },
            conversion(data) {
                if (data) {
                    return '已读'
                } else {
                    return '未读'
                }
            },
            selected(data) {
                console.log(data);
                if (data === '全部') {
                    this.qfilter = {
                        key: "userId",
                        operator: 'EQUEAL',
                        value: this.userId
                    }
                } else {
                    this.qfilter = {
                        "combinator": 'AND',
                        "key": "userId",
                        "operator": 'EQUEAL',
                        "value": this.userId,
                        "next": {
                            "key": "type",
                            "operator": "EQUEAL",
                            "value": data,
                            "combinator": "OR"
                        }
                    };
                }
                this.getList();
            },
        },
        watch: {
            isOpened(newer, older) {
                if (newer) {
                    this.getList();
                }
            },

            // 'this.$store.state.socket.message': {
            //     handler(newer, older) {
            //         console.log(newer);
            //         console.log(older);
            //         if (newer) {
            //             this.qfilter = {
            //                 combinator: 'AND',
            //                 key: "userId",
            //                 operator: 'LIKE',
            //                 value: this.userId,
            //             };
            //             this.getList();
            //         }
            //     },
            //     deep: true // 开启深度监听
            // }
        },


    }
</script>

<style lang="scss" scoped>


    .msgContents {
        display: flex;
        height: 82vh;

        .top {
            display: flex;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid rgb(228, 231, 237);
        }

        .left-tab {
            border-right: 2px solid rgb(228, 231, 237);
            padding-right: 1%;

            div {
                height: 36px;
                margin-bottom: 15px;
                cursor: pointer;
                line-height: 36px;
                margin-right: 2%;
                width: 6vw;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            div:hover {
                background: rgb(47, 47, 118);
                color: white;
                border-radius: 20px;
            }

            .visited {
                background: rgb(47, 47, 118);
                color: white;
                border-radius: 20px;
            }

        }

        .msgBottom {
            width: 100%;
            border-bottom: white;
            position: absolute;
            bottom: 0;
            min-width: 23vw;
            font-size: 14px;
            color: rgba(185, 185, 185, 1);
            margin-left: 16px;
            background: white;
        }

        .ulList {
            min-width: 23vw;
            max-width: 23vw;
            height: 72vh;
            overflow-y: scroll;
            position: relative;

            .megDiv {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 16px;
                line-height: 20px;
                cursor: pointer;

                span {
                    display: flex;
                    flex-direction: row-reverse;
                    color: rgb(195, 195, 195);
                    margin-top: 10px;
                }
            }

            div:hover {
                color: #409EFF;
            }

            .divColor {
                color: #409EFF;
                background: rgb(249, 249, 249);
            }

            .unread {
                font-weight: 600 !important;
            }

        }

        .ulList::-webkit-scrollbar {
            width: 4px;
            height: 10px;
        }

        .ulList::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: rgba(228, 231, 237, 0.1);
        }

        .ulList::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(#2f2f76, 0.37)
        }


        .contents {
            margin: 0 3% 0 0;
            width: 100%;

            .title {
                border-bottom: 1px solid rgb(228, 231, 237);
                color: rgba(112, 112, 112, 1);

                h2 {
                    margin-left: 28px;
                }

                h4 {
                    letter-spacing: 2px;
                    text-align: right;
                }
            }

            .msgText {
                padding: 40px 0 0 28px;

            }
        }

        .mes {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            img {
                width: 120px;
                height: 120px;
            }

            div {
                margin-top: 5vh;
                font-size: 18px;
                color: rgb(195, 195, 195);
            }
        }
    }

</style>