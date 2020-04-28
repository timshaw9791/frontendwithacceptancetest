<template>
  <div class="maintenance-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="maintenance-form-top" v-if="show">
      <base-button size="default" align="right" label="开始保养" @click="startMain"></base-button>
    </div>
    <div class="process-info" v-else>
      <!-- <define-input label="单号" v-model="order.number" :disabled="true" class="odd-number"></define-input>
      <date-select label="申请时间" v-model="order.createTime" :disabled="true"></date-select>
      <entity-input label="申请人员" v-model="order.applicant" :required="true" placeholder="请选择"></entity-input> -->
    </div>
    <div class="maintenance-form-body" v-if="show">
        <bos-tabs :option="['tabs']" :layoutRatio="[2, 1]">
          <define-table :havePage="false" :data="listData" height="2.6042rem"
            @changeCurrent="selRow" :summaryFunc="sumFunc" :showSummary="true" :highLightCurrent="true" slot="total" >
            <define-column label="装备参数" v-slot="{ data }">
              <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg" :options="{ detail: 'equipArgsDetail' }" format="{name}({model})" :disabled="true" ></entity-input>
            </define-column>
            <define-column label="装备位置" field="location" :filter="(row)=>milliLocation(row.location)"></define-column>
            
            <define-column label="可保养数量" field="count"></define-column>
          </define-table>
          <define-table :havePage="false" :data="listData[findIndex].copyList" height="2.6042rem" slot="detail" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
          </define-table>
        </bos-tabs>
    </div>
    <div v-else class="maintenance-form-body">
      <bos-tabs :option="['tabs']" :layoutRatio="[2, 1]">
        <template slot="slotHeader">
          <base-button label="读取数据" align="right" :disabled="!select.selected" @click="readData()" :width="96"></base-button>
          <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
        </template>
        <define-table :havePage="false" :data="copyData" class="left_box" height="2.6042rem"
           slot="total" >
          <define-column label="操作">
              <i class="iconfont icontianjialiang"></i>
              <i class="iconfont iconyichuliang"></i>
          </define-column>
        </define-table>
        <define-table :havePage="false" class="center_box" :data="listData" height="2.6042rem"
          @changeCurrent="selRow" :summaryFunc="sumFunc" :haveIndex="false" :showSummary="true" :highLightCurrent="true" slot="total" >
          <define-column label="装备参数" v-slot="{ data }">
            <entity-input v-model="data.row.equipArg" :options="{ detail: 'equipArgsSelect' }" format="{name}({model})" :disabled="true" ></entity-input>
          </define-column>
          <define-column label="装备位置" field="location" :filter="(row)=>locations(row.location)"></define-column>
          <define-column label="可保养数量" field="count"></define-column>
        </define-table>
        <define-table :havePage="false" class="right_box" :data="copyData" height="2.6042rem"
          @changeCurrent="selRow" :summaryFunc="sumFunc" :haveIndex="false" :showSummary="true" :highLightCurrent="true" slot="total" >
          <define-column label="本次保养数量" field="keepcount"></define-column>
        </define-table>
        <define-table :havePage="false"  :data="copyData[findIndex].copyList" height="2.6042rem" slot="detail" >
          <define-column label="RFID" field="rfid"></define-column>
          <define-column label="装备序号" field="serial"></define-column>
        </define-table>
      </bos-tabs>
      <!-- <div class="buttom">
          <base-button label="提交" align="right" size="large" ></base-button>
          <base-button label="取消" align="right" size="large" type="danger" @click="cancel"></base-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import myHeader from "components/base/header/header";
import baseButton from "@/componentized/buttonBox/baseButton";
import serviceDialog from "components/base/serviceDialog";
import defineInput from '@/componentized/textBox/defineInput'
import bosTabs from "@/componentized/table/bosTabs";
import request from "common/js/request";
import entityInput from '@/componentized/entity/entityInput'
import {needKeepEquips} from "api/operation"
import { getInhouseNumber,inHouse,findByRfids,outHouse} from "api/storage"
var _ = require("lodash");
export default {
  name: "maintenance",
  data() {
    return {
      show: true,
      rowData: "", // 选中的单选行数据
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
      findIndex:0,
      listData:[],
      copyData:[{
        equipArg:'',
        location:'',
        keepcount:0,
        copyList:[{rfid:'',serial:''}]
      }],
      list:[],
    }
  },
  methods: {
    selRow(data,index) { // 单选表格行
           console.log(data);
            this.findIndex=this._.indexOf(this.listData,data)
      },
    startMain(){
       this.$router.push({path: '/equipmentOperation/startMaintenance'});
    },
      locations(data){
        return data.floor+'/'+data.frameNumber+'/'+data.surface+'/'+data.section
      },
      classDataify(data)//读写器数据处理的方法
            {
                data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
                this.listData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length,location:v[0].location}})
            },
      classDataifyRfid(data)
      {
        debugger
          let newList=[]
          data.forEach(item=>{newList.push(item)})
          let cList=this._.groupBy(newList, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
          console.log(cList);
          this.copyData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,clist:v,count:v.length,location:v[0].location,keepcount:0}})
          this.copyData.forEach(item=>{item.keepcount=item.copyList=length})

      },
      cancel(){this.show = true},
      sumFunc(param) { // 表格合并行计算方法
      let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.count,0)
                return sums;      
      },
      milliLocation(data)//对现实的装备位置信息进行处理
            {
                return data.frameNumber+'架/'+data.surface+'面/'+data.section+'节/'+data.surface+'层'
            },
      getList(){
        needKeepEquips().then(res=>{
          this.classDataify(res.content)
        })
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
                let rfids=['00001545']
                rfids.forEach(item=>{
                    findByRfids(item).then(res=>{
                     this.classDataifyRfid(res)
                   })
                })
            },
      init(){
                this.listData=[{
                    equipArg: '',
                    location: '',
                    count: 0,
                    rfids: [],
                    serial: [],
                    copyList:[{rfid:'',serial:''}],
                    clist:[{rfid:'',serial:''}]
                }]
            }
    },
  created() {
    this.getList()
    if(this.listData.length==0){
          this.init()
      }
  },
  components: {
    myHeader,
    baseButton,
    bosTabs,
    entityInput
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
    border:1px solid black;
    widows: 100%;
    .left_box{
    border:1px solid black;
    width:300px;
    float:left;
   }
   .center_box{
    border:1px solid black;
    width:800px;
    float:left;
    }
    .right_box{
    border:1px solid black;
    width:200px;
    float:left;
    }
  }
  .process-info {
      padding: 18px 0;
      display: flex;
      justify-content: flex-start;
      overflow: hidden;
  }
  .buttom {
      height: 72px;
      width:100%;
      margin-top: 25px;
      // box-shadow:0px 0px 12px rgba(235,238,245,1);
  }

</style>
