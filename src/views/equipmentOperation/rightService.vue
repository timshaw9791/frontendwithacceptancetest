<template>
    <div class="right-service-container">
        <my-header title="正在维修" ></my-header>
        <div class="btn_box">
             <base-button label="结束维修" align="right" :width="128" :height="25" :fontSize="20" @click="toInHouse"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changeCurrent="selRow" @changePage="changePage" :pageInfo="paginator">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <div class="span-box">
                                        <base-button label="报废" size="mini" @click="toScrap(data.row)" type="primary"></base-button>
                                </div>
                            </define-column>
                            <define-column label="RFID" v-slot="{ data }">
                                <define-input v-model="data.row.rfid"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备序号" v-slot="{ data }">
                                <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg" :options="{ detail: 'equipArgsDetail' }" format="{name}({model})" :disabled="true" ></entity-input>
                            </define-column>
                            <define-column label="装备位置" v-slot="{data}">
                                <entity-input v-model="data.row.location" format="{frameNumber}架/{surface}面/{section}节/{floor}层" :tableEdit="false"></entity-input>
                            </define-column>
                            <define-column label="维修时长" :filter="(row)=>milliTime(row.createTime)"/>
                        </define-table>
            <serviceDialog title="装备报废" ref="scrapDailog" @confirm="submit" width="250px;">
                <div>
                    <date-select label="申请时间" v-model="time" :disabled="true"></date-select>
                    <entity-input label="申请人员" v-model="people"  :options="{search:'locationSelect'}" format="{name}" :disabled="true" ></entity-input>
                    <entity-input label="审核人员" v-model="people"  :options="{search:'locationSelect'}" format="{name}" :disabled="true" ></entity-input>
                    <define-input label="申请原因" v-model="scrapData.remark" :disabled="false" class="odd-number"></define-input>
                </div>
          </serviceDialog>

        
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
    import endService from './startService'
    import serviceDialog from 'components/base/serviceDialog'
    // import equipInhouseOrder from './equipInhouseOrder'
    import {rightRepairOrder,equipScrap} from "api/operation"
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
            endService,
            divTmp,
            bosTabs,
            serviceDialog
        },
        data(){
            return{
               list:[],
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0,abnormal:false},
               inhouse:false,
               inorder:false,
               params:{size:10,page:1},
               equipData:'',
               scrapData:''
            }
        },
        methods:{
            selRow(){

            },
            sumFunc(){

            },
            submit(){
                equipScrap({category:'REPAIR',remark:this.scrapData.remark,rfids:this.scrapData.rfid}).then(res=>{
                    this.$refs.scrapDailog.hide()
                    this.getList()
                })
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
            toScrap(data){
                this.$refs.scrapDailog.show()
                this.scrapData=data
            },
            milliTime(data){
              let time=(new Date()-data)/(1000 * 60 * 60 * 24)>1?(new Date()-data)/(1000 * 60 * 60 * 24):1
              return time;
            },
            black(){
                this.inhouse=false
                this.inorder=false
                this.getList()
            },
            getList(){
                rightRepairOrder(this.params).then(res=>{
                    this.list=res.content
                    
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
                this.$router.push({path:"/equipmentOperation/endService"})
            }
        },
        created(){
            this.getList()
        }
}
</script>
<style lang="scss" scoped>
.right-service-container{
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