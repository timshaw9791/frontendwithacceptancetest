<template>
    <div class="opening-box">
        <my-header title="维修单"></my-header>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changeCurrent="selRow" @changePage="changePage" :pageInfo="paginator" >
                            <define-column label="操作" width="130" v-slot="{ data }">
                                <div class="span-box">
                                     <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
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
                            <define-column label="操作人员" v-slot="{ data }">
                                <define-input v-model="data.row.operatorInfo.operator" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="维修开始时间" :filter="(row)=>$filterTime(row.createTime)"/>
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
    import { serviceOrders} from "api/operation"
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
               list:[],
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0,abnormal:false},
               params:{size:10,page:1,category:5},
            }
        },
        methods:{
            selRow(){

            },
            toDetail(data){
                this.$router.push({name:'serviceDetails',params:{info:data}})
                this.$route.meta.title = '维修归还单/维修归还单详情'
            },
            getList(){
                serviceOrders(this.params).then(res=>{
                    this.list=res.content
                    this.list.forEach(item=>{
                        if(item.equipRepairItems.length==1)
                        {
                            item.equipArgs=item.equipRepairItems[0].equipName+'('+item.equipRepairItems[0].equipModel+')'
                        }else{
                            item.equipArgs=item.equipRepairItems[0].equipName+'('+item.equipRepairItems[0].equipModel+')'+'...'
                        }
                    })
                    
                })
            },
            filterNumber(data){
                return data.equipRepairItems.length
            },
            changePage(page) {
            this.paginator.page = page;ss
            },
        },
        created(){
            this.getList()
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .btn_box{
    padding: 16px 7px;

    }
    .data-list
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