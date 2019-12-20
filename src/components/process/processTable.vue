<template>
    <div class="process-table-box">
        <el-table :data="equipArgList" fit  height="2.421875rem" v-if="processType!=='scrap'">
            <el-table-column label="装备名称" align="left">
                <template scope="scope">
                    <div class="table-row-item">
                        <el-select v-model="scope.row.equipArg" value-key="id"
                                   @change="changeModel(scope.row)">
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
                        <el-select v-model="scope.row.equip.model" value-key="id" @change="selectModel(scope.row)">
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
                        <el-input v-model="scope.row.equip.count" @blur="changeCount(scope,$event)"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label=" " align="left">
                <template scope="scope">
                    <div class="table-row-item-button-box">
                        <el-button class="table-row-item-button" type="danger" @click="delEquip(scope)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>



        <el-table :data="equipArgList" fit height="2.421875rem" v-if="processType==='scrap'">
            <el-table-column prop="rfid" label="RFID"  align="left"></el-table-column>
            <el-table-column prop="serial" label="装备序号"  align="left"></el-table-column>
            <el-table-column prop="equipArg.name" label="装备名称"  align="left"></el-table-column>
            <el-table-column prop="equipArg.model" label="装备型号"  align="left"></el-table-column>
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
                value:'',
                nowRow:{}
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
                    return [{equipArg: {},equip:{}}]
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
            addRow() {
                if (this.nowRow.$index === this.equipArgList.length - 1) {
                    this.equipArgList.push({equipArg: {},equip:{}});
                }
            },
            delEquip(data){
                if (this.equipArgList.length > 1) {
                    this.equipArgList.splice(data.$index, 1);
                } else {
                    this.$message.error('不能删除最后一个');
                }
            },
            changeModel(row){
                this.$set(row.equip,'name',row.equipArg.name);
                this.$set(row.equip,'model',row.equipArg.equipArgModels[0].model);
            },
            selectModel(row){
                this.$set(row.equip,'model',row.equip.model);
            },
            changeCount(row, event){
                let count=row.row.equip.count;
                if(row.row.equip.count!==''){
                    if(Number(count)===0){
                        this.$message.error('装备数量不能为零')
                    }else {
                        this.nowRow = row;
                        this.addRow();
                    }
                }
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