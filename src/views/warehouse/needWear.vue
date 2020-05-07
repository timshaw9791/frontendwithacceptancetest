<template>
  <div class="need-wear-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="need-wear-top">
        <base-button size="default" align="right" label="新增必戴装备" @click="dialogShow('add')"></base-button>
    </div>
    <div class="need-wear-body" >
         <bos-tabs  :option="['contrast']" :layoutRatio="[3,1]" :contrastKey="['slot1', 'slot2']" >
             <define-table  slot="slot1" :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" 
                            @changeCurrent="changeCurrent">
                <define-column  label="操作"  v-slot="{ data }">
                    <base-button label="编辑" size="mini" @click="dialogShow('edit',data.row)" type="primary"></base-button>
                    <base-button label="删除" size="mini" @click="deleteplan(data.row)" type="primary"></base-button>
                </define-column>
                <define-column label="必戴装备名称" field="name"></define-column>
             </define-table>
             <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="equipArg" height="2.6042rem" >
                <define-column label="装备参数" field="describes" v-slot="{data}">
                    <entity-input v-model="data.row" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                </define-column>
             </define-table>
         </bos-tabs>
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
    import { getWearRates,deleteWearRates} from "api/operation";
    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                params:{page:1,size:10,search:''},
                order: [],
                equipArg:[],
                plan:{
                    name:"",
                    remark:"",
                    equipArgItems:[],
                },
                editflag:false,
            };
        },
        methods: {
            fetchData(){
                getWearRates(this.params).then(res=>{
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    if(this.order!=[]){
                        this.equipArg = this.order[0].equipArgs
                    }else{
                        this.equipArg=[]
                    }
                })
            },
            deleteplan(data){
                deleteWearRates(data.id).then(res=>{
                    this.$message.success("删除成功")
                    this.fetchData()
                })
            },
            changePage(page) {
                this.params.page = page
                this.fetchData()
            },
            changeCurrent(current){
                this.equipArg = current.current.equipArgs
            },
            dialogShow(data,item){
                if(data == "edit"){
                    this.editflag=true
                    this.plan = item
                }
                this.$router.push({
                    name: 'addneedwear',
                    params: {type: 'addneedwear', info: {data:this.plan,edit:this.editflag}}
                })
            },
        },
        created() {
            this.fetchData()
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
</style>
