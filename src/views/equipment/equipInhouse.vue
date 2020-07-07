<template>
<view-container>
        <div class="action_box">
                <define-input label="单号"  :disabled="true" ></define-input>
                <date-select label="入库时间"  :disabled="true"></date-select>
                <entity-input label="入库人员" v-model="people"  :options="{search:'locationSelect'}" format="{name}" :disabled="true" ></entity-input>
            </div>
            <bos-tabs @changeTab="changeTab">
                        <template slot="slotHeader">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
                        <define-table :data="list"  @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true" height="823px" slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjia" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichu" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArgId"  :options="{search:'equipArgsSelect'}" format="{name}({model})" ></entity-input>
                            </define-column>
                            <define-column label="装备位置"  v-slot="{ data }" >
                                <entity-input v-model="data.row.locationId"  :options="{search:'locationSelect'}" :formatFunc="$formatFuncLoc" ></entity-input>
                            </define-column>
                            <define-column label="单价" v-slot="{ data }">
                                <define-input v-model="data.row.price" type="Number" ></define-input>
                            </define-column>
                            <define-column label="生产日期" v-slot="{ data }">
                                <date-select label="生产日期" v-model="data.row.productTime" :column="12" ></date-select>
                            </define-column>
                            <define-column label="装备数量" :filter="(row)=>row.copyList.length"/>
                        </define-table>
                        <define-table :data="list[findIndex].copyList" height="823px" :havePage="false" slot="detail">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjia" ></i>
                                <i class="iconfont iconyichu" @click="changeDetailRow(false,data)"></i>
                            </define-column>
                            <define-column label="RFID" field="rfid"></define-column>
                            <define-column label="装备序号" field="serial"></define-column>
                        </define-table>
                    </bos-tabs>
       <tool-bar>
                <base-button label="取消" type="text" @click="cancel" slot="button"></base-button>
                <base-button label="提交" type="text" @click="confirm" slot="button"></base-button>
              </tool-bar>
        
</view-container>
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
    import { start, startOne, killProcess,handheld } from 'common/js/rfidReader'
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
               list:[{
                    equipArgId: '',
                    locationId: '',
                    price: 0,
                    productTime:'',
                    rfids: [],
                    serial: [],
                    count:0,
                    copyList:[ ],
                }],
               people:'',
               checkList:[],
               requestBody:'',
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
               select: {
                    handWareList: [{
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读写器",
                        value: "reader"
                    }],
                    selected: ""
                },
               pid:'',
               findIndex:0
            }
        },
        methods:{
            selRow(data){
               this.findIndex=data.index
            },
            changeTab(data){
                data.key=="total"?killProcess(this.pid):''
            },
            sumFunc(param) { // 表格合并行计算方法
                let { columns, data } = param, sums = [];
                sums=new Array(columns.length).fill('')
                sums[0]='合计'
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.copyList.length,0)
                return sums;
            },
            cancel(){
                this.$router.back()
            },
            confirm(){
                this.requestBody=JSON.parse(JSON.stringify(this.list))
                console.log(this.requestBody.equipArgId);
                let flag=false
                this.requestBody.map((v,k)=>{
                    console.log(v.equipArgId);
                    if(v.equipArgId==''||v.locationId==''||v.productTime==''||v.rfid==''){
                        this.$message.error('请填写完整')
                        flag=true
                    }
                })
                if(flag){
                    return 
                }
                this.requestBody.forEach(item=>{
                    item.equipArgId=item.equipArgId.id
                    if(item.locationId.location){
                        item.locationId=item.locationId.location.id
                    }else{
                    item.locationId=item.locationId.id
                    }
                    item.copyList.forEach(r=>{
                        item.rfids.push(r.rfid)
                        item.serial.push(r.serial)
                    })
                })
                delete this.requestBody.copyList
                inHouse(this.requestBody).then(res=>{
                    this.$message.success('装备入库成功')
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
            readData(){
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                   this.checkList=[]
                   this.list.map((v,k)=>{v.copyList.filter(it=>{it.rfid==data?this.checkList.push(it.rfid):''})})
                    if(this.checkList.length==0){
                         if(this.list[this.findIndex].copyList.length==1&&this.list[this.findIndex].copyList[0].rfid=='')
                    {
                        this.list[this.findIndex].copyList[0].rfid=data
                    }else{
                        this.list[this.findIndex].copyList.push({rfid:data,serial:''})
                    }
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
                    this.list[this.findIndex].copyList.push({rfid:'',serial:''})
                }else{
                    if(this.list[this.findIndex].copyList.length>1){
                        this.list[this.findIndex].copyList.splice(data.$index, 1)
                        this.list[this.findIndex].count--
                    }
                    else{
                        this.list[this.findIndex].copyList=[{rfid:'',serial:''}]
                    }
                }
                
            },
            changeRow(state,data)
            {
                state?this.list.push({equipArgId: '',locationId: '',price: 0,productTime:'',rfids: [],serial: [],copyList:[]}):this.list.splice(data.$index, 1)
                 if(this.list.length==0){
                    this.list=[{equipArgId: '',locationId: '',price: 0,productTime: '',rfids: [],serial: [],copyList:[],}]
                }
                // if(state)
            },
            init(){
                this.list=[{
                    equipArgId: '',
                    locationId: '',
                    price: 0,
                    productTime: 0,
                    rfids: [],
                    serial: [],
                    copyList:[]
                }]
            }
        },
        watch:{
            'list':{
                deep:true,
                handler(newval){
                    newval.forEach(item=>{
                        let len=0
                        item.copyList.forEach(i=>{
                            if(i.rfid!='')
                            {
                                len++
                            }
                        })
                        item.count=len
                    })
                    
                }
            }
        },
        beforeDestroy(){
            killProcess(this.pid)
        },
        created(){
                this.people=JSON.parse(localStorage.getItem('user')).name
            
        }
}
</script>
<style lang="scss" scoped>
    .action_box{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>