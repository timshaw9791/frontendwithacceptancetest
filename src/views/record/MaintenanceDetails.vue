<template>
    <div class="maintenance-details-container">
          <my-header :title="$route.meta.title" :haveBlack="true" @h_black="cancel"></my-header>
         <div class="maintenance-details-top" >
                <define-input label="单号" v-model="listData.number" :disabled="true"></define-input>
                <date-select label="保养开始时间" v-model="listData.createTime" :disabled="true"></date-select>
                <entity-input label="操作人员" v-model="listData.operatorInfo.operator" format="{name}" :disabled="true" ></entity-input>
            </div>
        <div class="maintenance-details-body">
            <bos-tabs >
                        <define-table :data="newData" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{search:'equipArgsSelect'}" format="{equipName}({equipModel})" :tableEdit="false" ></entity-input>
                            </define-column>
                            <define-column label="装备位置"  v-slot="{ data }" >
                                 <entity-input v-model="data.row.location"  :formatFunc="$formatFuncLoc" :tableEdit="false" ></entity-input>
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
    import {getBosEntity} from "api/basic"
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
               findIndex:0,
               newData:[],
               list:[],
               listData:[]
            }
        },
        methods:{
            selRow(data){
                this.findIndex=data.index
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.count,0)
                return sums;
            },
            fetchData(id){
                getBosEntity(id).then(res=>{
                    this.listData=res
                    this.changeDataFormat(res.equipKeepItems)
                })
            },
            cancel(){
                this.$router.back()
            },
            changeDataFormat(data){
                data.forEach(item=>{this.list.push(item)})
                let cList=this._.groupBy(this.list, item => `${item.equipName}${item.equipModel}${item.categoryEnum}`)
                this.newData=this._.map(cList,(v,k)=>{return {equipArg:v[0],copyList:v,count:v.length,location:v[0].locationInfo}})
            },
        },
        created(){
                console.log(this.$route.query.id);
                this.fetchData(this.$route.query.id)
        }
}
</script>
<style lang="scss" scoped>
.maintenance-details-container{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .maintenance-details-top{
        margin-top:15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .maintenance-details-body
    {
        padding: 0 10px;
        margin-top:15px;
        height:"2.8648rem";
        // border:1px solid rgba(112, 112, 112, 0.13)
    }

}
</style>