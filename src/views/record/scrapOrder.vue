<template>
    <div class="scrap-order-container">
        <my-header :title="$route.meta.title"></my-header>
        <div class="scrap-order-body">
            <define-table :data="listData" height="3.64rem" @changePage="changePage" :pageInfo="paginator" >
                            <define-column label="操作" width="130" v-slot="{ data }">
                                     <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
                            </define-column>
                            <define-column label="单号" v-slot="{ data }">
                                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="报废类型" v-slot="{ data }">
                                <define-input v-model="data.row.category"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <define-input v-model="data.row.equipArgs"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备数量" :filter="(row)=>filterNumber(row)"></define-column>
                            <define-column label="操作人员" v-slot="{ data }">
                                <define-input v-model="data.row.operatorInfo.operator" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="报废时间" :filter="(row)=>$filterTime(row.createTime)"/>
                        </define-table>
        </div>
    </div>
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
    import { scarpsOrders} from "api/operation"
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
        },
        data(){
            return{
               listData:[],
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0,abnormal:false,category:4},
            }
        },
        methods:{
            toDetail(data){
                this.$router.push({name:'scrapOrderDetails',query:{id:data.id}})
            },
            fetchData(){
                scarpsOrders(this.paginator).then(res=>{
                    this.listData=res.content
                    this.paginator.totalPages = res.totalPages
					this.paginator.totalElements = res.totalElements
                    for(let elem of this.listData.values()){
                        if(elem.category==0){elem.category='维修报废'}
                        if(elem.category==1){elem.category='到期报废'}
                        if(elem.category==2){elem.category='盘点报废'}
                        if(elem.scrapItems.length!=''){
                            elem.equipArgs=elem.scrapItems.length==1?`${elem.scrapItems[0].equipName}(${elem.scrapItems[0].equipModel})`:
						`${elem.scrapItems[0].equipName}(${elem.scrapItems[0].equipModel})...`
                        }
					}
                })
            },
            filterNumber(data){
                return data.scrapItems.length
            },
            changePage(page) {
            this.paginator.page = page;
            this.fetchData()
            },
        },
        created(){
            this.fetchData()
        }
}
</script>
<style lang="scss" scoped>
.scrap-order-container{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .scrap-order-body
    {
        padding: 0 10px;
        margin-top:30px;
        height:"2.8648rem";
        // border:1px solid rgba(112, 112, 112, 0.13)
    }
}

</style>