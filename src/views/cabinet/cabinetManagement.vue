<template>
    <div class="opening-box">
        <my-header title="警柜管理" :haveBlack="false"></my-header>
        <div class="btn_box">
             <base-button label="一键开柜" align="right" :width="128" :height="25" :fontSize="20" @click="show"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="4rem" @changeCurrent="selRow">
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
                                <define-input v-model="data.row.policeCabinetUserItems.user" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
            <service-dialog title="警柜分配" ref="historyDialog" :button="false" :secondary="false">
            <div class="edit-equip">
                <base-select label="警柜类型" :column="6" v-model="select.selected" align="left" :selectList="select.selectList"></base-select>
                <entity-input label="装备位置" v-model="location" :column="6"  :options="{search:'locationSelect'}" format="{name}" :tableEdit="true" align="left"></entity-input>
                <entity-input v-model="people"  :options="{search:'applicant'}" :column="6" format="{name}" :tableEdit="true" ></entity-input>
                <!-- <div class="btn-box">
                  <base-button label="取消" align="right" :width="128" :height="25" :fontSize="20" @click="cancel"></base-button>
                  <base-button label="提交" align="right" :width="128" :height="25" :fontSize="20" @click="confirm"></base-button>
              </div> -->
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
    import equipLocationSelect from '../equipment/equipLocationSelect'
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
            equipLocationSelect,
            serviceDialog
        },
        data(){
            return{
               list:[],
               select:{
                   selected:'',
                   selectList:[{
                        label: "单警柜",
                        value: 'POLICE_CABINET'
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
               people:'',
               location:''
            }
        },
        methods:{
            toAssign(){
                console.log("触发");
                this.$refs.historyDialog.show()
            },
            openCabniet(){

            },
            confirm(){
            // assignPeople({category:select.selected,policeCabinetId:people.})
            },
            getList()
            {
                getPoliceCabinets().then(res=>{
                    this.list=res
                    this.list.forEach(item=>{
                        if(item.category=='SPARE')
                        {item.category='备用柜'}
                        else if(item.category=='POLICE_CABINET')
                        {
                            item.category='单警柜'
                        }
                        else if(item.category=='COMMON'){
                            item.category='公共柜'}
                    })
                })
            },
            show(){
                this.$refs.historyDialog.show()
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
        // width: 800px;
        height: 50px;
        margin-left:20px;
        margin-top: 15px;
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
}
.edit-equip{
    height: 400px;
    width:400px;
    border: 1px solid rgba(112, 112, 112, 0.13);
    margin-left:100px;
    
}
</style>