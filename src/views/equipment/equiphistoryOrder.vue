<template>
    <view-container>
        <define-table :data="listData" height="2.8646rem"  :havePage="false"
            :highLightCurrent="true">
            <define-column label="操作类别" field="category"/>
            <define-column label="操作时间" :filter="(row)=>$filterTime(row.createTime)" />
            <define-column label="操作人员" field="operatorInfo.operator"/>
            <define-column label="备注" field="remark"/>
        </define-table>
        <tool-bar>
            <base-button label="返回" type="text" slot="button" @click="cancel"></base-button>
        </tool-bar>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import serviceDialog from 'components/base/serviceDialog/index'
    import divTmp from '@/componentized/divTmp'
    import {jsqlPage} from "api/basic"
export default {
    components:{
            myHeader,
            textInput,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            divTmp,
            bosTabs,
            serviceDialog
        },
        data(){
            return{
               params:{
               pageInfo: {
                    direction: "ASC",
                    page: 1,
                    size: 10
                },
                returnType: "ARRAY",
                jpql: "select ehr from Equip e left join EquipHistoryRecord ehr on e.id = ehr.equipId where e.id = ?1 ",
                params: []
                },
               listData:[]
            }
        },
        methods:{
            fetchData(id){
                this.params.params=[]
                this.params.params.push(id)
                jsqlPage(this.params).then(res=>{
                    this.listData=this._.flatten(res.content)
                    for(let elem of this.listData.values()){
                        if(elem.category=='0')elem.category='入库'
                        if(elem.category=='2')elem.category='开始保养'
                        if(elem.category=='3')elem.category='结束保养'
                        if(elem.category=='4')elem.category='开始维修'
                        if(elem.category=='5')elem.category='结束维修'
                        if(elem.category=='6')elem.category='领取'
                        if(elem.category=='7')elem.category='归还'
                        if(elem.category=='8')elem.category='装备位置变更'
                        if(elem.category=='9')elem.category='开始充电'
                        if(elem.category=='10')elem.category='结束充电'
                        if(elem.remark==null)elem.remark='--'
                    }
                })
            },
            cancel(){
                this.$router.back()
            },
        },
        created(){
               this.fetchData(this.$route.query.id)
        }
}
</script>
<style lang="scss" scoped>
.data-list
{
    padding: 0 10px;
    margin-top:15px;
    height:"2.8648rem";
    // border:1px solid rgba(112, 112, 112, 0.13)
}
</style>