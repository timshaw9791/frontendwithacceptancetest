<template>
    <div>
        <div class="tabs">
            <!--<div class="left-tab">-->
            <!--<div @click="getIndex('未读消息')" :class="{visited:listJson.readed===false}">未读消息</div>-->
            <!--<div @click="getIndex('已读消息')" :class="{visited:listJson.readed===true}">已读消息</div>-->
            <!--</div>-->
            <div class="ulList">
                <div v-for="(item,index) in list" :key="index" @click="ulClick(item,index)"
                     :class="{divColor:contentTrue===index,unread:!item.readed}">
                    {{item.title}}
                    <span>{{conversion(item.readed)}}</span>
                </div>
            </div>

            <!--<el-tabs tab-position="left" class="left-1" @tab-click="getIndex">-->
            <!--<el-tab-pane label="未读消息">-->
            <!--<div class="ulList">-->
            <!--<div v-for="(item,index) in list" :key="index" @click="ulClick(item,index)"-->
            <!--:class="{divColor:contentTrue===index}">{{item.title}}-->
            <!--</div>-->
            <!--<span v-if="list.length===0">暂无</span>-->
            <!--</div>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="已读消息" @tab-click="getIndex">-->
            <!--<div class="ulList">-->
            <!--<div v-for="(item,index) in list" :key="index" @click="ulClick(item,index)"-->
            <!--:class="{divColor:contentTrue===index}">{{item.title}}-->
            <!--</div>-->
            <!--<span v-if="list.length===0">暂无</span>-->
            <!--</div>-->
            <!--</el-tab-pane>-->
            <!--</el-tabs>-->

            <transition name="el-fade-in-linear">
                <div class="contents" v-if="content">
                    <h2 class="title">{{content.title}}</h2>
                    <h4>{{content.time}}</h4>
                    <div v-html="content.content"></div>
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
    import {formatTime} from "common/js/validate";


    export default {
        data() {
            return {
                list: [],
                listJson: {
                    id: JSON.parse(localStorage.getItem('user')).id,
                },
                content: null,
                contentTrue: null
            }
        },
        mixins: [formRulesMixin],

        methods: {
            getList() {
                this.gqlQuery(api.getMessageList,
                    this.listJson, (res) => {
                        console.log(res.data.MessageList.content);
                        this.list = JSON.parse(JSON.stringify(res.data.MessageList.content));
                    });
            },
            // getIndex(data) {
            //     this.content = null;
            //     this.contentTrue = null;
            //     if (data === '未读消息') {
            //         this.$set(this.listJson, "readed", false);
            //         this.getList();
            //     } else if (data === '已读消息') {
            //         this.$set(this.listJson, "readed", true);
            //         this.getList();
            //     }
            // },
            read(id) {
                console.log(id);
                this.gqlMutate(api.houseUser_readMessage,
                    {
                        messageId: id
                    }, (res) => {
                        this.list = [];
                        this.getList();
                    });
            },
            ulClick(data, index) {
                // this.content = null;
                // this.contentTrue = null;
                if (data.time.toString().length === 13) {
                    data.time = formatTime(data.time);
                }
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
        },

        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>

    .tabs {
        display: flex;
        height: 84vh;

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

        .ulList {
            overflow-y: scroll;
            min-width: 15vw;
            max-width: 15vw;

            div {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 8px 16px 16px 16px;
                line-height: 20px;
                margin-bottom: 8px;
                cursor: pointer;
                border-bottom: 1px solid rgb(228, 231, 237);

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
            width: 2px;
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
            background: rgba(#2f2f76,0.37)
        }

        .contents {
            margin: 0 3%;
            width: 100%;

            .title {
                text-align: center;
            }

            h4 {
                text-align: right;
            }

            .bottom {
                text-align: center;
                margin-top: 5vh;
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