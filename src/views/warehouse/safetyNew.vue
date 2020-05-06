<template>
  <div class="safety-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="safety-body" >
         <bos-tabs  :option="['contrast']" :layoutRatio="[1,3]" :contrastKey="['slot1', 'slot2']" >
            <div slot="slot1"  class="safety-body-top">
                <define-input label="小类" v-model="search"></define-input>
                <div style="height:80%">
                    <define-tree @clickNode="clickNode" :data="tree.treeData" :options="options" @nodeClick="clickNode"></define-tree>
                </div>
                <base-button label="添加大类" size="mini"></base-button>
                <base-button label="删除大类" size="mini"></base-button>
                <base-button label="编辑大类" size="mini"></base-button>
            </div>
            <div  slot="slot2" class="safety-body-top">
                <div class="safety-body-t" v-if="show=='unassigned'">
                    <div style="float:left">{{this.title}}</div>
                    <div style="float:right">
                        <base-button label="装备分类"  size="mini"></base-button>
                        <i class="iconfont icontianjialiang"></i>
                        <i class="iconfont icontianjialiang"></i>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='genres'">
                    <div style="float:left">装备大类：{{this.title}}</div>
                    <div style="float:right">
                        <base-button label="添加小类" size="mini"></base-button>
                        <base-button label="编辑小类" size="mini"></base-button>
                        <base-button label="删除小类" size="mini"></base-button>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='category'">
                    <div style="float:left">装备小类：{{this.title}}</div>
                    <div style="float:left">装备总数：{{this.title}}</div>
                    <div style="float:left">安全库存：-</div>
                </div>
                <define-table v-if="show=='unassigned'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                    <define-column columnType="selection"></define-column>
                    <define-column label="装备参数" field="describes" v-slot="{data}">
                        <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                    </define-column>
                    <define-column label="装备数量" field="describes"></define-column>
                </define-table>
                <define-table v-if="show=='genres'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                    <define-column label="操作" field="-"></define-column>
                    <define-column label="装备小类" field="category"></define-column>
                    <define-column label="装备数量" field="count"></define-column>
                    <define-column label="安全库存" field="safety"></define-column>
                </define-table>
                <define-table v-if="show=='category'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                    <define-column columnType="selection"></define-column>
                    <define-column label="装备参数" field="describes" v-slot="{data}">
                        <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                    </define-column>
                    <define-column label="装备数量" field="describes"></define-column>
                </define-table>
            </div>
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
    import defineTree from "@/componentized/defineTree"
    import { getgenresList, getcategoriesList, } from "api/safety";
    var _ = require("lodash");
    export default {
        name: "safety",
        data() {
            return {
                tree:{
                    treeData:[],
                    genres:[],
                    categories:[]
                },
                options:{
                    label:'name',
                    children:[]
                },
                title:"未分配装备",
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
                editflag:false,
                show:"unassigned"
            };
        },
        methods: {
            fetchData(){
                this.tree.treeData = [{
                    name:"未分配装备",
                    show:"unassigned",
                    children:[]
                }]
                console.log("this.tree.treeData",this.tree.treeData);
                getgenresList().then(res=>{
                    this.tree.genres = res.content
                    this.tree.genres.forEach(item=>{
                        item.show = "genres"
                        this.tree.treeData.push(item)
                    })
                })
                getcategoriesList().then(res=>{
                    this.tree.categories = res.content
                })
                console.log("this.tree.categories",this.tree.categories);
                for(let i in this.tree.categories){
                    console.log(this.tree.categories[i]);
                }
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            changeCurrent(current){
                this.equipArg = current.equipArgItems
            },
            clickNode(data) {
                console.log("data",data);
                this.show = data.data.show
                this.title = data.data.name
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
            defineTree
        },
    };
</script>

<style lang="scss" scoped>
  .safety-container {
    font-size: 16px;
  }
  .safety-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .safety-body {
    padding: 0 7px;
    widows: 100%;
  }
  .safety-body-top{
        width: 100%;
        height: 100%;
        background: #F9F9F9;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        padding-right: 3px;
        padding-top: 15px;
        color: #2F2F76FF!important;
        align-items: center;
        justify-content: space-between;
        padding-left: 5px;
        color: rgba(112, 112, 112, 1);
  }
  .safety-body-t{
      height: 20px;
      align-items: center;
      justify-content: space-between;
  }
</style>
