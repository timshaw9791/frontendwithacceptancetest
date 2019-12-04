<template>
    <div class="process-table-box">
        <el-table :data="equipArgList" fit  height="2.421875rem" v-if="processType!=='scrap'">
            <el-table-column label="装备名称" align="left">
                <template scope="scope">
                    <div class="table-row-item">
                        <el-select v-model="scope.row.equipArg" value-key="id"
                                   @change="changeModel(scope.row.equipArg.name)">
                            <el-option
                                    v-for="item in nameList"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                            </el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="装备型号" align="left">
                <template scope="scope">
                    <div class="table-row-item">
                        <el-select v-model="scope.row.equipArg.model" value-key="id">
                            <el-option
                                    v-for="item in scope.row.equipArg.equipArgModels"
                                    :key="item.id"
                                    :label="item.model"
                                    :value="item.model">
                            </el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="装备数量" align="left">
                <template scope="scope">
                    <div class="table-row-item">
                        <el-input v-model="scope.row.equipArg.count"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label=" " align="left">
                <template scope="scope">
                    <div class="table-row-item-button-box">
                        <el-button class="table-row-item-button" type="danger" >删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>



        <el-table :data="equipArgList" fit height="2.421875rem" v-if="processType==='scrap'">
            <el-table-column prop="rfid" label="RFID"  align="left"></el-table-column>
            <el-table-column prop="serial" label="装备序号"  align="left"></el-table-column>
            <el-table-column prop="name" label="装备名称"  align="left"></el-table-column>
            <el-table-column prop="model" label="装备型号"  align="left"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "processTable",
        data(){
            return{
                modelList:[],
                equipName:'',
                value:''
            }
        },
        props: {
            processType:{
                type:String,
                default:''
            },
            equipArgList: {
                type: Array,
                default() {
                    return [{equipArg: {},name:'',model:''}]
                }
            },
            nameList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        created(){
          console.log(this.nameList)
        },
        methods:{
            changeModel(name){
                console.log(name)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .process-table-box {
        width: 100%;
        border:1px solid rgba(220,223,230,1);
    }

    .process-table-box .table-row-item {
        width: 1.1458rem;
        /deep/ .el-input__inner {
            height: 0.1667rem;
        }
        /deep/ .el-input__icon {
            width: 0.1302rem;
            line-height: 0.1667rem;
        }
    }
    .process-table-box .table-row-item-button-box {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .table-row-item-button-box .table-row-item-button{
        height: 0.1667rem;
        line-height: 0rem;
    }
</style>