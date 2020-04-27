<template>
  <div class="maintenance-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="maintenance-form-top">
      <base-button :width="100" size="default" align="right" label="结束保养" ></base-button>
    </div>
    <div class="maintenance-form-body">
        <bos-tabs >
                        <define-table :data="newData" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{detail:'equipArgsSelect'}" format="{name}({model})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备位置" v-slot="{ data }">
                                <define-input v-model="data.row.location"  type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="正在保养数量" v-slot="{ data }">
                                <define-input v-model="data.row.count"  type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="保养时长" v-slot="{ data }">
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
    import { findrepairingequips} from "api/operation"
var _ = require("lodash");
export default {
  name: "maintenance",
  data() {
    return {
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
  methods: {
    selRow(current){
                console.log(current);
               this.findIndex=this._.indexOf(this.newData,current)
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
            milliLocation(data)//对现实的装备位置信息进行处理
            {
                return data.frameNumber+'架/'+data.surface+'面/'+data.section+'节/'+data.surface+'层'
            },
             classDataify(data)//读写器数据处理的方法
            {
                data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}`)
                this.newData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length}})
                /*详情单过来时 数据的属性不同处理方法不同*/
                // let cList=this.showDetail?this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}`):this._.groupBy(this.list, item => `${item.equipName}${item.equipModel}`)
                // this.newData=this.showDetail?this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length}}):this._.map(cList,(v,k)=>{return {equipArg:v[0],copyList:v,count:v.length}})
                //this.list=this._.map(this._.groupBy(this.list, item => `${item.equipArg.model}`),(v,k)=>{return {equipArg:v[0].equipArg,copyList:v}})
                // return this._.map(this._.groupBy(this.list, item => `${item.equipArg.model}${item.location.surface}`),(v,k)=>{return {equipArg:v[0].equipArg,copyList:v}})
            },
            cancel(){
                this.$emit('cancel')
            },
            getList(){
                findrepairingequips().then(res=>{
                    this.newData=this._.map(res,(v,k)=>{return {equipArg:v.equipArg,copyList:[],count:v.rfids.length,location:v.location,rfids:v.rfids,serials:v.serials}})
                    this.newData.forEach(item=>{
                        let len=item.rfids.length
                        console.log(len);
                        for(let i=0;i<len;i++)
                        {
                            item.copyList.push({rfid:item.rfids[i],serial:item.serials[i]})
                        }
                    })
                    console.log(this.newData);
                })
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
            getTime(ns) {
                if(ns)
                {
                    var date=new Date(parseInt(nS));
                }else{
                    var date=new Date();
                }
            var year=date.getFullYear();
            var mon = date.getMonth()+1;
            var day = date.getDate();
            var hours = date.getHours();
            var minu = date.getMinutes();
            var sec = date.getSeconds();
            this.time= year+'/'+mon+'/'+day+'/'+hours+'时';
            },
            readData(){
                // killProcess(this.pid)
                // start("java -jar scan.jar", (data) => {
                //     if(this.list[this.findIndex].copyList.length==1&&this.list[this.findIndex].copyList[0].rfid=='')
                //     {
                //         this.list[this.findIndex].copyList[0].rfid=data
                //     }else{
                //         this.list[this.findIndex].copyList.push({rfid:data,serial:''})
                //     }
                //     }, (fail) => {
                //         this.index = 1;
                //         this.$message.error(fail);
                //     }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
                let rfids=['55555995','110000031112131415161718','110000031112131415161718']
                rfids.forEach(item=>{
                    findByRfids(item).then(res=>{
                        this.changeDataFormat(res)
                    })
                })
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
                    locationId: '',
                    price: 0,
                    productTime: 0,
                    rfids: [],
                    serial: [],
                    copyList:[{rfid:'',serial:''}]
                }]
            }
    },
  created() {
      this.getList()
  },
  components: {
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
};
</script>

<style lang="scss" scoped>
  .maintenance-form-container {
    font-size: 16px;
  }
  .maintenance-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .maintenance-form-body {
    padding: 0 7px;
  }
</style>
