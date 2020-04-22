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
                            <define-column label="装备序号" width="100" fixed  v-slot="{ data }">
                                <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备名称" width="200" fixed v-slot="{ data }">
                                <define-input v-model="data.row.name"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="装备型号" fixed v-slot="{ data }">
                                <define-input v-model="data.row.model" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="质保期(天)" >
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="充电周期(天)" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="保养周期(天)" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="供应商" width="200" v-slot="{ data }">
                                <define-input v-model="data.row.supplier.name"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="联系人" width="100" v-slot="{ data }">
                                <define-input v-model="data.row.supplier.person"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="联系方式" width="150" v-slot="{ data }">
                                <define-input v-model="data.row.supplier.phone"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="生产日期" width="200" :filter="(row)=>$filterTime(row.supplier.createTime)">
                                
                            </define-column>
                            <define-column label="单价" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            

                        </define-table>
            <equip-allocation v-if="inAllocation"></equip-allocation>
            <service-dialog title="编辑装备信息" ref="historyDialog" :button="false" :secondary="false">
            <div class="edit-equip">
                <div class="equip-params">
                    <text-input label="装备名称" v-model="editList.name" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="装备型号" v-model="editList.model" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="质保期(天)" v-model='editList.shelfLife' :disabled="false" column="6" class="left-param" ></text-input>
                    <text-input label="充电周期(天)" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="保养周期(天)" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="供应商" v-model="editList.supplier.name" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="RFID"  v-model="editList.rfid"  :disabled="true" column="6" class="left-param"></text-input>
                    <text-input label="装备序号" v-model="editList.serial" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="装备位置" v-model="editList.location" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="装备单价" v-model="editList.money" :disabled="false" column="6" class="left-param"></text-input>
                    <text-input label="生产日期" :disabled="false" column="6" class="left-param"></text-input>
                </div>
              <div class="img-box">
                   <imgUp @success="successUp" :disabled="edit"
                                    upload="true" noimg></imgUp>
              </div>
              <div class="btn-box">
                  <base-button label="取消" align="right" :width="128" :height="25" :fontSize="20" ></base-button>
                  <base-button label="提交" align="right" :width="128" :height="25" :fontSize="20" ></base-button>
               
              </div>
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
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import imgUp from 'components/base/axiosImgUp';
    import equipAllocation from './equipAllocation'
    import serviceDialog from 'components/base/serviceDialog/index'
    import { equipArgsByNameModel,equipById } from 'api/storage'
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
            serviceDialog,
            imgUp,
            equipAllocation
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
                },
                {
                id: "3",
                rfid:'12565789',
                updateTime: 1586480773257,
                createTime: 1586480772441,
                name: "test_金属手铐",
                model: "gssk",
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
                alphabetic: "JSSK",
                image: "",
                pdf: null,
                video: null,
                categoryId: "1"
                },
                {
                id: "4",
                rfid:'12565789',
                updateTime: 1586480773257,
                createTime: 1586480772441,
                name: "test_塑料手铐",
                model: "slsk",
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
                alphabetic: "SLSK",
                image: "",
                pdf: null,
                video: null,
                categoryId: "2"
                },
                {
                id: "2",
                updateTime: 1586480773257,
                createTime: 1586480772440,
                name: "test_T型警棍",
                rfid:'12565789',
                model: "txjg",
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
                alphabetic: "XJG",
                image: "",
                pdf: null,
                video: null,
                categoryId: "1"
                },
               ],
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
               inAllocation:false
            }
        },
        methods:{
            getList() {
            // equipArgsByNameModel().then(res => {
            //     this.list = res.content;
            // })
             },
            edit(data){
                this.editList=JSON.parse(JSON.stringify(data))
                console.log(this.editList);
                this.$refs.historyDialog.show()
            },
            selRow(){

            },
            sumFunc(){

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
                return day=1+'天';
            }else {
                return day+'天'
            }
            },
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
        border: 1px solid black;
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
        // height: 150px;
        float: left;
        margin-left: 30px;
        border: 1px solid black;
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
        border: 1px solid black;
        // float: left;
    }
</style>