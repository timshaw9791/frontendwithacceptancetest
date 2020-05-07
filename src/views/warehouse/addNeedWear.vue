<template>
  <div class="need-wear-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <define-input v-model="title" label="必戴装备名称"></define-input>
    <div class="need-wear-body" >
            <define-table :data="listData" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  :showSummary="true" :summaryFunc="sumFunc">
                             <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <entity-input v-model="data.row.equipArg"  :options="{search:'equipArgsSelect'}" format="{equipName}({equipModel})" :column="12" :tableEdit="true" ></entity-input>
                            </define-column>
                        </define-table>    
            <div class="btn-box">
                  <base-button label="取消" align="right" :width="128" :height="25" :fontSize="20" @click="cancel"></base-button>
                  <base-button label="提交" align="right" :width="128" :height="25" :fontSize="20" @click="confirm"></base-button>
              </div>      
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import { addWearRates} from "api/operation";
    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
               listData:[{equipArg:''},{equipArg:''}],
               title:''
            };
        },
        methods: {
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            confirm(){
                let equipArg=[]
                this.listData.forEach(item=>{
                    if(item.equipArg!=''){
                        equipArg.push(item.equipArg)
                    }
                })
                addWearRates({name:this.title,equipArgs:equipArg}).then(res=>{
                    
                })
            },
            cancel(){
                this.$router.back()
            },
            changeCurrent(current){
                this.equipArg = current.equipArgItems
            },
        },
        components: {
            myHeader,
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
        },
    };
</script>

<style lang="scss" scoped>
  .need-wear-container {
    font-size: 16px;
  }
  .need-wear-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .need-wear-body {
    padding: 0 7px;
    widows: 100%;
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
