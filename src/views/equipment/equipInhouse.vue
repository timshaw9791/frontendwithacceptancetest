<template>
    <div class="opening-box">
        <my-header title="入库单列表/装备入库"></my-header>
         <div class="action_box" data-test="action_box">
                <define-input label="单号" placeholder="--" :disabled="true" ></define-input>
                <date-select label="入库时间" placeholder="--" :disabled="true"></date-select>
                <entity-input label="入库人员" v-model="people"  :options="{search:'locationSelect'}" format="{name}" :disabled="true" ></entity-input>
            </div>
        <div class="data-list">
            <bos-tabs @changeTab="changeTab">
                        <template slot="slotHeader">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
                        <define-table :data="list" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total" :showSummary="true" :summaryFunc="sumFunc">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArgId"  :options="{search:'equipArgsSelect'}" format="{name}({model})" :tableEdit="true" ></entity-input>
                            </define-column>
                            <define-column label="装备位置"  v-slot="{ data }" >
                                 <entity-input v-model="data.row.locationId"  :options="{search:'locationSelect'}" :formatFunc="$formatFuncLoc" :tableEdit="true" ></entity-input>
                            </define-column>
                            <define-column label="单价" v-slot="{ data }">
                                <define-input v-model="data.row.price" type="Number" ></define-input>
                            </define-column>
                            <define-column label="生产日期" v-slot="{ data }">
                                <date-select label="生产日期" v-model="data.row.productTime" :column="12" ></date-select>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count"  type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                        <define-table :data="list[findIndex].copyList" height="2.8646rem" :havePage="false" slot="detail">
                            <define-column label="操作" width="100" v-slot="{ data }">
                               <i class="iconfont icontianjialiang" @click="changeDetailRow(true,data)"></i>
                               <i class="iconfont iconyichuliang" @click="changeDetailRow(false,data)"></i>
                            </define-column>
                            <define-column label="RFID" v-slot="{ data }">
                                <define-input v-model="data.row.rfid" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备序号" v-slot="{ data }">
                                <define-input v-model="data.row.serial" type="Number" ></define-input>
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
                    productTime:Date.parse(new Date()),
                    rfids: [],
                    serial: [],
                    count:0,
                    copyList:[{rfid:'',serial:''}],
                }],
               people:'',
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
                sums[columns.length-1]=param.data.reduce((v,k)=>v+k.count,0)
                return sums;
            },
            cancel(){
                this.$router.back()
            },
            confirm(){
                this.requestBody=JSON.parse(JSON.stringify(this.list))
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
                    var nelist=this.list[this.findIndex].copyList.filter(function(item){
                        return item.rfid==data
                    })
                    if(nelist.length==0){
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
                }else if(this.list[this.findIndex].copyList.length>1){
                    this.list[this.findIndex].copyList.splice(data.$index, 1)
                    this.list[this.findIndex].count--
                }
                if(this.list[this.findIndex].copyList.length==0){
                    this.list[this.findIndex].copyList=[{rfid:'',serial:''}]
                }
            },
            changeRow(state,data)
            {
                if(state)
                {
                    this.list.push({equipArgId: '',locationId: '',price: 0,productTime: Date.parse(new Date()),rfids: [],serial: [],copyList:[{rfid:'',serial:''}],})
                }else if(this.list.length>1){
                    this.list.splice(data.$index, 1)
                }
                if(this.list.length==0){
                    this.list=[{equipArgId: '',locationId: '',price: 0,productTime: Date.parse(new Date()),rfids: [],serial: [],copyList:[{rfid:'',serial:''}],}]
                }
            },
            init(){
                this.list=[{
                    equipArgId: '',
                    locationId: '',
                    price: 0,
                    productTime: 0,
                    rfids: [],
                    serial: [],
                    copyList:[{rfid:'',serial:''}]
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
        margin-top:15px;
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