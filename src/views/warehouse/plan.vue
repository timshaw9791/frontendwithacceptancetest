<template>
  <div class="consumable-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="consumable-form-top">
        <base-button size="default" align="right" label="新增预案" @click="dialogShow('add')"></base-button>
    </div>
    <div class="consumable-form-body" >
         <bos-tabs  :option="['contrast']" :layoutRatio="[4,1]" :contrastKey="['slot1', 'slot2']" >
             <define-table  slot="slot1" :pageInfo="paginator" @changePage="changePage" :data="order" height="2.6042rem" >
                <define-column  label="操作"  v-slot="{ data }">
                    <base-button label="编辑" size="mini" @click="dialogShow('edit',data)" type="primary"></base-button>
                    <base-button label="删除" size="mini" @click="deleteShow()" type="primary"></base-button>
                </define-column>
                <define-column label="预案名称" field="name"></define-column>
                <define-column label="预案描述" field="name"></define-column>
             </define-table>
             <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="order" height="2.6042rem" >
                <define-column label="装备参数" field="describes" v-slot="{data}">
                    <entity-input v-model="data.row.Equip" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
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
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import bosTabs from "@/componentized/table/bosTabs";
    import request from "common/js/request";
    import serviceDialog from "components/base/serviceDialog"
    import { getConsumableList ,addConsumable ,receiveConsumable ,supplementConsumable ,editConsumable} from "api/consumable";
    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
                title:"",
                consumableName:"",
                consumableCount:"",
                consumableDescribes:"",
                consumableMark:"",
                consumableId:"",
                remark:false,//备注显示
                name:true,//耗材名称显示
                describes:true,//耗材描述显示
                disable:true//耗材数量是否可编辑
            };
        },
        methods: {
            getData(){
                
            },
            changePage(page) {
                this.paginator.page = page
                this.getData()
            },
            operating(data,count){
                
            },
            confirm(){
                
            }
        },
        created() {
            this.getData()
        },
        components: {
            myHeader,
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            dateSelect,
            serviceDialog,
        },
    };
</script>

<style lang="scss" scoped>
  .consumable-form-container {
    font-size: 16px;
  }
  .consumable-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .consumable-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
