<template>
    <div style="width: 100%">
        <el-table
                :data="tableData"
                height="424"
                border
                style="width: 100%"
                :align="align"
        >
            <el-table-column
                    prop="number"
                    label="序号"
                    width="180"
                    :align="align"
             >
            </el-table-column>
            <el-table-column
                    prop="rfid"
                    label="RFID"
                    width="180"
                    :align="align"
             >
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="装备名称"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="装备型号"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="装备序号"
                    :align="align"
            >
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "inventoryTable",
        props:{
            tableData:{
                type:Array,
                default(){
                    return  [{
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-08',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-06',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-07',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }]
                }
            }
        },
        data(){
            return{
                align:'center'
            }
        }
    }
</script>

<style scoped>

</style>