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
                <el-table :data="list" :highlight-current-row="false" border>
                    <define-column label="第一列" v-slot="{ data }">
                        <!-- <el-input  v-model="data.name"></el-input> -->
                        <entity-input v-model="data.name" :tableEdit="edit"></entity-input>
                    </define-column>
                    <define-column label="第二列" v-slot="{ data }">
                        <text-input v-model="data.age" type="Number" :tableEdit="edit"></text-input>
                    </define-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput.vue'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import entityInput from '@/componentized/entity/entityInput'
    
    import defineTable from '@/componentized/entity/defineTable'
    import defineColumn from '@/componentized/entity/defineColumn'

    import { processDefinitions } from 'api/process'
    export default {
        name: "myProcessNew",
        data(){
            return{
                requestTitle: "",
                select: {
                    processList: [],
                    selected: "", // 选择结果
                },
                list: [{
                    name: '123',
                    age: '10'
                },{
                    name: '456',
                    age: '11'
                },{
                    name: '789',
                    age: '12'
                }],
                edit: true
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
            defineTable,
            defineColumn,
            entityInput
        },
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-table {
        .el-table--enable-row-hover,
        .el-table__body tr:hover > td {
            background-color: white;
        }
    }
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