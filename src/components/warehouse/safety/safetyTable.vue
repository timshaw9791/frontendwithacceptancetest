<template>
    <div class="safety_table_box">
        <div v-if="table.tableType==='unallocated'" :class="distribution?'unallocated':''" >
            <el-table :data="table.tableData" height="3.78125rem" ref="unallocated"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" v-if="distribution" data-test="check_box"></el-table-column>
                <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                <bos-table-column lable="装备数量" field="count"></bos-table-column>
            </el-table>
        </div>
        <div v-if="table.tableType==='genre'" >
            <el-table :data="table.tableData" height="3.78125rem" ref="genre">
                <bos-table-column lable="装备小类" field="category.name"></bos-table-column>
                <bos-table-column lable="装备总数" field="count"></bos-table-column>
                <el-table-column label="安全库存">
                    <template slot-scope="scope">
                        <div>
                            <el-input
                                    v-model="scope.row.category.stock"
                                    :disabled="disable" style="width: 0.34375rem;">
                            </el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label=" ">
                    <template slot-scope="scope">
                        <div style="cursor: pointer;width: 0.2604rem" @click="deleteButton('category',scope.row)" data-test="减_icon">
                            <svg-icon icon-class="移除" class="icon-search"></svg-icon>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="table.tableType==='category'">
            <el-table :data="table.tableData" height="3.78125rem" ref="category">
                <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                <bos-table-column lable="装备数量" field="count"></bos-table-column>
                <el-table-column label=" ">
                    <template slot-scope="scope">
                        <div style="cursor: pointer;width: 0.2604rem" @click="deleteButton('equipArg',scope.row)" data-test="减_icon">
                            <svg-icon icon-class="移除" class="icon-search"></svg-icon>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <tips ref="deleteEquipArg" :contentText="'您确定要解除装备类别绑定吗'" @confirm="deleteEquipArgId"></tips>
        <tips ref="deleteCateage" :contentText="'您确定要删除此小类吗'" @confirm="deleteCateage"></tips>
    </div>
</template>
<script>
    import {deleteCategory,relateCategory} from "api/warehouse"
    import tips from "components/base/tips"

    export default {
        name: "safetyTable",
        components: {tips},
        data() {
            return {
                equipArg: {},
                deleteRow:{}
            }
        },
        props: {
            table: {
                type: Object
            },
            disable: {
                type: Boolean,
                default: true
            },
            distribution: {
                type: Boolean,
                default: false
            },
            currentNode:{
                type: Object
            }
        },
        methods: {
            handleSelectionChange(val) {
               this.table.checkBoxData=val;
            },
            deleteButton(type, row) {
                if (type === 'category') {
                    this.deleteRow=row;
                    this.$refs.deleteCateage.show();

                } else {
                    this.equipArg = row.equipArg;
                    this.$refs.deleteEquipArg.show();
                }
            },
            deleteCateage(){
                deleteCategory(this.deleteRow.category.id).then(res => {
                    this.$emit('updateCategory', {type:'delete', id:row.category.id});
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            },
            resultCheckBox(){
                this.$refs.unallocated.clearSelection();
            },
            deleteEquipArgId() {
                relateCategory({categoryId:this.currentNode.id,equipArgId:this.equipArg.id,flag:false}).then(res=>{
                    this.$emit('success', 'equipArg');
                    this.$refs.deleteEquipArg.hide();
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-table th.is-leaf, .el-table td {
        padding-left: 0.3021rem;
        border-bottom: 0.0052rem solid #EBEEF5;
    }
    /deep/ .el-table--enable-row-transition .el-table__body td {
        padding-left: 0.3021rem;
    }

    /deep/ .el-input__inner {
        text-align: center;

    }
    /deep/ .el-table-column--selection{
        margin-left: 1.0417rem;
    }
    .safety_table_box {
        width: 100%;
    }
    .unallocated{
        /deep/ .el-table th.is-leaf, .el-table td {
            padding-left: 0.0521rem;
            border-bottom: 0.0052rem solid #EBEEF5;
        }
        /deep/ .el-table--enable-row-transition .el-table__body td {
            padding-left: 0.0521rem;
        }
    }
</style>