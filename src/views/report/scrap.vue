<template>
  <div class="safety-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="safety-body" >
         <bos-tabs  :option="['contrast']" :layoutRatio="[1,3]" :contrastKey="['slot1', 'slot2']" >
            <div slot="slot1"  class="safety-body-top">
                <define-input label="小类" v-model="search"></define-input>
                <base-button label="查询"  size="mini"></base-button>
                <div style="height:80%">
                    <define-tree @clickNode="clickNode" :search="search" :expandAll="false" :accordion="true" :data="tree.treeData" :options="options" @nodeClick="clickNode"></define-tree>
                </div>
                <div style="margin-bottom:2px,border:1px solid black">
                   <checkbox label="仅显示公共库房" v-model="check" ></checkbox>
                </div>
            </div>
            <div  slot="slot2" class="safety-body-top">
                <div class="safety-body-t" v-if="show=='All'">
                    <div style="float:left">{{this.title}}</div>
                    <div style="float:right">
                        <define-input label="小类" v-model="search"></define-input>
                        <base-button label="查询"  size="mini"></base-button>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='genres'">
                    <div style="float:left">装备大类：{{this.title}} 总数：{{addNum(1)}}件 总价：{{addNum(4)}}元 报废件数</div>
                    <div style="float:right">
                        <define-input label="小类" v-model="search"></define-input>
                        <base-button label="查询"  size="mini"></base-button>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='category'">
                    <div style="float:left">装备小类：{{this.title}} 总数：{{addNum(1)}}件 总价：{{addNum(4)}}元 报废件数</div>
                    <div style="float:right">
                        <define-input label="小类" v-model="search"></define-input>
                        <base-button label="查询"  size="mini"></base-button>
                    </div>
                </div>
                <div style="width:95%">
                    <define-table v-if="show=='All'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备大类" field="genre"/>
                        <define-column label="装备总数" field="totalCount"></define-column>
                        <define-column label="装备总价" field="totalPrice"></define-column>
                        <define-column label="报废件数" field="count"></define-column>
                    </define-table>
                    <define-table v-if="show=='genres'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备小类" field="category"/>
                        <define-column label="装备总数" field="totalCount"></define-column>
                        <define-column label="装备总价" field="totalPrice"></define-column>
                        <define-column label="报废件数" field="count"></define-column>
                    </define-table>
                    <define-table v-if="show=='category'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备参数" :filter="(row)=>{return `${row.name}(${row.model})`}"></define-column>
                        <define-column label="装备总数" field="totalCount"></define-column>
                        <define-column label="装备总价" field="totalPrice"></define-column>
                        <define-column label="报废件数" field="count"></define-column>
                        <define-column label="供应商" field="supplier"></define-column>
                    </define-table>
                    <define-table v-if="show=='singlePolice'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备小类" field="cabinet"/>
                        <define-column label="装备总数" field="totalCount"></define-column>
                        <define-column label="装备总价" field="totalPrice"></define-column>
                    </define-table>
                    <define-table v-if="show=='singlePoliceCategory'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备参数" :filter="(row)=>{return `${row.name}(${row.model})`}"></define-column>
                        <define-column label="装备总数" field="totalCount"></define-column>
                        <define-column label="装备总价" field="totalPrice"></define-column>
                        <define-column label="报废件数" field="count"></define-column>
                        <define-column label="供应商" field="supplier"></define-column>
                    </define-table>
                </div>
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
    import {equipmentAmount} from "api/statistics";
    import {allPoliceScrap,allPoliceScrapCategories} from "api/warehouse"
    import {findEquipScrapStatistics} from "api/report"
    import { getgenresList, getcategories, getequipArg, } from "api/safety";
    var _ = require("lodash");
    export default {
        data() {
            return {
                tree:{
                    treeData:[],
                    genres:[],
                    categories:[]
                },
                options:{
                    label:'name',
                    children:'children'
                },
                check:false,
                title:"全部装备",
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
                editflag:false,
                show:"All",
                equipArg:[],
                search:"",
                total:0,
                paramArray:[0,1,2,3],
            };
        },
        methods: {
            fetchData(){
                getgenresList().then(res=>{
                    this.tree.genres = res.content
                    Promise.all([this.getTree()]).then(res=>{
                        console.log(res);
                        console.log("this.tree",this.tree);
                        this.tree.treeData = [{
                            name:"全部",
                            show:"All",
                            children:[]
                        }]
                        this.tree.genres.forEach(item=>{
                            this.tree.treeData.push(item)
                        })
                        this.tree.treeData.push({name:'单警装备',show:'singlePolice',children:[
                            {name:'公共柜装备',id:1,show:'singlePoliceCategory'},{name:'备用柜装备',id:2,show:'singlePoliceCategory'},{name:'单警柜装备',id:0,show:'singlePoliceCategory'}
                        ]})
                    })
                })
                findEquipScrapStatistics({categorys:this.paramArray,level:'ALL'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            addNum(item){
               if(item==1)return this.equipArg.reduce((v,k)=>v+k.totalCount,0)
               if(item==2)return this.equipArg.reduce((v,k)=>v+k.count,0)
               if(item==3)return this.equipArg.reduce((v,k)=>v+k.totalLoss,0)
               if(item==4)return this.equipArg.reduce((v,k)=>v+k.totalPrice,0)
            },
            clickNode(data) {
                console.log("-------------------");
                console.log("data",data);
                var id=data.data.id
                this.show = data.data.show
                this.title = data.data.name
                if(this.show=="genres"){
                    findEquipScrapStatistics({categorys:3,id:data.data.id,level:'GENRE'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="All"){
                    findEquipScrapStatistics({categorys:this.paramArray,level:'ALL'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="category"){
                    console.log("-------------+");
                   findEquipScrapStatistics({categorys:3,id:data.data.id,level:'CATEGORY'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="singlePolice"){
                   allPoliceScrap().then(res=>{
                        this.equipArg = res
                        this.equipArg.forEach(item=>{
                            if(item.cabinet==0)item.cabinet='单警柜装备'
                            if(item.cabinet==1)item.cabinet='公共柜装备'
                            if(item.cabinet==2)item.cabinet='备用柜装备'
                        })
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }
                else if(this.show=="singlePoliceCategory"){
                   allPoliceScrapCategories(id).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }
            },
            async getTree(){
                for(let i in this.tree.genres){
                    this.tree.genres[i].show = "genres"
                    console.log("getTree",this.tree.genres[i].id);
                    this.tree.genres[i].children=[]
                    await getcategories(this.tree.genres[i].id).then(res=>{
                        let categories = res
                        categories.forEach(item=>{
                            item.show="category"
                            this.tree.genres[i].children.push(item)
                        })
                    })
                }

            }
        },
        created() {
            this.fetchData()
        },
        watch: {
        check: {
            handler(newval) {
                if(newval){
                     this.paramArray=[3]
                    this.tree.treeData.pop()
                }else{
                   this.paramArray=[0,1,2,3]
                   this.tree.treeData.push({name:'单警装备',show:'singlePolice',children:[
                            {name:'公共柜装备',id:1,show:'singlePoliceCategory'},{name:'备用柜装备',id:2,show:'singlePoliceCategory'},{name:'单警柜装备',id:0,show:'singlePoliceCategory'}
                        ]})
                }
            },
        },
    },
        components: {
            myHeader,
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
            defineTree,
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
        padding-right: 13px;
        padding-top: 15px;
        color: #2F2F76FF!important;
        align-items: center;
        justify-content: space-between;
        padding-left: 5px;
        color: rgba(112, 112, 112, 1);
  }
  .safety-body-t{
      height: 20px;
      width: 95%;
      align-items: center;
      justify-content: space-between;
  }
</style>
