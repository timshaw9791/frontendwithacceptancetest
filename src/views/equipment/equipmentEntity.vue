<template>
    <div class="opening-box">
        <my-header title="装备实体" :haveBlack="false"></my-header>
        <div class="btn_box">
             <base-button label="装备分配" align="right" :width="128" :height="25" :fontSize="20" @click="toAllocation"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changeCurrent="selRow"  :haveIndex="false" v-if="!inAllocation">
                            <define-column label="序号" fixed columnType="index" width="65"></define-column>
                            <define-column label="操作" width="100" v-slot="{ data }" fixed>
                                <span @click="edit(data.row)">编辑</span>
                            </define-column>
                            <define-column label="图片" fixed v-slot="{ data }">
                               <img :src="data.row.image" alt="暂无图片">
                            </define-column>
                            <define-column label="RFID" fixed width="200" v-slot="{ data }">
                                <define-input v-model="data.row.rfid" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备序号" field="serial" width="100" fixed/>
                            <define-column label="装备名称" width="200" field="name" fixed />
                            <define-column label="装备型号" field="model" fixed />
                            <define-column label="质保期(天)">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="充电周期(天)" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="保养周期(天)" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="供应商" field="supplier.name" width="200" />
                            <define-column label="联系人" width="100" field="supplier.person" />
                               
                            <define-column label="联系方式" width="150" field="supplier.phone"/>
                               
                            <define-column label="生产日期" width="200" :filter="(row)=>$filterTime(row.supplier.createTime)"/>
                            <define-column label="单价" v-slot="{ data }">
                            </define-column>
                            
                        </define-table>
            <equip-allocation v-if="inAllocation"></equip-allocation>
            <service-dialog :title="isEdit?'编辑装备信息':'选择位置信息'" ref="historyDialog" :button="false" :secondary="false">
            <div class="edit-equip" v-if="isEdit">
                <div class="equip-params">
                    <define-input label="装备名称" v-model="editList.name" :disabled="false" column="6" align="left"/>
                    <define-input label="装备型号" v-model="editList.model" :disabled="false" column="6" align="right"></define-input>
                    <define-input label="质保期(天)" v-model='editList.shelfLife' :disabled="false" column="6" align="left" ></define-input>
                    <define-input label="充电周期(天)" v-model='editList.chargeCycle' :disabled="false" column="6" align="right"></define-input>
                    <define-input label="保养周期(天)" v-model='editList.upkeepCycle' :disabled="false" column="6" align="left"></define-input>
                    <define-input label="供应商" v-model="editList.supplier.name" :disabled="false" column="6" align="right"></define-input>
                    <define-input label="RFID"  v-model="editList.rfid"  :disabled="true" column="6" align="left"></define-input>
                    <define-input label="装备序号" v-model="editList.serial" :disabled="false" column="6" align="right"></define-input>
                    <define-input label="装备位置" v-model="editList.location" :disabled="false" column="6" align="left" @click.native="selectLocation"></define-input>
                    <define-input label="装备单价" v-model="editList.money" :disabled="false" column="6" align="right"></define-input>
                    <date-select label="生产日期" v-model="editList.createTime" column="6" align="left"></date-select>
                </div>
              <div class="img-box">
                   <imgUp @success="successUp" :disabled="edit"
                                    upload="true" noimg></imgUp>
              </div>
            
            </div>
            <div class="location-select" v-if="!isEdit">
                <div class="select-location">
                   <equip-location-select @current="current"></equip-location-select>
                </div>
            </div>
              <div class="btn-box">
                  <base-button label="取消" align="right" :width="128" :height="25" :fontSize="20" @click="cancel"></base-button>
                  <base-button label="提交" align="right" :width="128" :height="25" :fontSize="20" @click="confirm"></base-button>
              </div>
        </service-dialog>
        
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
    import serviceDialog from 'components/base/serviceDialog/index'
    import equipLocationSelect from '../equipment/equipLocationSelect'
    import { equipArgsByNameModel,equipById} from 'api/storage'
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
            equipLocationSelect
        },
        data(){
            return{
               list:[
                   {
                id: "5",
                rfid:'12565789',
                updateTime: 1586480773257,
                createTime: 1586480772441,
                name: "test_防爆盾牌",
                model: "fbdp",
                shelfLife: 31104000000,
                upkeepCycle: 0,
                chargeCycle: 0,
                money:100,
                location:'',
                serial:'123456',
                supplier: {
                id: "1",
                updateTime: 1586480773227,
                createTime: 1586480772422,
                name: "test_华安",
                person: "test_xxx",
                phone: "13922223333"
                },
                alphabetic: "FBDP",
                image: "",
                pdf: null,
                video: null,
                categoryId: "3"
                }
               ],
               newLocation:'',
               editList:{
                updateTime: 1586480773257,
                createTime: 1586480772441,
                name: "test_防爆盾牌",
                rfid:'12565789',
                model: "fbdp",
                money:100,
                location:'',
                serial:'123456',
                shelfLife: 31104000000,
                upkeepCycle: 0,
                chargeCycle: 0,
                supplier: {
                id: "1",
                updateTime: 1586480773227,
                createTime: 1586480772422,
                name: "test_华安",
                person: "test_xxx",
                phone: "13922223333"
                },
                alphabetic: "FBDP",
                image: "",
                pdf: null,
                video: null,
                categoryId: "3"
                },
               search:'',
               inAllocation:false,
               copyList:'',
               isEdit:true,
            }
        },
        methods:{
            getList() {
            // equipArgsByNameModel().then(res => {
            //     this.list = res.content;
            // })
             },
            edit(data){
                this.copyList=JSON.parse(JSON.stringify(data))
                data.shelfLife=this.milliToDay(data.shelfLife)
                // data.createTime=this.getTime(data.createTime)
                this.editList=JSON.parse(JSON.stringify(data))
                // this.eqidList.shelfLife=this.milliToDay(this.eqidList.shelfLife)
                // console.log(this.eqidList.shelfLife);
                this.$refs.historyDialog.show()
            },
            selRow(){

            },
            sumFunc(){

            },
            cancel(){
                if(this.isEdit)
                {
                    this.$refs.historyDialog.hide()
                }else{
                    this.isEdit=!this.isEdit
                }
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