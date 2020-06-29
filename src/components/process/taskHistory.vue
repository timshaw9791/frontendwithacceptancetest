<template>
    <div class="task-history-container">
        <div class="title">审批流程</div>
        <div class="info" v-for="(item, i) in processList" :key="i">
            <div>{{item.name}}</div>
            <div>{{ item.assigneeName }}</div>
            <div>
                <div>{{ item.state }}</div>
                <div class="checkReason" v-show="item.state==='驳回'" @click="handleReason(item.note)">[查看驳回原因]</div>
            </div>
            <div>操作时间{{item.time}}</div>
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
                    if (!obj.taskVariables.pass) {
                        obj.state = "驳回";
                        obj.note = obj.taskVariables.note;
                    } else {
                        obj.state = "通过";
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

    .title {
        color: #3F5FE0;
        font-size: 19px;
    }

    .info {
        display: grid;
        grid-template-columns: 20% 20% 40% 20%;
    }

    .checkReason {
        float: right;
        color: #3F5FE0;
        cursor: pointer;
    }

</style>