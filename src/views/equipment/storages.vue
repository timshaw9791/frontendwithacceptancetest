<template>
<view-container>
        <define-table :data="list" height="3.64rem" @changePage="changePage" :pageInfo="paginator" >
            <define-column label="操作" width="130" v-slot="{ data }">
                <div class="span-box">
                    <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
                    <base-button label="删除" size="mini" type="danger" @click="deleteNumber(data.row)"></base-button>
                </div>
            </define-column>
            <define-column label="单号" v-slot="{ data }">
                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备参数" v-slot="{ data }">
                <define-input v-model="data.row.equipArgs" type="Number" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备数量" :filter="(row)=>filterNumber(row)">

            </define-column>
            <define-column label="入库人员" v-slot="{ data }">
                <define-input v-model="data.row.operator.operator" type="String" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="入库时间" :filter="(row)=>$filterTime(row.createTime)"/>
        </define-table>
    <tool-bar>
        <base-button label="入库装备 " type="text" @click="toInHouse" slot="button"></base-button>
    </tool-bar>
</view-container>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import equipInhouse from './equipInhouse'
    import equipInhouseOrder from './equipInhouseOrder'
    import { getInhouseNumber,inOutHouseOrder,deleteInhouseNumber} from "api/storage"
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
            equipInhouse,
            equipInhouseOrder
        },
        data(){
            return{
               list:[],
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0,abnormal:false},
               inhouse:false,
               inorder:false,
               params:{size:10,page:1},
               equipData:''
            }
        },
        methods:{
            toDetail(data){
                this.$router.push({name:'equipinhouseorder',query:{id:data.id}})
            },
            deleteNumber(data)
            {
                deleteInhouseNumber(data.id).then(res=>{
                    this.$message.success('删除入库单成功')
                    this.getList()
                }).catch(err => {
                        this.$message.error(err.response.data.message);
                    })
            },
            getList(){
                inOutHouseOrder(this.params).then(res=>{
                    this.list=res.content
                    this.list.forEach(item=>{
                       let cList = this._.groupBy(item.inOutHouseItems, item => `${item.equipArgId}`)//当单据中为同一种装备时 不管件数多少 都不显示省略号
                        this.newData = this._.map(cList, (v, k) => {
                            return {equipArg: v[0].equipArg}
                        })
                        if(this.newData.length==1)
                        {
                            item.equipArgs=item.inOutHouseItems[0].equipName+'('+item.inOutHouseItems[0].equipModel+')'
                        }else{
                            item.equipArgs=item.inOutHouseItems[0].equipName+'('+item.inOutHouseItems[0].equipModel+')'+'...'
                        }
                    })
                    
                }).catch(err => {
                        this.$message.error(err.response.data.message);
                    })
            },
            filterNumber(data){
                return data.inOutHouseItems.length
            },
            changePage(page) {
            this.paginator.page = page;ss
            },
            toInHouse(){
                this.$router.push({path:"/equipment/equipinhouse"})
            }
        },
        created(){
            this.getList()
        }
}
</script>
<style lang="scss" scoped>


</style>