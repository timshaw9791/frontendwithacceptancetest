<template>
  <div class="safety-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="safety-body" >
         <bos-tabs  :option="['contrast']" :layoutRatio="[1,3]" :contrastKey="['slot1', 'slot2']" >
            <div slot="slot1"  class="safety-body-top">
                <define-input label="小类" v-model="search"></define-input>
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
                   
                </div>
                <div style="safety-body-t" v-else-if="show=='genres'">
                    <div style="float:left">装备大类：{{this.title}} 当前库存：{{addNum(1)}}件 当前库存总价(￥)：{{addNum(4)}}元 维修数：{{addNum(2)}}件 维修率：{{addNum(3)}}% </div>
                    <div style="float:right">
                        <define-input label="小类" v-model="search2"></define-input>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='category'">
                    <div style="float:left">装备小类：{{this.title}} 当前库存：{{addNum(1)}}件 当前库存总价(￥)：{{addNum(4)}}元 维修数：{{addNum(2)}}件 维修率：{{addNum(3)}}%</div>
                    <div style="float:right">
                        <define-input label="装备参数/供应商" v-model="search2"></define-input>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='singlePoliceCategory'">
                    <div style="float:left">装备大类：{{this.title}} 当前库存：{{addNum(1)}}件 当前库存总价(￥)：{{addNum(4)}}元 维修数：{{addNum(2)}}件 维修率：{{addNum(3)}}% </div>
                    <div style="float:right">
                        <define-input label="装备参数/供应商" v-model="search2"></define-input>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='singlePolice'">
                    <div style="float:left">装备大类：{{this.title}} 当前库存：{{addNum(1)}}件 当前库存总价(￥)：{{addNum(4)}}元 维修数：{{addNum(2)}}件 维修率：{{addNum(3)}}元 </div>
                    <div style="float:right">
                        <define-input label="小类" v-model="search2" ></define-input>
                    </div>
                </div>
                <div style="width:95%">
                    <define-table v-if="show=='All'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备大类" field="genre"/>
                        <define-column label="当前库存" field="totalCount"></define-column>
                        <define-column label="当前库存总价(￥)：" field="totalPrice"></define-column>
                        <define-column label="维修数"  field="count"></define-column>
                        <define-column label="维修率" :filter="(row)=>rate(row)"></define-column>
                    </define-table>
                    <define-table v-if="show=='genres'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备小类" field="category"/>
                        <define-column label="当前库存" field="totalCount"></define-column>
                        <define-column label="当前库存总价(￥)：" field="totalPrice"></define-column>
                        <define-column label="维修数量"  field="count"></define-column>
                        <define-column label="维修率" :filter="(row)=>rate(row)"></define-column>
                    </define-table>
                    <define-table v-if="show=='category'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备参数" :filter="(row)=>{return `${row.name}(${row.model})`}"></define-column>
                        <define-column label="当前库存" field="totalCount"></define-column>
                        <define-column label="当前库存总价(￥)" field="totalPrice"></define-column>
                        <define-column label="维修数量" field="count"></define-column>
                        <define-column label="维修率" :filter="(row)=>rate(row)"></define-column>
                        <define-column label="供应商" field="supplier"></define-column>
                    </define-table>
                     <define-table v-if="show=='singlePolice'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备小类" field="cabinet"/>
                        <define-column label="当前库存" field="totalCount"></define-column>
                        <define-column label="当前库存总价(￥)：" field="totalPrice"></define-column>
                    </define-table>
                    <define-table v-if="show=='singlePoliceCategory'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="装备参数" :filter="(row)=>{return `${row.name}(${row.model})`}"></define-column>
                        <define-column label="当前库存" field="totalCount"></define-column>
                        <define-column label="当前库存总价(￥)：" field="totalPrice"></define-column>
                        <define-column label="维修数" field="count"></define-column>
                        <define-column label="维修率" :filter="(row)=>rate(row)"></define-column>
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
    import {findEquipRepairStatistics} from "api/report"
    import {allPoliceRepair,allPoliceRepairCategories} from "api/warehouse"
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
                id:'',
                search2:'', 
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
                findEquipRepairStatistics({categorys:[0,1,2,3],level:'ALL'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                        this.addPolice()
                    })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            rate(data){
                if(data.totalCount!=0){
                return (data.count/data.totalCount*100).toFixed(2)
                }else {
                    return 0
                }
            },
            addNum(item){
               if(item==1)return this.equipArg.reduce((v,k)=>v+k.totalCount,0)
               if(item==2)return this.equipArg.reduce((v,k)=>v+k.count,0)
               if(item==3)return this.equipArg.reduce((v,k)=>v+k.totalLoss,0)
               if(item==4)return this.equipArg.reduce((v,k)=>v+k.totalPrice,0)
            },
            addPolice(){
                allPoliceRepair().then(res=>{
                    console.log("触发");
                    let tabList={
                        // commonStock:res.reduce((v,k)=>v+k.cabinetStock,0),
                        totalCount:res.reduce((v,k)=>v+k.totalCount,0),
                        count:res.reduce((v,k)=>v+k.count,0),
                        inHouseCount:'--',
                        genre:'单警装备',
                        receiveUseCount:'--',
                        totalLoss:res.reduce((v,k)=>v+k.totalLoss,0),
                        totalPrice:res.reduce((v,k)=>v+k.totalPrice,0)
                    }
                    this.equipArg.push(tabList)
                    })
            },
            clickNode(data) {
                console.log("-------------------");
                console.log("data",data);
                this.id=data.data.id
                this.show = data.data.show
                this.title = data.data.name
                if(this.show=="genres"){
                    findEquipRepairStatistics({categorys:3,id:this.id,level:'GENRE'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="All"){
                    findEquipRepairStatistics({categorys:this.paramArray,level:'ALL'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                        if(!this.check){
                            this.addPolice()
                        }
                    })
                }else if(this.show=="category"){
                   findEquipRepairStatistics({categorys:3,id:this.id,level:'CATEGORY'}).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="singlePolice"){
                   allPoliceRepair().then(res=>{
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
                   allPoliceRepairCategories(this.id).then(res=>{
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

            },
            searchCategory(item){
               if(item=='CATEGORY'||item=='GENRE'){
                   console.log("触发");
                   findEquipRepairStatistics({categorys:3,id:this.id,level:item,search:this.search2}).then(res=>{
                        this.equipArg = res
                        this.equipArg.forEach(item=>{
                            item.equipArgs=`${item.name}(${item.model})`
                        })
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
               }else if(item=='singlePoliceCategory'){
                    allPoliceRepairCategories(this.id,this.search2).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
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
                    this.tree.treeData.pop()
                    this.equipArg.pop()
                }else{
                   this.tree.treeData.push({name:'单警装备',show:'singlePolice',children:[
                            {name:'公共柜装备',id:1,show:'singlePoliceCategory'},{name:'备用柜装备',id:2,show:'singlePoliceCategory'},{name:'单警柜装备',id:0,show:'singlePoliceCategory'}
                        ]})
                    this.addPolice()
                }
            },
        },
        search2:{
            handler(newval){
                console.log("触发");
                if(this.show=='category'||this.show=='genres'){
                    let searchI=''
                    if(this.show=='genres') searchI='GENRE'
                    if(this.show=='category')searchI='CATEGORY'
                     findEquipRepairStatistics({categorys:3,id:this.id,level:searchI,search:newval}).then(res=>{
                        this.equipArg = res
                        this.equipArg.forEach(item=>{
                            item.equipArgs=`${item.name}(${item.model})`
                        })
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=='singlePoliceCategory'){
                     allPoliceRepairCategories(this.id,newval).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }
            }
        }
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
        color: black!important;
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
