<template>
    <div class="opening-box">
        <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
         <div class="apply-process-top" data-test="action_box">
                <define-input label="单号" v-model="orderNumber" :disabled="true" ></define-input>
                <define-input label="维修时间" v-model="time" :disabled="true" ></define-input>
                <define-input label="操作人员" v-model="people" :disabled="true"  ></define-input>
            </div>
        <div class="data-list">
            <bos-tabs>
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
            <define-table :havePage="false"  :data="copyData[findIndex].clist" height="2.6042rem" slot="detail" >
            <define-column label="RFID" field="rfid"></define-column>
            <define-column label="装备序号" field="serial"></define-column>
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
    import {needKeepEquips} from "api/operation"
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
            time:"",
            people:'',
            requestBody:'',
            orderNumber:'——',
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
        methods:{
          selRow(current) { // 单选表格行
           console.log(current);
           this.findIndex=this._.indexOf(this.listData,current)
      },
      locations(data){
        return data.floor+'/'+data.frameNumber+'/'+data.surface+'/'+data.section
      },
      confirm(){

      },
      classDataify(data)//读写器数据处理的方法
            {
                data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
                this.listData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length,location:v[0].location}})
            },
      classDataifyRfid(data)
      {
          data.forEach(item=>this.list.push(item))
          let cList=this._.groupBy(this.list, item => `${item.equipArg.model}${item.equipArg.name}${item.location.id}`)
          console.log(cList);
          this.copyData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,clist:v,count:v.length,location:v[0].location,keepcount:0}})
      },
      cancel(){this.show = true},
      sumFunc(param) { // 表格合并行计算方法

      },
      getList(){
        needKeepEquips().then(res=>{
          this.classDataify(res.content)
        })
      },
      readData(){
          this.list=[]
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
                let rfids=['00001545','5555']
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