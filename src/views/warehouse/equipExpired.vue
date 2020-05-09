<template>
  <div class="maintenance-form-container">
       <my-header :title="$route.meta.title" ></my-header>
       <div class="action_box" data-test="action_box">
                <define-input label="单号" placeholder="--" :disabled="true" class="odd-number"></define-input>
                <define-input label="报废类型" placeholder="到期报废" :disabled="true" class="odd-number"></define-input>
                <date-select label="报废时间" placeholder="--" :disabled="true"></date-select>
                <entity-input label="操作人员" v-model="people"  :disabled="true" ></entity-input>
            </div>
        <define-input label="备注" v-model="remark" style="margin-top:15px" :disabled="false" ></define-input>
    
    <div class="maintenance-form-body">
        <bos-tabs @changeTab="changeTab">
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
    import { getInhouseNumber,inHouse,findByRfids,outHouse} from "api/storage"
    import divTmp from '@/componentized/divTmp'
    import { equipScrap} from "api/operation"
    import { maturityScrap,equipById} from 'api/storage'
var _ = require("lodash");
export default {
  name: "maintenance",
  data() {
    return {
       copyData:{},
               remark:'',
               people:'',
               requestBody:'',
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
               newData:[{
                   equipArg:'',
                   count:0,
                   copyList:[{rfid:'',serial:''}]
               }],
               list:[],
               rfids:[]
    }
  },
  methods: {
           selRow(current){
               this.findIndex=current.index
            },
            changeTab(data){
                data.key=="total"?killProcess(this.pid):''
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.count,0)
                return sums;
            },
            cancel(){
                this.$router.back()
            },
            fetchData(){
                maturityScrap().then(res=>{
                    res.content.forEach(item=>{
                      this.rfids.push(item.rfid)
                    })
                    
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
                equipScrap(1,this.remark,rfidList).then(res=>{
                    this.$message.success('装备报废成功')
                    this.cancel()
                })
            },
            changePage(page) {
            this.paginator.page = page;
            },
           classDataify(data)//读写器数据处理的方法
            {
                if(_.findIndex(this.list,data[0])==-1)
                {
                     data.forEach(item=>{this.list.push(item)})
                let cList=_.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}`)
                this.newData=_.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length,location:v[0].location}})
                }
               
            },
            readData(){
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                    if(this.rfids.findIndex((v)=>v==data)!=-1){
                         findByRfids(data).then(res=>{
                         this.classDataify(res)
                    })
                    } 
                    
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
                    this.newData.push({name: '',location: '',price: 0,productTime: 0,rfids: [],serial: [],copyList:[{rfid:'',serial:''}],})
                }else if(this.newData.length>1){
                    this.newData.splice(data.$index, 1)
                }else{
                    this.newData=[{name: '',location: '',price: 0,productTime: 0,rfids: [],serial: [],copyList:[{rfid:'',serial:''}],}]
                }
            },
    },
  created() {
     this.fetchData()
     this.people=JSON.parse(localStorage.getItem('user')).name
  },
  beforeDestroy(){
    killProcess(this.pid)
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
    .action_box{
        margin-top:15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
  }
  .maintenance-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .maintenance-form-body {
      margin-top:15px;
    padding: 0 7px;
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
