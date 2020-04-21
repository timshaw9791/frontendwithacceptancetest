<template>
    <div class="opening-box">
        <my-header title="警柜管理" :haveBlack="false"></my-header>
        <div class="btn_box">
             <base-button label="一键开柜" align="right" :width="128" :height="25" :fontSize="20" ></base-button>
        </div>
        <div class="data-list">
            <define-table  height="4rem" @changeCurrent="selRow">
                            <define-column label="操作" width="100" >
                                
                            </define-column>
                            <define-column label="警柜类型" v-slot="{ data }">
                                <!-- <entity-input v-model="data.row.equipArg" :options="{}" :disabled="true" format="{name}({model})"></entity-input> -->
                            </define-column>
                            <define-column label="警柜编号" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="所属人员" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                        </define-table>
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
               order:{
                   equips:{

                   }
               } 
            }
        },
        methods:{
            selRow(){

            },
            sumFunc(){

            }
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
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

</style>