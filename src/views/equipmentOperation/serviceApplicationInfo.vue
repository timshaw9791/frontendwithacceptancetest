<template>
    <div class="opening-box">
        <my-header :title="inhouse?'维修申请':'开始维修'" :haveBlack="inhouse||inorder" @h_black="black"></my-header>
        <div class="btn_box" v-if="!inhouse&&!inorder">
             <base-button label="开始维修" align="right" :width="128" :height="25" :fontSize="20" @click="toInHouse"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changeCurrent="selRow" @changePage="changePage" :pageInfo="paginator" v-if="!inhouse&&!inorder">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <div class="span-box">
                                     <span >开柜</span>
                                </div>
                            </define-column>
                            <define-column label="RFID" v-slot="{ data }">
                                <define-input v-model="data.row.rfid" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="RFID" v-slot="{ data }">
                                <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <define-input v-model="data.row.equipArgs" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备位置">
                                
                            </define-column>
                           
                            <define-column label="申请时间" :filter="(row)=>$filterTime(row.createTime)"/>
                            <define-column label="申请原因" v-slot="{ data }">
                                <define-input v-model="data.row.operator.operator" type="String" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
            <start-service v-if='inhouse'  @cancel="black"></start-service>
            <!-- <equip-inhouse-order v-if="inorder" :equipData="equipData" @cancel="black"></equip-inhouse-order> -->
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
    import startService from './startService'
    // import equipInhouseOrder from './equipInhouseOrder'
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
            startService,
            divTmp,
            bosTabs,
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
            selRow(){

            },
            sumFunc(){

            },
            toDetail(data){
                this.equipData=data
                this.inorder=true
            },
            deleteNumber(data)
            {
                deleteInhouseNumber(data.id).then(res=>{
                    this.$message.success('删除入库单成功')
                }).catch(err => {
                        this.$message.error(err.response.data.message);
                    })
            },
            black(){
                this.inhouse=false
                this.inorder=false
                this.getList()
            },
            getList(){
                inOutHouseOrder(this.params).then(res=>{
                    this.list=res.content
                    this.list.forEach(item=>{
                        if(item.inOutHouseItems.length==1)
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
                this.inhouse=true
            }
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
    // border-top:1px solid rgba(112, 112, 112, 0.13);
    // border-bottom:1px solid rgba(112, 112, 112, 0.13);
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