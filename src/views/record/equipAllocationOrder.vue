<template>
    <div class="equip-allocation-order-container">
        <my-header :title="$route.meta.title"></my-header>
        <div class="equip-allocation-order-body">
            <define-table :data="listData" height="3.64rem"  @changePage="changePage" :pageInfo="paginator" >
                            <define-column label="操作" width="130" v-slot="{ data }">
                                <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
                            </define-column>
                            <define-column label="单号" v-slot="{ data }">
                                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <define-input v-model="data.row.equipArgs" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备数量" :filter="(row)=>filterNumber(row)"></define-column>
                            <define-column label="操作人员" v-slot="{ data }">
                                <define-input v-model="data.row.operatorInfo.operator" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="操作时间" :filter="(row)=>$filterTime(row.createTime)"/>
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
    import {jsqlPage,getBosEntity} from "api/basic"
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
               fetchParams:{
               pageInfo: {
                    direction: "DESC",
                    page: 1,
                    size: 9999
                },
                jpql: "select lco from LocationChangeOrder lco ",
                returnType: "ARRAY",
                params: []
                },
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
            }
        },
        methods:{
            toDetail(data){
                this.$router.push({name:'equipAllocation',query:{id:data.id,title:'位置变更单/位置变更单详情'}})
            },
            fetchData(){
                this.fetchParams.params=[]
                // this.fetchParams.params.push(id)
                jsqlPage(this.fetchParams).then(res=>{
                    this.listData=this._.flatten(res.content)
                   for(let elem of this.listData.values()){
						elem.equipArgs=elem.locationChangeItems.length==1?`${elem.locationChangeItems[0].equipName}(${elem.locationChangeItems[0].equipModel})`:
						`${elem.locationChangeItems[0].equipName}(${elem.locationChangeItems[0].equipModel})...`
					}
                })
            },
            filterNumber(data){
                return data.locationChangeItems.length
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
.equip-allocation-order-container{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .btn_box{
    padding: 16px 7px;
    // border-top:1px solid rgba(112, 112, 112, 0.13);
    // border-bottom:1px solid rgba(112, 112, 112, 0.13);
    }
    .equip-allocation-order-body
    {
        padding: 0 10px;
        margin-top:30px;
        height:"2.8648rem";
        // border:1px solid rgba(112, 112, 112, 0.13)
    }
    .span-box{
        display:flex;
        justify-content: space-between;
    }
}

</style>