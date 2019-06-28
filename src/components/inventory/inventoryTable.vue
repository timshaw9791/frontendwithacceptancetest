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
                    label="序号"
                    type="index"
                    :index="indexMethod" width="180" :align="align">
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
                    prop="model"
                    label="装备型号"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="serial"
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
                type:Array
            }
        },
        data(){
            return{
                align:'center'
            }
        },
        methods:{
            indexMethod(index) {
                return index +1;
            }
        }
    }
</script>

<style scoped>

</style>