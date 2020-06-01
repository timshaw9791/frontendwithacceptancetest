<template>
  <div class="maintenance-form-container">
    <my-header :title="$route.meta.title" ></my-header>
    <div class="maintenance-form-top" >
      <base-button :width="100" size="default" align="right" @click="endMain()" label="结束保养" ></base-button>
    </div>
    <div class="maintenance-form-body">
        <bos-tabs >
                        <define-table :data="listData" ref="table1" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{detail:'equipArgsDetail'}" format="{name}({model})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备位置"  v-slot="{ data }" >
                                 <entity-input v-model="data.row.location"   :formatFunc="$formatFuncLoc" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="正在保养数量" v-slot="{ data }">
                                <define-input v-model="data.row.count"  type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="保养时长" v-slot="{ data }">
                                <date-input v-model="data.row.keepTime" filter="toDay" :tableEdit="false"></date-input>
                            </define-column>
                        </define-table>
                        <define-table :data="listData[this.findIndex].copyList" height="2.8646rem" :havePage="false" slot="detail">
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
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import { start, startOne, killProcess,handheld, modifyFileName } from 'common/js/rfidReader'
    import { getInhouseNumber,inHouse,findByRfids,outHouse} from "api/storage"
    import { inKeepEquips} from "api/operation"
var _ = require("lodash");
export default {
  name: "maintenance",
  data() {
    return {
               findIndex:0,
               listData:[],
    }
  },
  methods: {
    selRow(current){
            this.findIndex=current.index
            },
            endMain(){
                this.$router.push({path: '/equipmentOperation/endMaintenance'});
            }, 

            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.copyList.length,0)
                return sums;
            },
             fixData(data)//界面数据处理
            {
                if(data.length!=0){
                    let cList=this._.groupBy(data, item => `${item.equipArg.name}${item.equipArg.model}${item.location.id}`)
                    this.listData=this._.map(cList,(v,k)=>{return {equipArg:v[0].equipArg,copyList:v,count:v.length,location:v[0].location,keepTime:this.milliTime(v[0].equipArg.updateTime)}})
                }
                
            },
            milliTime(data){
              let time=(new Date()-data)/(1000 * 60 * 60 * 24)>1?(new Date()-data)/(1000 * 60 * 60 * 24):1
              return time;
            },
            fetchData(){
                inKeepEquips().then(res=>{
                   this.fixData(res.content)
                })
            },
            changePage(page) {
            this.paginator.page = page;
            },
            init(){
                this.listData=[{
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
      this.fetchData()
      if(this.listData.length==0){
          this.init()
      }
  },
  components: {
    myHeader,
            textInput,
            defineInput,
            baseButton,
            dateSelect,
            bosTabs,
            entityInput,
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
