<template>
    <view-container>
        <define-table :data="list"  @changeCurrent="selRow" @changePage="changePage" :pageInfo="paginator" >
            <define-column label="RFID" v-slot="{ data }">
                <define-input v-model="data.row.equipRfid" type="Number" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备序号" v-slot="{ data }">
                <define-input v-model="data.row.equipSerial" type="Number" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备参数" v-slot="{ data }">
                <define-input v-model="data.row.equipArgs"  :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备位置" v-slot="{ data }">
                <entity-input v-model="data.row.equipLocation" format="{frameNumber}架/{surface}面/{section}节/{surface}层" :tableEdit="false"></entity-input>
            </define-column>
            <define-column label="申请人" v-slot="{ data }">
                <define-input v-model="data.row.applyUser" type="String" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="申请时间" :filter="(row)=>$filterTime(row.createTime)"/>
            <define-column label="申请原因" field="reason"/>
        </define-table>
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
    import { RepairOrder} from "api/operation"
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
               params:{size:10,page:1,category:4},
            }
        },
        methods:{
            selRow(){

            },
            toDetail(data){
                console.log(data);
                this.$router.push({name:'serviceDetails',params:{info:data}})
            },
            getList(){
                RepairOrder(this.params).then(res=>{
                    this.list=res.content
                    this.list.forEach(item=>{
                        item.equipArgs=`${item.equipName}(${item.equipModel})`
                        // if(item.equipRepairItems.length==1)
                        // {
                        //     item.equipArgs=item.equipRepairItems[0].equipName+'('+item.equipRepairItems[0].equipModel+')'
                        // }else{
                        //     item.equipArgs=item.equipRepairItems[0].equipName+'('+item.equipRepairItems[0].equipModel+')'+'...'
                        // }
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


</style>