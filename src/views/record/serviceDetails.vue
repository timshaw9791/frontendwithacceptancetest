<template>
    <div class="opening-box">
          <my-header :title="$route.meta.title" :haveBlack="true" @h_black="cancel"></my-header>
         <div class="action_box" data-test="action_box">
                <define-input label="单号" v-model="orderNumber" :disabled="true" class="odd-number"></define-input>
                <date-select label="维修开始时间" v-model="time" :disabled="true"></date-select>
                <entity-input label="操作人员" v-model="people" format="{name}" :disabled="true" ></entity-input>
            </div>
        <div class="data-list">
            <bos-tabs >
                       
                        <define-table :data="newData" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{search:'equipArgsSelect'}" format="{equipName}({equipModel})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备位置"  v-slot="{ data }" >
                                 <entity-input v-model="data.row.location"  format="{frameNumber}架/{surface}面/{section}节/{floor}层" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count"  type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                        <define-table :data="newData[findIndex].copyList" height="2.8646rem" :havePage="false" slot="detail">
                            <define-column label="RFID" v-slot="{ data }">
                                <define-input v-model="data.row.rfid" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备序号" v-slot="{ data }">
                                <define-input v-model="data.row.equipSerial" type="Number" :tableEdit="false" ></define-input>
                            </define-column>
                        </define-table>
                    </bos-tabs>
        </div>
    </div>
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
    import { start, startOne, killProcess,handheld, modifyFileName } from 'common/js/rfidReader'
    import divTmp from '@/componentized/divTmp'
    import { getInhouseNumber,inHouse} from "api/storage"
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
               time:"",
               people:'',
               requestBody:'',
               orderNumber:'',
               findIndex:0,
               newData:[],
               list:[]
            }
        },
        methods:{
            selRow(data){
                this.findIndex=data.index
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                columns.forEach((colum, index) => {
                    if(index == 0) {
                        sums[index] =  '合计';
                    } else if(index == columns.length-1) {
                        const values = data.map(item => item.count?Number(item.count):0);
                        if(!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((pre, cur) => !isNaN(cur)?pre+cur:pre);
                        }
                    } else {
                        sums[index] = '';
                    }
                })
                return sums;
            },
            cancel(){
                this.$router.back()
            },
            changePage(page) {
            this.paginator.page = page;
            },
            changeDataFormat(data){
            data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipName}${item.equipModel}${item.locationInfo.id}`)
                this.newData=this._.map(cList,(v,k)=>{return {equipArg:v[0],copyList:v,count:v.length,location:v[0].locationInfo}})
        },
        },
        
        created(){
                console.log(this.$route.params.info);
                this.orderNumber=this.$route.params.info.number;
                this.time=this.$route.params.info.createTime;
                this.people=this.$route.params.info.operatorInfo.operator;
                this.changeDataFormat(this.$route.params.info.equipRepairItems)

            
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .action_box{
        margin-top:15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .btn_box{
    height:30px;
    border-top:1px solid rgba(112, 112, 112, 0.13);
    border-bottom:1px solid rgba(112, 112, 112, 0.13);
    }
    .data-list
    {
        padding: 0 10px;
        margin-top:15px;
        height:"2.8648rem";
        // border:1px solid rgba(112, 112, 112, 0.13)
    }
    .span-box{
        display:flex;
        justify-content: space-between;
    }
}
.location-select{
    height: 500px;
    width: 4.625rem;
    z-index: 1200;
    .select-location{
        width:3.5rem;
        height: 440px;
        float: left;
        margin-left: auto;
}
}
.btn-box{
        width: 4rem;
        height: 50px;
        margin-left:20px;
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        align-items : center; 
    }
</style>