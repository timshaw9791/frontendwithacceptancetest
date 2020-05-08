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
                <base-button label="添加大类" size="mini" @click="dialogShow('add','genres')"></base-button>
                <base-button label="编辑大类" size="mini" @click="dialogShow('edit','genres')"></base-button>
                <base-button label="删除大类" size="mini" @click="deleteShow('genres')"></base-button>
            </div>
            <div  slot="slot2" class="safety-body-top">
                <div class="safety-body-t" v-if="show=='unassigned'">
                    <div style="float:left">{{this.title}}</div>
                    <div style="float:right">
                        <base-button label="装备分类" size="mini" @click="dialogShow('unassigned')"></base-button>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='genres'">
                    <div style="float:left">装备大类：{{this.title}}</div>
                    <div style="float:right">
                        <base-button label="添加小类" size="mini" @click="dialogShow('add','category')"></base-button>
                        <base-button label="编辑小类" size="mini" @click="dialogShow('edit','category')"></base-button>
                        <base-button :label="editFlag?'取消编辑':'编辑库存'" size="mini" @click="editFlag?editStock():editFlag=!editFlag"></base-button>
                    </div>
                </div>
                <div style="safety-body-t" v-else-if="show=='category'">
                    <div style="float:left">装备小类：{{this.title}}</div>
                    <div style="float:left;margin-left:120px">装备总数：{{this.total}}</div>
                    <div-tmp></div-tmp>
                    <div style="float:left;margin-left:120px">安全库存：-</div>
                </div>
                <div style="width:95%">
                    <define-table v-if="show=='unassigned'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column columnType="selection"></define-column>
                        <define-column label="装备参数" field="describes" v-slot="{data}">
                            <entity-input v-model="data.row.equipArg"  format="{name}({model})" :detailParam="data.row.equipArg" :tableEdit="false" :options="{detail: 'equipArgsDetail'}"></entity-input>
                        </define-column>
                        <define-column label="装备数量" field="count"></define-column>
                    </define-table>
                    <define-table v-if="show=='genres'" :pageInfo="paginator" @changePage="changePage"
                                    :data="equipArg" height="3.6042rem" @changeCurrent="changeCurrent">
                        <define-column label="操作" v-slot="{data}">
                            <base-button label="删除" size="mini" @click="deleteShow('category',data)"></base-button>
                        </define-column>
                        <define-column label="装备小类" field="name"></define-column>
                        <define-column label="装备数量" field="count"></define-column>
                        <define-column label="安全库存" field="stock" v-slot="{data}">
                            <define-input v-model="data.row.stock" :disabled="!editFlag"></define-input>
                        </define-column>
                    </define-table>
                    <define-table v-if="show=='category'" :pageInfo="paginator" @changePage="changePage" :data="equipArg" height="3.6042rem" >
                        <define-column label="操作" v-slot="{data}">
                            <base-button label="删除" size="mini" @click="noAssigned(data)"></base-button>
                        </define-column>
                        <define-column label="装备参数" field="describes" v-slot="{data}">
                            <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{detail: 'equipArgsDetail'}"></entity-input>
                        </define-column>
                        <define-column label="装备数量" field="count"></define-column>
                    </define-table>
                </div>
            </div>
         </bos-tabs>
         <service-dialog title="提示" ref="deleteDialog" width="3.3021rem" @confirm="submit" :secondary="false">
            <div>确定删除该{{dialogData.deleteTitle}}吗？</div>
        </service-dialog>
         <safety-dialog ref="safetyDialogs" :addData="dialogData.addData" :title="dialogData.title" :editData="dialogData.editData"></safety-dialog>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import safetyDialog from "./safetyDialog"
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import defineTree from "@/componentized/defineTree"
    import { getgenresList, getcategories, getequipArg, deletegenre, deletecategories, getcategoriesSafety, noAssigned, setsafety} from "api/safety";
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
                    children:'children'
                },
                title:"未分配装备",
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                show:"unassigned",
                equipArg:[],
                search:"",
                total:0,
                dialogData:{
                    editData:{},
                    addData:{},
                    deleteTitle:"大类"
                },
                choseGenre:{},
                choseCategory:{},
                Assigned:{
                    categoryId:"",
                    equipArgId:"",
                    flag:false
                },
                editFlag:false
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
                            name:"未分配装备",
                            show:"unassigned",
                            children:[]
                        }]
                        this.tree.categories.forEach(item=>{
                            this.tree.treeData.push(item)
                        })
                        this.clickNode({data:this.tree.treeData[0]})
                    })
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            changeCurrent(data){
                this.choseCategory = data.current
                console.log("this.choseCategory",this.choseCategory)
            },
            submit(){//确定删除大小类
                if(this.dialogData.deleteTitle == "大类"){
                    deletegenre(this.dialogData.deleteId).then(res=>{
                        this.fetchData()
                        this.$refs.deleteDialog.hide()
                    })
                }else if(this.dialogData.deleteTitle == "小类"){
                    deletecategories(this.dialogData.deleteId).then(res=>{
                        this.fetchData()
                        this.$refs.deleteDialog.hide()
                    })
                }
            },
            deleteShow(data,row){
                if(data == "genres"){
                    this.dialogData.deleteTitle = "大类"
                    if(JSON.stringify(this.choseGenre)=='{}'){
                        this.$message.error("请选择大类")
                        return
                    }
                    this.dialogData.deleteId =this.choseGenre.id
                }else if(data == 'category'){
                    this.dialogData.deleteTitle = "小类"
                    this.dialogData.deleteId = row.row.category.id
                }
                this.$refs.deleteDialog.show()
                
            },
            editStock(){
                this.editFlag = !this.editFlag
                console.log("editStock");
                console.log("this.equipArg",this.equipArg);
                setsafety(this.equipArg).then(res=>{
                    this.fetchData()
                })
            },
            clickNode(data) {//树形点击事件
                console.log("data",data);
                this.choseCategory={}
                this.show = data.data.show
                this.title = data.data.name
                if(this.show=="genres"){
                    this.choseGenre = data.data
                    getcategories(data.data.id).then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="unassigned"){
                    getequipArg().then(res=>{
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }else if(this.show=="category"){
                    this.Assigned.categoryId = data.data.id
                    console.log("this.Assigned.categoryid",this.Assigned.categoryid);
                    getequipArg({id:data.data.id}).then(res=>{
                        console.log("res",res);
                        this.equipArg = res
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }
            },
            dialogShow(type, data){//新增，编辑，装备分配窗口
                if(type == "edit"){
                    this.dialogData.addData={}
                    if(data == "genres"){
                        if(JSON.stringify(this.choseGenre)=='{}'){
                            this.$message.error("请选择大类")
                            return
                        }
                        this.dialogData.editData = this.choseGenre
                        this.dialogData.title = "编辑大类"
                    }else if(data == "category"){
                        if(JSON.stringify(this.choseCategory)=='{}'){
                            this.$message.error("请选择小类")
                            return
                        }
                        this.dialogData.editData = this.choseCategory
                        this.dialogData.title = "编辑小类"
                    }
                }else if(type == "add"){
                    this.dialogData.addData={}
                    this.dialogData.editData={}
                    if(data == "genres"){
                        this.dialogData.title = "新增大类"
                    }else if(data == "category"){
                        this.dialogData.addData = this.choseGenre
                        this.dialogData.title = "新增小类"
                    }
                }else if(type == "unassigned"){
                    this.dialogData.title = "装备分配"
                }
                this.$refs.safetyDialogs.titleShow()
            },
            noAssigned(data){//装备参数与小类解绑
                console.log("data.row",data.row);
                this.Assigned.equipArgId = data.row.equipArg.id
                noAssigned(this.Assigned).then(res=>{
                    this.fetchData()
                })
            },
            async getTree(){//树形数据结构
                for(let i in this.tree.genres){
                    this.tree.genres[i].show = "genres"
                    this.tree.categories=this.tree.genres
                    this.tree.categories[i].children=[]
                    await getcategories(this.tree.genres[i].id).then(res=>{
                        let categories = res
                        categories.forEach(item=>{
                            item.show="category"
                            this.tree.categories[i].children.push(item)
                        })
                    })
                }
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
            defineTree,
            safetyDialog
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
