<template>
    <div class="task-history-container">
        <b style="color: #3F5FE0; font-size:19px;">审批流程</b>
        <div style="height: 150px; font-size: 17px;overflow: auto;margin: 0 20px">
            <div class="task-list" v-for="(item, i) in processList" :key="i">
                <div>{{item.name}}</div>
                <div>{{ item.assigneeName }}</div>
                <div>
                    <div style="float: left">{{ item.state }}</div>
                    <div class="checkReason" v-show="item.state==='驳回'" @click="handleReason(item.note)">[查看驳回原因]</div>
                </div>
                <div v-if="item.time">操作时间&#8195;{{item.time}}</div>
            </div>
        </div>
        <service-dialog title="驳回" ref="ratify" :button="false" width="300px"
                        @confirm="$refs.ratify.hide()" :secondary="false">
            <define-input label="驳回原因" v-model="reason" :disabled="true"></define-input>
        </service-dialog>
    </div>
</template>

<script>
    import serviceDialog from "@/components/base/serviceDialog"
    import textInput from '@/componentized/textBox/textInput'

    export default {
        name: 'taskHistory',
        data() {
            return {
                processList: [],
                reason: ""
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
                this.processList = this.list.map((obj) => {
                    if (obj.endTime !== null) {
                        if (obj.taskVariables.pass === undefined || obj.taskVariables.pass) {
                            obj.state = "通过";
                        } else {
                            obj.state = "驳回";
                            obj.note = obj.taskVariables.note;
                        }
                    } else {
                        obj.state = ''
                    }
                    obj.time = this.$filterTime(obj.endTime)
                    return obj
                })
            },
            handleReason(note) {
                this.reason = note;
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

    .task-history-container {
        margin-top: 10px;
    }

    .task-list {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
        font-size: 17px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        overflow: hidden;
    }

    .checkReason {
        color: #3F5FE0;
        cursor: pointer;
    }

</style>