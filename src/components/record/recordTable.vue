<template>
    <div class="recordTable">
        <el-table
                :data="tableData"
                style="width: 100%"
                :default-sort = "{prop: 'date', order: 'descending'}"
                @sort-change="change"
        >
            <div v-for="item in configure" :key="item.key">
               <el-table-column
                        :prop="item.prop"
                        :label="item.lable"
                        align="center"
                        :sortable="item.sortable?'custom':''"
                >
                </el-table-column>
            </div>
        </el-table>
        <!--<div  v-for="item in configure">
            <span v-text="item.lable"></span>
        </div>-->
    </div>
</template>

<script>
    export default {
        name: "recordTable",
        data(){
            return{
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                configure:[
                    {prop:'RFID',lable:'RFID',sortable:false,formatter:false,key:0},
                    {prop:'name',lable:'装备名称',sortable:false,formatter:false,key:1},
                    {prop:'number',lable:'装备序列',sortable:false,formatter:false,key:2},
                    {prop:'user',lable:'操作人员',sortable:false,formatter:false,key:3},
                    {prop:'timer',lable:'操作时间',sortable:true,formatter:false,key:4},
                    {prop:'status',lable:'操作状态',sortable:false,formatter:false,key:5}
                ]
            }
        },
        props:{
          table:{
              type:Object,
              default(){
                  return{
                      configure:[
                          {prop:'id',lable:'RFID',sortable:false,formatter:false},
                          {prop:'name',lable:'装备名称',sortable:false,formatter:false},
                          {prop:'number',lable:'装备序列',sortable:false,formatter:false},
                          {prop:'user',lable:'操作人员',sortable:false,formatter:false},
                          {prop:'timer',lable:'操作时间',sortable:true,formatter:false},
                          {prop:'status',lable:'操作状态',sortable:false,formatter:false}
                      ]
                  }
              }
          }
        },
        methods: {
            formatter(row, column) {
                return row.address;
            },
            change(data){
                console.log(data)
            }
        }
    }
</script>

<style scoped>
.recordTable{
    width: 100%;
}
</style>