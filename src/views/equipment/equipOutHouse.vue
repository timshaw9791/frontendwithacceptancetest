<template>
    <div class="opening-box">
          <div class="action_box" data-test="action_box">
                <define-input label="单号" v-model="orderNumber" :disabled="true" class="odd-number"></define-input>
                <date-select label="出库时间" v-model="time" :disabled="true"></date-select>
                <entity-input label="出库人员" v-model="people"  :options="{search:'locationSelect'}" format="{name}" :disabled="true" ></entity-input>
            </div>
        <div class="data-list">
            <bos-tabs >
                        <template slot="slotHeader" v-if="showDetail">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
                        <define-table :data="newData" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }" v-if="showDetail">
                                <entity-input v-model="data.row.equipArg"  :options="{detail:'equipArgsSelect'}" format="{name}({model})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }" v-if="!showDetail">
                                <entity-input v-model="data.row.equipArg"  :options="{detail:'equipArgsSelect'}" format="{equipName}({equipModel})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count"  type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                        <define-table :data="newData[findIndex].copyList" height="2.8646rem" :havePage="false" slot="detail">
                            <define-column label="操作" width="100" v-slot="{ data }">
                               <i class="iconfont icontianjialiang" @click="changeDetailRow(true,data)"></i>
                               <i class="iconfont iconyichuliang" @click="changeDetailRow(false,data)"></i>
                            </define-column>
                            <define-column label="RFID" field="rfid" :tableEdit="false"/>
                            <define-column label="装备序号" field="equipSerial" :tableEdit="false"/>
                        </define-table>
                    </bos-tabs>
        <div class="btn-box" v-if="showDetail">
                  <base-button label="取消" align="right"   @click="cancel"></base-button>
                  <base-button label="提交" align="right"   @click="confirm"></base-button>
              </div>
        
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
    import { getInhouseNumber,inHouse,findByRfids,outHouse} from "api/storage"
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
        props:{
            equipData: {
              type: Object,
              default() {
                return {}
              }
            },
            showDetail: {
              type: Boolean,
              default:true
            },
        },
        data(){
            return{
               time:"",
               people:'',
               requestBody:'',
               orderNumber:'——',
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
               select: {
                    handWareList: [{
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读卡器",
                        value: "reader"
                    }],
                    selected: ""
                },
               pid:'',
               findIndex:0,
               newData:[],
               list:[],
            }
        },
        methods:{
            selRow(data,index){
               this.findIndex=index
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.copyList.length,0)
                return sums;
            },
            cancel(){
                this.$emit('cancel')
            },
            confirm(){
                this.requestBody=JSON.parse(JSON.stringify(this.newData))
                let rfidList=[]
                this.requestBody.forEach(item=>{
                    item.copyList.forEach(rf=>{
                        rfidList.push(rf.rfid)
                    })
                })
                
                outHouse(rfidList).then(res=>{
                    this.$message.success('装备出库成功')
                    this.init()
                    this.cancel()
                })
            },
            changePage(page) {
            this.paginator.page = page;
            },
            changelocation(){
                this.$refs.historyDialog.show()
            },
            classDataify(data)//读写器数据处理的方法
            {
                data.forEach(item=>{this.list.push(item)})
                /*详情单过来时 数据的属性不同处理方法不同*/
                let cList=this.showDetail?this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}`):this._.groupBy(this.list, item => `${item.equipName}${item.equipModel}`)
                this.newData=this.showDetail?this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length}}):this._.map(cList,(v,k)=>{return {equipArg:v[0],copyList:v,count:v.length}})
                //this.list=this._.map(this._.groupBy(this.list, item => `${item.equipArg.model}`),(v,k)=>{return {equipArg:v[0].equipArg,copyList:v}})
                // return this._.map(this._.groupBy(this.list, item => `${item.equipArg.model}${item.location.surface}`),(v,k)=>{return {equipArg:v[0].equipArg,copyList:v}})
            },
            readData(){
                if(this.select.selected=='reader')
                {
                    killProcess(this.pid)
                    start("java -jar scan.jar", (data) => {
                        findByRfids(data).then(res=>{
                        this.classDataify(res)
                    })
                        }, (fail) => {
                            this.index = 1;
                            this.$message.error(fail);
                        }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
                }
            },
            changeDetailRow(state,data)
            {
                if(state)
                {
                    this.newData[this.findIndex].copyList.push({rfid:'',serial:''})
                }else if(this.newData[this.findIndex].copyList.length>1){
                    this.newData[this.findIndex].copyList.splice(data.$index, 1)
                }else{
                    this.newData[this.findIndex].copyList=[{rfid:'',serial:''}]
                }
            },
            changeRow(state,data)
            {
                if(state)
                {
                    this.newData.push({name: '',locationId: '',price: 0,productTime: 0,rfids: [],serial: [],copyList:[{rfid:'',serial:''}],})
                }else if(this.newData.length>1){
                    this.newData.splice(data.$index, 1)
                }else{
                    this.newData=[{name: '',locationId: '',price: 0,productTime: 0,rfids: [],serial: [],copyList:[{rfid:'',serial:''}],}]
                }
            },
            init(){
                this.newData=[{
                    name: '',
                    location: '',
                    price: 0,
                    productTime: 0,
                    rfids: [],
                    serial: [],
                    copyList:[{rfid:'',serial:''}]
                }]
            }
        },
        created(){
               if(this.showDetail){
                this.init()
                this.people=JSON.parse(localStorage.getItem('user')).name
               }else{
                   this.time=this.equipData.createTime
                   this.people=this.equipData.operator.operator
                   this.orderNumber=this.equipData.number
                   this.classDataify(this.equipData.inOutHouseItems)
               }
                
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .btn_box{
    height:30px;
    border-top:1px solid rgba(112, 112, 112, 0.13);
    border-bottom:1px solid rgba(112, 112, 112, 0.13);
    }
    .action_box{
        display: flex;
        justify-content: flex-start;
        align-items: center;
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