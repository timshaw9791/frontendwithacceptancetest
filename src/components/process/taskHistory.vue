<template>
    <div class="process-infos-container">
        <div class="title">审批流程</div>
        <div class="process-infos-body">
            <div class="info" v-for="(item, i) in processList" :key="i">
                <div>{{ item.name }}</div>
                <div>{{ item.assigneeName }}</div>
                <div>{{ item.state }}</div>
                <div class="reason">
                    <span v-show="item.state=='驳回'" @click="lookReson(item.note)">[查看驳回原因]</span>
                </div>
                <div>操作时间</div>
                <div>{{ item.time }}</div>
            </div>
        </div>
        <service-dialog  title="驳回" ref="ratify" :button="false" @confirm="$refs.ratify.hide()" :secondary="false">
            <define-input label="驳回原因" v-model="reson" width="100%" :disabled="true"></define-input>
        </service-dialog>
    </div>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog"
    import textInput from '@/componentized/textBox/textInput'

    export default {
        name: 'taskHistory',
        data() {
            return {
                processList: [],
                reson: ""
            }
        },
        props: {
            list: {
                type: Array,
                default() {
                    return []
                },
                require: true
            },
            height: {
                type: [String, Number],
                default: 0
            }
        },
        watch: {
            list: {
                handler() {
                    this.fixList();
                },
                deep: true
            }
        },
        methods: {
            fixList() {
                console.log('----')
                console.log(this.list)
                this.processList = this.list.map((obj) => {
                    let state = "", note = "";
                    switch (obj.taskVariables.pass) {
                        case undefined:
                            state = "";
                            break;
                        case true:
                            state = "通过";
                            break;
                        case false:
                            state = "驳回";
                            note = obj.taskVariables.note;
                    }
                    return {
                        name: obj.name,
                        assigneeName: obj.assigneeName,
                        state: obj.name.includes('申请') || (obj.name.includes('出库') && !!obj.endTime)|| (obj.name.includes('入库') && !!obj.endTime) ? "通过" : state,
                        note,
                        time: this.$filterTime(obj.endTime)
                    };
                })
            },
            lookReson(note) {
                this.reson = note;
                this.$refs.ratify.show();
            }
        },
        components: {
            serviceDialog,
            textInput
        }
    }
</script>

<style lang="scss" scoped>
    .process-infos-container {
        font-size: 16px;
    }

    .title {
        color: #3F5FE0;
        padding-bottom: 19px;
    }

    .process-infos-body {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(144, 147, 153, 0.1);
            border-radius: 20px;
        }
    }

    .info {
        display: grid;
        grid-template-columns: 10% 40% 10% 10% 10% 20%;
        line-height: 30px;
        padding: 10px 0;
        border-top: 1px solid rgba(112, 112, 112, 0.13);

        .reason {
            color: #3F5FE0;
            cursor: pointer;
        }

    }
</style>