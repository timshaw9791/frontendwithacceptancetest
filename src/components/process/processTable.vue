<template>
    <div>
        <el-table :data="equipArgList" fit class="dialogList" height="360">
            <el-table-column label="装备名称" align="center" >
                <template scope="scope">
                    <el-select v-model="scope.row.equipArg.name" value-key="id" @change="changeModel(scope.row.equipArg.name)">
                        <el-option
                                v-for="item in nameList"
                                :label="item"
                                :value="item"
                                :key="item">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <!--<el-table-column label="装备型号" align="center" >-->
                <!--<template scope="scope">-->
                    <!--<el-select v-model="scope.row.equipArg.model" value-key="id" @change="qaq(scope,$event,title)">-->
                        <!--<el-option-->
                                <!--v-for="item in modelList"-->
                                <!--:key="item.id"-->
                                <!--:label="item.model"-->
                                <!--:value="item">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "processTable",
        props:{
            equipArgList:{
                type:Array,
                default(){
                    return []
                }
            }
        }
    }
</script>

<style scoped>

</style>