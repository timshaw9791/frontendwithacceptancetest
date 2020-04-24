<template>
    <div class="opening-box">
        <my-header title="装备实体" :haveBlack="inAllocation||isEdit" @h_black="black"></my-header>
        <div class="btn_box" v-if="!inAllocation&&!isEdit">
             <base-button label="装备分配" align="right" :width="128" :height="25" :fontSize="20" @click="toAllocation"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changeCurrent="selRow"  :haveIndex="false" v-if="inList">
                            <define-column label="序号" fixed columnType="index" width="65"></define-column>
                            <define-column label="操作" width="100" v-slot="{ data }" fixed>
                                <span @click="edit(data.row)">编辑</span>
                            </define-column>
                            <!-- <define-column label="图片" fixed v-slot="{ data }">
                               <img :src="data.row.image" alt="暂无图片">
                            </define-column> -->
                            <define-column label="RFID" fixed width="200" v-slot="{ data }">
                                <define-input v-model="data.row.rfid" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备序号" field="serial" width="100" fixed/>
                            <define-column label="装备名称" width="200" field="equipArg.name" fixed />
                            <define-column label="装备型号" field="equipArg.model" fixed />
                            <define-column label="质保期(天)" :filter="(row)=>milliToDay(row.productDate)"/>
                            <define-column label="充电周期(天)"  :filter="(row)=>milliToDay(row.equipArg.chargeCycle)"/>
                            <define-column label="保养周期(天)" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)"/>
                            <define-column label="供应商" field="equipArg.supplier.name" width="200" />
                            <define-column label="联系人" width="100" field="equipArg.supplier.person" />
                            <define-column label="联系方式" width="150" field="equipArg.supplier.phone"/>
                            <define-column label="生产日期" width="200" :filter="(row)=>$filterTime(row.createTime)"/>
                            <define-column label="单价" field="price"/>
                            
                        </define-table>
            <equip-allocation v-if="inAllocation"></equip-allocation>
            <equipment-edit v-if="isEdit" @cancel="cancel" :editList="editList" ></equipment-edit>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import imgUp from 'components/base/axiosImgUp';
    import equipAllocation from './equipAllocation'
    import equipmentEdit from './equipmentEdit'
    import serviceDialog from 'components/base/serviceDialog/index'
    import equipLocationSelect from '../equipment/equipLocationSelect'
    import { equipsAll,equipById} from 'api/storage'
export default {
    components:{
            myHeader,
            textInput,
            defineInput,
            baseButton,
            dateSelect,
            entityInput,
            bosTabs,
            serviceDialog,
            imgUp,
            equipAllocation,
            equipLocationSelect,
            equipmentEdit
        },
        data(){
            return{
               list:[],
               newLocation:'',
               editList:{},
               search:'',
               inAllocation:false,
               copyList:'',
               isEdit:false,
               inList:true
            }
        },
        methods:{
            getList() {
            equipsAll().then(res => {
                this.list = res.content;
            })
             },
            edit(data){
                this.copyList=data
                data.equipArg.shelfLife=this.milliToDay( data.equipArg.shelfLife)
                this.editList=JSON.parse(JSON.stringify(data))
                this.isEdit=true
                this.inList=false
            },
            selRow(){

            },
            sumFunc(){

            },
            black(){
                // console.log(触发);
            this.isEdit=this.isEdit?!this.isEdit:this.isEdit
            this.inAllocation=this.inAllocation?!this.inAllocation:this.inAllocation
            this.inList=this.inList?this.inList:!this.inList
            },
            cancel(){
            this.isEdit=this.isEdit?!this.isEdit:this.isEdit
            this.inAllocation=this.inAllocation?!this.inAllocation:this.inAllocation
            this.inList=this.inList?this.inList:!this.inList
            },
            confirm(){
                if(this.isEdit){
                    this.$refs.historyDialog.hide()
                }else{
                    this.editList.location=this.newLocation
                    this.isEdit=!this.isEdit
                }
            },
            current(data){
                this.newLocation=data.name
            },
            toAllocation(){
                this.inAllocation=true
                this.inList=false
            },
            successUp(data) {
                // this.form.imageAddress = data;
            },
            milliToDay(data) {
            let date = JSON.parse(JSON.stringify(data));
            let day = Math.round(date / 24 / 60 / 60 / 1000);
            if(day<1){
                return day=1;
            }else {
                return day
            }
            },
            getTime(nS) {
            var date=new Date(parseInt(nS));
            var year=date.getFullYear();
            var mon = date.getMonth()+1;
            var day = date.getDate();
            // var hours = date.getHours();
            // var minu = date.getMinutes();
            // var sec = date.getSeconds();
            return year+'/'+mon+'/'+day;
            },
            selectLocation(){
                this.isEdit=false
            }

        },
         created() {
            this.getList();
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    overflow:auto;
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .btn_box{
    height:45px;
    display: flex;
    justify-content: flex-end;
    align-items : center; 
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
}
.edit-equip{
    height: 500px;
    width: 5.625rem;
    .equip-params{
        width:3.5rem;
        height: 400px;
        float: left;
        .left-param{
            margin-top: 15px;
        }
        .right-param{
            float: right;
            width:300px;
        }
    }
    .img-box{
        width: 200px;
        float: left;
        margin-left: 30px;
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

</style>