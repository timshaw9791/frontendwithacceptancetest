<template>
    <div>
        <el-table
                :data="list"
                style="width: 100%;" id="field-table" @sort-change="sortChange" :height="height">
            <bos-table-column :align="align" v-for="item in labelList" :lable="item.lable" :width="item.width" :sort="item.sort" :field="item.field" :filter="item.filter"></bos-table-column>
            <el-table-column v-if="flag" :label="tableAction.label" :align="align">
                <template slot-scope="scope">
                    <el-button :type="item.type" v-show="judgeState(item.name, scope.row)" size="mini" class="actionButton" @click="someClick(scope.row,item.name)" v-for="item in tableAction.button" v-text="item.name" data-test="button"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <bos-paginator v-if="list!=''&&havePage"  :pageInfo="pageInfo" @bosCurrentPageChanged="tableChangePage"></bos-paginator>
    </div>
</template>

<script>
    export default {
        name: "field-table",
        data() {
            return {
                flag: false
            }
        },
        /*mixins: [formRulesMixin],*/
        props: {
            list: {
                type: Array
            },
            labelList: {
                type: Array,
                required: true
            },
            height:{
                type:String,
                default:'3.45rem'
            },
            /*defaultSort:{
              type:Object,
              default(){
                  return{
                      prop:'',
                      order:''
                  }
              }
            },*/
            align:{
              type:String,
              default:'center'
            },
            havePage:{
                type:Boolean,
                default:true
            },
            haveButton: {
                type: Boolean,
                default: false
            },
            tableAction:{
                type:Object
            },
            pageInfo:{
                type:Object
            },
            buttonState: { // 是否启用按钮 隐藏/显示
                type: Boolean,
                default: false
            }
        },
        created() {
            if(this.tableAction!=undefined){
                this.flag=true
            }
        },
        updated() {
        },
        mounted() {
        },
        methods: {
            someClick(row,name) {
                let data ={
                    name:name,
                    row:row
                };
                this.$emit('clickTableCloum',data)
            },
            sortChange(data){
                let obj = {
                    order:data.order,
                    name:data.column.label
                };
                this.$emit('sortChange',obj)
            },
            tableChangePage(newPage){
                this.$emit('tableCurrentPageChanged',newPage)
            },
            judgeState(name, row) {
                if(!this.buttonState) return true
                if(!name.includes('删除')) return true
                let nowTime = new Date().getTime();
                return (nowTime - row.updateTime)/1000/3600/24 > 1?false:true
            }
        }
    }
</script>

<style scoped>
    .actionButton{
        width:70px;
        height:32px;
        opacity:1;
        color: white;
        border-radius:4px;
    }
</style>