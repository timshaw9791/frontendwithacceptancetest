<template>
    <div class="my-process-container">
        <my-header :title="title" :haveBlack="false"></my-header>
        <div class="my-process" data-test="action_box">
            <div class="my-process-info">
                <text-input label="请求标题" v-model="requestTitle"></text-input>
                <process-select v-model="select.selected" :selectList="select.processList"></process-select>
                <base-button name="查询"></base-button>
                <base-button name="申请报废" style="float:right" :width="96" @inClick="apply"></base-button>
            </div>
            <div class="my-process-body">
                <div class="table">表格组件</div>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import processSelect from '@/componentized/textBox/processSelect.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    export default {
        name: "myProcessNew",
        components:{
            myHeader,
            textInput,
            processSelect,
            baseButton,
        },
        data(){
            return{
                title: "我的流程",
                requestTitle: "",
                indexPage: true,
                select: {
                    processList: [{ // 选择列表
                        label: "报废流程",
                        value: "scrap"
                    },{
                        label: "直调流程",
                        value: "dirrect_allot"
                    },{
                        label: "调拨流程",
                        value: "transfer"
                    }],
                    selected: "", // 选择结果
                }
            }
        },
        methods:{
            apply() { // 申请流程
              this.$router.push({
                  name: 'processApply',
                  params: {'type': 'applyScrap', title: '我的流程/申请报废'}
              })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .my-process-container{
        width: 100%;
        color:#707070FF;
        font-size: 16px;
        border: 1px solid black;
        .my-process-info {
            width: 100%;
            padding: 16px 0.1198rem 16px 0.09375rem;
            overflow: hidden;
            .text-input-container {
                float: left;
            }
            .process-select-container {
                float: left;
                margin-left: 0.1615rem;
            }
            .base-button-container {
                margin-left: 16px;
            }
        }
        .my-process-body {
            padding: 0 0.1198rem 0 0.09375rem;
            .table {
                height: 672px;
                border: 1px solid orange;
            }
        }
    }
</style>