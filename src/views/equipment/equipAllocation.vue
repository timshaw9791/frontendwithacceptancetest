<template>
    <div class="equip-allocation-container">
          <my-header :title="$route.meta.title" :haveBlack="true" @h_black="cancel"></my-header>
        <div class="equip-allocation-body">
           <bos-tabs :option="['contrast']" :layoutRatio="[2,3]" :contrastKey="['slot1', 'slot2']">
               <template slot="slotHeader">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
            <define-table :data="list" slot="slot1" height="4rem" @changeCurrent="selRow" :havePage="false"  >
                            <define-column label="操作" width="150" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)" ></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="位置修改" width="400" v-slot="{ data }">
                                 <entity-input v-model="data.row.location" :column="3" :options="{search:'locationSelect'}" :formatFunc="$formatFuncLoc" :tableEdit="true" ></entity-input>
                            </define-column>
                            <define-column label="装备数量" width="100"  v-slot="{ data }">
                                <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
            <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="list[findIndex].equipList" height="4rem" >
                <define-column label="RFID"  v-slot="{data}">
                    <define-input v-model="data.row.rfid"  :tableEdit="false" ></define-input>
                </define-column>
                <define-column label="装备序号"  v-slot="{data}">
                    <define-input v-model="data.row.serial" :tableEdit="false" ></define-input>
                </define-column>
                <define-column label="装备参数" v-slot="{data}">
                    <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                </define-column>
                <define-column label="原位置" v-slot="{data}">
                    <entity-input v-model="data.row.location" :formatFunc="$formatFuncLoc" :tableEdit="false" :options="{}"></entity-input>
                </define-column>
                <define-column label="操作" width="100" v-slot="{data}">
                    <base-button label="删除" size="mini" @click="deleteColumn(data)"></base-button>
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
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import { findByRfids,locationChangeOrders} from "api/storage"
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
            bosTabs
        },
        data(){
            return{
               list:[{location:'',count:0,equipList:[]}],
               findIndex:0,
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
            }
        },
        methods:{
            selRow(data){
                this.findIndex=data.index
            },
            sumFunc(){

            },
            getList(){
                
            },
            deleteColumn(data){
                this.list[this.findIndex].equipList.splice(data.$index,1)
                this.list[this.findIndex].count--
            },
            confirm(){
                let req={
                    locationChangeItems:[],
                    operatorInfo:{
                        operator:JSON.parse(localStorage.getItem('user')).name,
                        operatorId:JSON.parse(localStorage.getItem('user')).id
                    }
                }
                this.list.forEach(item=>{
                    item.equipList.forEach(it=>{
                        console.log(item);
                        req.locationChangeItems.push({cabinetUserName:it.policeCabinet?it.policeCabinet.name:'',locationInfo:it.location,
                        location:item.location,equipArgId:it.equipArg.id,equipId:it.id,equipModel:it.equipArg.model,equipModelName:it.equipArg.name,
                        equipSerial:item.serial,rfid:item.rfid,supplierId:it.equipArg.supplier.id,supplierName:it.equipArg.supplier.name
                        })
                    })
                })
                console.log(req);
                locationChangeOrders(req).then(res=>{
                    this.cancel()
                })
            },
            readData(){
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                    if(this.list[this.findIndex].location!=''){
                     findByRfids(item).then(res=>{
                            if(this._.findIndex(this.list[this.findIndex].equipList,['rfid',res[0].rfid])==-1){
                                this.list[this.findIndex].equipList.push(res[0])
                                this.list[this.findIndex].count++
                            }
                    })
                }else{
                             this.$message.error('请先选择位置信息')
                         }
                    }, (fail) => {
                        this.index = 1;
                        this.$message.error(fail);
                    }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
            },
            changeRow(state,data){
                state?this.list.push({location:'',count:0,equipList:[]}):this.list.splice(data.$index,1)
                if(this.list.length==0){
                    this.list=[{location:'',count:0,equipList:[]}]
                }
            },
            cancel(){
                this.$router.back()
            },
            changePage(page) {
            this.paginator.page = page;
            }
        },
        created(){
            this.getList()
        }
}
</script>
<style lang="scss" scoped>
.equip-allocation-container{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .btn_box{
    height:30px;
    border-top:1px solid rgba(112, 112, 112, 0.13);
    border-bottom:1px solid rgba(112, 112, 112, 0.13);
    }
    .equip-allocation-body
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

</style>