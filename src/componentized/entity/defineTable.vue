<template>
    <div>
        <h1>这是表格</h1>
        <slot :text="{name: 'SprWu'}">abc</slot>
    </div>
</template>

<script>
import defineColumn from './defineColumn'
    export default {
        name: "field-table",
        data() {
            return {
                flag: false
            }
        },
        components: {
          defineColumn
        },
        /*mixins: [formRulesMixin],*/
        props: {
            list: {
                type: Array
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
            console.log(this.$scopedSlots);
            console.log('---------');
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