<template>
  <div class="maintenance-form-container">
       <my-header :title="$route.meta.title" :haveBlack="true" @h_black="cancel"></my-header>
       <div class="maintenance-form-top" data-test="maintenance-form-top">
                <define-input label="单号" v-model="listData.number" placeholder="--" :disabled="true" class="odd-number"></define-input>
                <define-input label="报废类型" v-model="listData.category" placeholder="到期报废" :disabled="true" class="odd-number"></define-input>
                <date-select label="报废时间" v-model="listData.createTime" placeholder="--" :disabled="true"></date-select>
                <entity-input label="操作人员" v-model="listData.operatorInfo.operator"  :disabled="true" ></entity-input>
            </div>
        <define-input label="备注" margin="15px 15px" v-model="listData.remark" style="margin-top:15px" :disabled="true" ></define-input>
    
    <div class="maintenance-form-body">
        <bos-tabs >
                        <define-table :data="newData" height="2.8646rem" :havePage="false" @changeCurrent="selRow"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{detail:'equipArgsDetails'}" format="{equipName}({equipModel})" :tableEdit="false" ></entity-input>
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
    import { getInhouseNumber,inHouse,findByRfids,outHouse} from "api/storage"
    import divTmp from '@/componentized/divTmp'
    import { equipScrap} from "api/operation"
    import { maturityScrap,equipById} from 'api/storage'
    import {getBosEntity} from "api/basic"
var _ = require("lodash");
export default {
  name: "maintenance",
  data() {
    return {
        listData:[],
        paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
        findIndex:0,
        newData:[{
            equipArg:'',
            count:0,
            copyList:[{rfid:'',serial:''}]
        }],
        list:[],
    }
  },
  methods: {
           selRow(current){
               this.findIndex=current.index
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
            fetchData(id){
                getBosEntity(id).then(res=>{
                    this.listData=res
                    if(this.listData.category==0)this.listData.category='维修报废'
                    if(this.listData.category==1)this.listData.category='到期报废'
                    if(this.listData.category==2)this.listData.category='盘点报废'
                    if(this.listData.category==3)this.listData.category='常规报废'
                    this.classDataify(res.scrapItems)
                })
            },
           classDataify(data)//读写器数据处理的方法
            {
                data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipModel}${item.equipName}`)
                this.newData=this._.map(cList,(v,k)=>{return {equipArg:v[0],copyList:v,count:v.length}})
            },

    },
  created() {
      this.fetchData(this.$route.query.id)
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
    .maintenance-form-top{
        margin-top:15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
  }
  .maintenance-form-top {
    padding: 18px 7px;
    // border-bottom: 1px solid #ebeef5;
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
