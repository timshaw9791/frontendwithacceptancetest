<template>
    <div class="opening-box">
        <my-header :title="edit?'警柜分配':'警柜管理'" :haveBlack="edit" @h_black='black'></my-header>
        <div class="btn_box" v-if="!edit">
             <base-button label="一键开柜" align="right" :width="128" :height="25" :fontSize="20" ></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="4rem"  v-if="!edit">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <div class="span-box">
                                     <span @click="toAssign(data.row)">分配</span>
                                     <span @click="opCabniet(data.row)">开柜</span>
                                </div>
                            </define-column>
                            <define-column label="警柜类型" v-slot="{ data }">
                                <define-input v-model="data.row.category" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="警柜编号" v-slot="{ data }">
                                <define-input v-model="data.row.cabinetNumber" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="所属人员" v-slot="{ data }">
                                <define-input v-model="data.row.name" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
           
            <div class="edit-equip" v-if='edit'>
                <base-select label="警柜类型" :column="10" v-model="select.selected" margin="0 0" align="left" :selectList="select.selectList"></base-select>
                <!-- <entity-input label="装备位置" v-model="location" :column="6"  :options="{search:'locationSelect'}" margin="15px 0" format="{cabinetNumber}" :tableEdit="true" align="left"></entity-input> -->
                <entity-input label="所属人员" v-model="people"  :options="{search:'applicant'}"  margin="15px 0" :column="6" format="{name}" :tableEdit="true" v-if="select.selected=='SINGLE_POLICE'"></entity-input>
                <div class="btn-box">
                  <base-button label="取消" align="right" :width="128" :height="25" :fontSize="20" @click="black"></base-button>
                  <base-button label="提交" align="right" :width="128" :height="25" :fontSize="20" @click="confirm"></base-button>
              </div>
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
    import serviceDialog from 'components/base/serviceDialog/index'
    import divTmp from '@/componentized/divTmp'
    import {getPoliceCabinets,assignPeople} from 'api/warehouse'
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
               list:[],
               select:{
                   selected:'',
                   selectList:[{
                        label: "单警柜",
                        value: 'SINGLE_POLICE'
                    }, {
                        label: "公共柜",
                        value: "COMMON"
                    },
                     {
                        label: "备用柜",
                        value: "SPARE"
                    }
                    ]
               },
               edit:false,
               people:'',
               policeCabnietId:''
               
            }
        },
        methods:{
            toAssign(data){
                console.log(data);
                this.select.selected=''
                this.policeCabnietId=data.id
                this.edit=!this.edit
            },
            openCabniet(){

            },
            confirm(){
                // console.log("111");
                let params={
                    category:this.select.selected
                }
            assignPeople({category:this.select.selected,policeCabinetId:this.policeCabnietId,userId:this.people.id}).then(res=>{
                this.$message.success('警柜分配成功')
                this.black()
            }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
            },
            getList()
            {
                getPoliceCabinets().then(res=>{
                    this.list=res
                    this.list.forEach(item=>{
                        if(item.policeCabinetUserItems.length!=0)
                        {
                            item.name=item.policeCabinetUserItems[0].user.name
                        }
                        if(item.category=='SPARE')
                        {item.category='备用柜'}
                        else if(item.category=='SINGLE_POLICE')
                        {
                            item.category='单警柜'
                        }
                        else if(item.category=='COMMON'){
                            item.category='公共柜'}
                    })
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
            },
            black(){
                this.edit=!this.edit
                this.getList()
            }
        },
        created(){
            this.getList()
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    // min-height: 4.4323rem;
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
    .btn-box{
        width: 400px;
        height: 50px;
        margin-left:20px;
        margin-bottom: 15px;
        display: flex;
        justify-content: center;
        align-items : center; 
        // border: 1px solid black;
        // float: left;
    }
    .span-box{
        display:flex;
        justify-content: space-between;
    }
    .edit-equip{
    height: 400px;
    width:400px;
    border: 1px solid rgba(112, 112, 112, 0.13);
    margin:0 auto;
    margin-top: 100px;
    // text-align:center
}
}

</style>