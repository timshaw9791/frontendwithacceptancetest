<template>
    <div class="opening-box">
        <div class="data-list">
            <div class="edit-equip" >
                <div class="equip-params">
                    <define-input label="装备名称" v-model="editList.equipArg.name" :disabled="true" margin="0 0"  column="6" align="left"/>
                    <define-input label="装备型号" v-model="editList.equipArg.model" :disabled="true" margin="0 0" column="6" align="right"></define-input>
                    <define-input label="质保期(天)" v-model='editList.equipArg.shelfLife' margin="15px 0" :toEdit="false" column="6" align="left" ></define-input>
                    <define-input label="充电周期(天)" v-model='editList.equipArg.chargeCycle' margin="15px 0" :disabled="false" column="6" align="right"></define-input>
                    <define-input label="保养周期(天)" v-model='editList.equipArg.upkeepCycle' margin="15px 0" :disabled="false" column="6" align="left"></define-input>
                    <define-input label="供应商" v-model="editList.equipArg.supplier.name" margin="15px 0" :disabled="true" column="6" align="right"></define-input>
                    <define-input label="RFID"  v-model="editList.rfid"  :disabled="true" margin="15px 0" column="6" align="left"></define-input>
                    <define-input label="装备序号" v-model="editList.serial" :disabled="false" margin="15px 0" column="6" align="right"></define-input>
                    <entity-input label="装备位置" v-model="editList.location.id" column="6" margin="0 0" :options="{search:'locationSelect'}" format="{name}" :tableEdit="true" align="left"></entity-input>
                    <define-input label="装备单价" v-model="editList.price" :disabled="false" margin="15px 0" column="6" align="right"></define-input>
                    <date-select  label="生产日期" v-model="editList.createTime" column="6" margin="15px 0" align="left"></date-select>
                </div>
              <div class="img-box">
                   <imgUp @success="successUp" :disabled="edit" :image="editList.equipArg.image"
                                    upload="true" ></imgUp>
              </div>
              
        </div>
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
    import imgUp from 'components/base/axiosImgUp';
    import { getInhouseNumber,equipsToNew} from "api/storage"
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
            imgUp
        },
        data(){
            return{
              requestBody:''
            }
        },
        props:{
            editList: {
              type: Object,
              default() {
                return {}
              }
            }
        },
        methods:{
            cancel(){
                this.$emit('cancel')
            },
            confirm(){
                console.log(this.editList);
                equipsToNew(this.editList.id,this.editList).then(res=>{
                    this.cancel()
                })
                // this.requestBody=JSON.parse(JSON.stringify(this.list))
                // this.requestBody.forEach(item=>{
                //     item.equipArgId=item.equipArgId.id
                //     item.locationId=item.locationId.number
                //     item.copyList.forEach(r=>{
                //         item.rfids.push(r.rfid)
                //         item.serial.push(r.serial)
                //     })
                // })
                // delete this.requestBody.copyList
                // inHouse(this.requestBody).then(res=>{
                //     this.$message.success('装备入库成功')
                //     this.init()
                //     this.cancel()
                // })
            },
        },
        created(){
            this.requestBody=JSON.parse(JSON.stringify(this.editList))
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    // min-height: 4.4323rem;

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
.edit-equip{
    height: 400px;
    width:7rem;
    border: 1px solid rgba(112, 112, 112, 0.13);
    margin-left:100px;
    .equip-params{
        width:5rem;
        height: 400px;
        float: left;
    }
    .img-box{
        width: 200px;
        float: left;
        margin-top:50px;
        margin-left: 0.325rem;
    }
    
}
.btn-box{
        width: 4rem;
        height: 50px;
        margin-left:1.25rem;
        margin-top:30px;
        border: 1px solid black;
        display: flex;
        justify-content: flex-end;
        align-items : center; 
    }
</style>