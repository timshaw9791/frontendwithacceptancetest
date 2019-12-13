<template>
    <div>
        <serviceDialog :title="lookUp.title" ref="lookUpService" width="6.6979rem"
                       :button="false">
            <div class="look-up">
                <div class="look-up-body">
                    <div class="look-up-header">
                        <span v-text="`入库单号：${lookUp.number}`"></span>
                        <span v-text="`操作人员：${lookUp.user}`"></span>
                        <span v-text="`入库时间：${filterTime()}`"></span>
                    </div>
                    <div class="look-up-table">
                        <span v-text="`装备统计：`"></span>
                        <el-table :data="lookUp.table" style="margin-top: 0.0417rem;border: 1px solid rgba(112, 112, 112, 0.13);" fit height="2.7552rem" min-height="2.7552rem" >
                            <el-table-column prop="name" label="装备名称"  align="left"></el-table-column>
                            <el-table-column prop="model" label="装备型号"  align="left"></el-table-column>
                            <el-table-column prop="count" label="装备数量"  align="left"></el-table-column>
                        </el-table>
                    </div>
                    <div class="look-up-bottom" v-if="lookUp.order!==undefined&&lookUp.order.note!==''">
                        <span v-text="`装备统计：${lookUp.order.note}`"></span>
                        <span style="margin-top: 0.0625rem;" v-text="`异常装备：${getErrorEquip()}`"></span>
                    </div>
                </div>

            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    export default {
        name: "lookUp",
        props:{
            lookUp:{
                type:Object
            }
        },
        components: {
            serviceDialog
        },
        methods: {
            getErrorEquip(){
                let names='';
                this.lookUp.order.error.forEach(item=>{
                    let count,tip,name=`[${item.name+item.model}]`;
                    item.count<0?tip='缺':tip='增';
                    count= Math.abs(JSON.parse(JSON.stringify(item)).count);
                    if(names===''){
                        names=`${tip}\xa0\xa0\xa0\xa0${name}\xa0\xa0\xa0\xa0${count}'件'`
                    }else {
                        names=names+','+`${tip}\xa0\xa0\xa0\xa0${name}\xa0\xa0\xa0\xa0${count}'件'`
                    }
                });
                return names
            },
            show() {
                this.$refs.lookUpService.show()
            },
            cancelDb() {
                this.$refs.lookUpService.cancel();
            },
            filterTime(){
                if(this.lookUp.order!=undefined){
                    if(this.lookUp.order.time!==undefined){
                        return this.$filterTime(this.lookUp.order.time)
                    }else {
                        return ''
                    }
                }
            }
        },
    }
</script>

<style scoped>
.look-up{
    width: 100%;
    height: 4.078125rem;
    display: flex;
    align-items: center;
    flex-direction: column;
}
    .look-up .look-up-body{
        margin-top: 0.1875rem;
        width: 5.078125rem;
    }
    .look-up-body .look-up-header{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .look-up-body .look-up-table{
        margin-top: 0.1302rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 3.125rem;
    }
    .look-up-body .look-up-bottom{
        width: 100%;
        margin-top: 0.0625rem;
        display: flex;
        flex-direction: column;
    }
</style>