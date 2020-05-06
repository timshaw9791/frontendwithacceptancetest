<template>
    <div class="opening-box">
         <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
         <div class="apply-process-top" data-test="action_box">
                <define-input label="单号" v-model="orderNumber" :disabled="true" class="odd-number"></define-input>
                <define-input label="维修时间" v-model="time" :disabled="true" class="odd-number"></define-input>
                <define-input label="操作人员" v-model="people" :disabled="true"  class="odd-number"></define-input>
            </div>
        <div class="data-list">
            <bos-tabs >
                        <template slot="slotHeader">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
                        <define-table :data="newData" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{detail:'equipArgsSelect'}" format="{name}({model})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备位置" v-slot="{ data }">
                                <entity-input v-model="data.row.location"  format="{frameNumber}架/{surface}面/{section}节/{surface}层" :tableEdit="false" ></entity-input>
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
                            <define-column label="RFID" v-slot="{ data }">
                                <define-input v-model="data.row.rfid" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备序号" v-slot="{ data }">
                                <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                    </bos-tabs>
        <div class="btn-box">
                  <base-button label="取消" align="right" :width="128" :height="25" :fontSize="20" @click="cancel"></base-button>
                  <base-button label="提交" align="right" :width="128" :height="25" :fontSize="20" @click="confirm"></base-button>
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
    import {repairEquipMaintain} from "api/operation"
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
            }
        },
        data(){
            return{
               copyData:{},
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
               list:[]
            }
        },
        methods:{
            selRow(current){
               this.findIndex=current.index
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
             classDataify(data)//读写器数据处理的方法
            {
                    if(this._.findIndex(this.list,data[0])==-1)//避免重复
                {
                data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
                this.newData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length,location:v[0].location}})
                }
            },
            cancel(){
                this.$router.back()
            },
            confirm(){
                this.requestBody=JSON.parse(JSON.stringify(this.newData))
                let rfidList=[]
                this.requestBody.forEach(item=>{
                    item.copyList.forEach(rf=>{
                        rfidList.push(rf.rfid)
                    })
                })
                
                repairEquipMaintain(rfidList,true).then(res=>{
                    this.init()
                    this.cancel()
                })
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.copyList.length,0)
                return sums;
            },
            changePage(page) {
            this.paginator.page = page;
            },
            readData(){
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                     findByRfids(data).then(res=>{
                        this.classDataify(res)
                    })
                    }, (fail) => {
                        this.index = 1;
                        this.$message.error(fail);
                    }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
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
                this.init()
                this.people=JSON.parse(localStorage.getItem('user')).name
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