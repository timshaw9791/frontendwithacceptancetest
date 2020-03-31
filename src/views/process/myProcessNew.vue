<template>
    <div class="my-process-container">
        <my-header title="我的流程" :haveBlack="false"></my-header>
        <div class="my-process" data-test="action_box">
            <div class="my-process-info">
                <text-input label="请求标题" v-model="requestTitle" :column="3"></text-input>
                <base-select label="流程类型" v-model="select.selected" :column="3" :selectList="select.processList"></base-select>
                <base-button label="查询"></base-button>
            </div>
            <div class="my-process-body">
                <div class="table">表格组件</div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput.vue'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import { processDefinitions } from 'api/process'
    export default {
        name: "myProcessNew",
        data(){
            return{
                requestTitle: "",
                select: {
                    processList: [],
                    selected: "", // 选择结果
                }
            }
        },
        methods:{
            getProcessDefinitions() {
                processDefinitions().then(res => {
                    this.select.processList = res.map(obj => ({label: obj.name, value: obj.name}));
                })
            }
        },
        created() {
            this.getProcessDefinitions();
        },
        components:{
            myHeader,
            textInput,
            baseSelect,
            baseButton,
        },
    }
</script>

<style lang="scss" scoped>
    .my-process-container{
        color:#707070FF;
        font-size: 16px;
        .my-process-info {
            padding: 16px 7px;
            overflow: hidden;
        }
        .my-process-body {
            padding: 0 17px;
            .table {
                height: 672px;
                border: 1px solid orange;
            }
        }
    }
</style>