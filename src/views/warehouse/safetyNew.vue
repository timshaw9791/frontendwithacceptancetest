<template>
    <view-container>
        <bos-tabs  :option="['contrast']" :layoutRatio="[25,75]" :contrastKey="['slot1', 'slot2']">
            <div  slot="slot1" class="safety-body-top">
                <define-input label="小类" v-model="search"></define-input>
                <div style="height:85%">
                    <define-tree :search="search" :accordion="true" :expandAll="false" :data="tree.treeData"
                                 :options="options"
                                 @nodeClick="clickNode"></define-tree>
                </div>
                <div style="margin-bottom:2px">
                    <base-button label="添加大类" size="mini" @click="dialogShow('add','genres')"></base-button>
                    <base-button label="编辑大类" size="mini" @click="dialogShow('edit','genres')"></base-button>
                    <base-button label="删除大类" size="mini" @click="deleteShow('genres')"></base-button>
                </div>
            </div>
            <div  slot="slot2" class="safety-body-top">
                <div class="safety-body-t" v-if="show=='unassigned'">
                    <div style="float:left">{{this.title}}</div>
                    <div style="float:right">
                        <base-button label="装备分类" size="mini" @click="dialogShow('unassigned')"></base-button>
                    </div>
                </div>
                <div class="safety-body-t" v-else-if="show=='genres'">
                    <div style="float:left">装备大类：{{this.title}}</div>
                    <div style="float:right">
                        <base-button label="添加小类" size="mini" @click="dialogShow('add','category')"></base-button>
                        <base-button label="编辑小类" size="mini" @click="dialogShow('edit','category')"></base-button>
                        <base-button :label="editFlag?'取消编辑':'编辑库存'" size="mini"
                                     @click="editFlag?editStock():editFlag=!editFlag"></base-button>
                    </div>
                </div>
                <div class="safety-body-t" v-else-if="show=='category'">
                    <div style="float:left">装备小类：{{this.title}}</div>
                    <div style="float:left;margin-left:120px">装备总数：{{this.total}}</div>
                    <div style="float:left;margin-left:120px">安全库存：{{this.safety}}</div>
                </div>
                <div style="width:95%">
                    <define-table v-if="show=='unassigned'" key="unassigned" ref="table" :pageInfo="paginator"
                                  @changePage="changePage" :data="equipArg" height="3.6042rem">
                        <define-column
                                 columnType="selection"></define-column>
                        <define-column label="装备参数" field="describes" v-slot="{data}">
                            <entity-input v-model="data.row.equipArg" format="{name}({model})"
                                          :detailParam="data.row.equipArg" :disabled="false"
                                          :options="{detail: 'equipArgsDetail'}"></entity-input>
                        </define-column>
                        <define-column label="装备数量" field="count"></define-column>
                    </define-table>
                    <define-table v-if="show=='genres'" :pageInfo="paginator" @changePage="changePage"
                                  :data="equipArg" height="3.6042rem" @changeCurrent="changeCurrent">
                        <define-column label="操作" v-slot="{data}">
                            <base-button label="删除" size="mini" @click="deleteShow('category',data)"></base-button>
                        </define-column>
                        <define-column label="装备小类" field="category.name"></define-column>
                        <define-column label="装备数量" field="count"></define-column>
                        <define-column label="安全库存" v-slot="{data}">
                            <define-input v-model="data.row.category.stock" :disabled="!editFlag"></define-input>
                        </define-column>
                    </define-table>
                    <define-table v-if="show=='category'" :pageInfo="paginator" @changePage="changePage"
                                  :data="equipArg"
                                  height="3.6042rem">
                        <define-column label="操作" v-slot="{data}">
                            <base-button label="删除" size="mini" @click="noAssigned(data)"></base-button>
                        </define-column>
                        <define-column label="装备参数" field="describes" v-slot="{data}">
                            <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg"
                                          format="{name}({model})" :disabled="false"
                                          :options="{detail: 'equipArgsDetail'}"></entity-input>
                        </define-column>
                        <define-column label="装备数量" field="count"></define-column>
                    </define-table>
                </div>
            </div>
        </bos-tabs>
        <service-dialog title="提示" ref="deleteDialog" width="3.3021rem" @confirm="submit" :secondary="false">
            <div>确定删除该{{dialogData.deleteTitle}}吗？</div>
        </service-dialog>
        <safety-dialog ref="safetyDialogs" @fetchData="fetchData" :addData="dialogData.addData"
                       :title="dialogData.title" :editData="dialogData.editData"
                       :assignedData="dialogData.assignedData"></safety-dialog>
    </view-container>
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
    import {
        getgenresList,
        getcategories,
        getequipArg,
        deletegenre,
        deletecategories,
        getcategoriesSafety,
        noAssigned,
        setsafety
    } from "api/safety";

    var _ = require("lodash");
    export default {
        name: "safety",
        data() {
            return {
                tree: {//树形的数据
                    treeData: [],
                    genres: [],
                    categories: []
                },
                options: {//树形判断显示和下级
                    label: 'name',
                    children: 'children'
                },
                title: "未分类装备",
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                show: "unassigned",//判断右侧显示的是小类，小类中的装备还是未分配装备
                equipArg: [],//右侧的数据
                search: "",//搜索
                total: 0,//显示小类中装备时的装备总数
                safety: '-',
                dialogData: {//弹框数据
                    editData: {},
                    addData: {},
                    assignedData: [],
                    deleteTitle: "大类",
                    title: ""
                },
                choseGenre: {},//树形内所选择的大类
                choseCategory: {},//表格内所选择的小类
                Assigned: "",//树形内所选择的小类
                editFlag: false//安全库存编辑
            };
        },
        methods: {
            fetchData() {
                getgenresList().then(res => {
                    this.tree.genres = res.content
                    Promise.all([this.getTree()]).then(res => {
                        this.tree.treeData = [{
                            name: "未分类装备",
                            show: "unassigned",
                            children: []
                        }]
                        this.tree.categories.forEach(item => {
                            this.tree.treeData.push(item)
                        })
                        this.clickNode({data: this.tree.treeData[0]})
                    })
                })
            },
            changePage(page) {//表格内的页面转换
                this.paginator.page = page
                if (this.show == "category") {
                    let params = JSON.parse(JSON.stringify(this.paginator))
                    params.id = this.Assigned
                    getequipArg(params).then(res => {
                        this.equipArg = res.content
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                } else if (this.show == "genres") {
                    this.equipArg = [{category: {}, count: ""}]
                    getcategoriesSafety(this.choseGenre.id, this.paginator).then(res => {
                        this.equipArg = res.content
                        if (this.equipArg[0].category == null) {
                            this.equipArg = []
                        }
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                } else if (this.show == "unassigned") {
                    getequipArg(this.paginator).then(res => {
                        this.equipArg = res.content
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }
            },
            changeCurrent(data) {//存储表格内所选择的小类
                this.choseCategory = data.current
            },
            submit() {//确定删除大小类
                if (this.dialogData.deleteTitle == "大类") {
                    deletegenre(this.dialogData.deleteId).then(res => {
                        this.fetchData()
                        this.$refs.deleteDialog.hide()
                    })
                } else if (this.dialogData.deleteTitle == "小类") {
                    deletecategories(this.dialogData.deleteId).then(res => {
                        this.fetchData()
                        this.$refs.deleteDialog.hide()
                    })
                }
            },
            deleteShow(data, row) {//删除大小类的dialog显示
                if (data == "genres") {
                    this.dialogData.deleteTitle = "大类"
                    if (JSON.stringify(this.choseGenre) == '{}') {
                        this.$message.error("请选择大类")
                        return
                    }
                    this.dialogData.deleteId = this.choseGenre.id
                } else if (data == 'category') {
                    this.dialogData.deleteTitle = "小类"
                    this.dialogData.deleteId = row.row.category.id
                }
                this.$refs.deleteDialog.show()
            },
            editStock() {//安全库存编辑后的存储
                let equip = []
                this.equipArg.forEach(item => {
                    equip.push(item.category)
                })
                setsafety(equip).then(res => {
                    this.fetchData()
                    this.editFlag = !this.editFlag
                })
            },
            clickNode(data) {//树形点击事件
                this.paginator = {size: 10, page: 1, totalPages: 5, totalElements: 5},
                    this.choseCategory = {}
                this.show = data.data.show
                this.title = data.data.name
                if (this.show == "genres") {
                    this.equipArg = [{category: {}, count: ""}]
                    this.choseGenre = data.data
                    getcategoriesSafety(data.data.id, this.paginator).then(res => {
                        this.equipArg = res.content
                        if (this.equipArg[0].category == null) {
                            this.equipArg = []
                        }
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                } else if (this.show == "unassigned") {
                    getequipArg(this.paginator).then(res => {
                        this.equipArg = res.content
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                } else if (this.show == "category") {
                    this.total = data.data.count
                    this.safety = data.data.stock
                    this.Assigned = data.data.id
                    let params = JSON.parse(JSON.stringify(this.paginator))
                    params.id = data.data.id
                    getequipArg(params).then(res => {
                        this.equipArg = res.content
                        this.paginator.totalPages = res.totalPages;
                        this.paginator.totalElements = res.totalElements;
                    })
                }
            },
            dialogShow(type, data) {//新增，编辑，装备分类窗口
                if (type == "edit") {
                    this.dialogData.addData = {}
                    if (data == "genres") {
                        if (JSON.stringify(this.choseGenre) == '{}') {
                            this.$message.error("请选择大类")
                            return
                        }
                        this.dialogData.editData = this.choseGenre
                        this.dialogData.title = "编辑大类"
                    } else if (data == "category") {
                        if (JSON.stringify(this.choseCategory) == '{}') {
                            this.$message.error("请选择小类")
                            return
                        }
                        this.dialogData.editData = this.choseCategory.category
                        this.dialogData.title = "编辑小类"
                    }
                } else if (type == "add") {
                    this.dialogData.addData = {}
                    this.dialogData.editData = {}
                    if (data == "genres") {
                        this.dialogData.title = "新增大类"
                    } else if (data == "category") {
                        this.dialogData.addData = this.choseGenre
                        this.dialogData.title = "新增小类"
                    }
                } else if (type == "unassigned") {
                    this.dialogData.title = "装备分类"
                    let list = this.$refs.table.getSelection()
                    if (list.length == 0) {
                        this.$message.error("请选择装备参数")
                        return
                    }
                    let idList = []
                    list.forEach(item => {
                        idList.push(item.equipArg.id)
                    })
                    this.dialogData.assignedData = idList
                }
                this.$refs.safetyDialogs.titleShow()
            },
            noAssigned(data) {//装备参数与小类解绑
                noAssigned(this.Assigned, {equipArgId: data.row.equipArg.id}).then(res => {
                    this.fetchData()
                })
            },
            async getTree() {//树形数据结构
                for (let i in this.tree.genres) {
                    this.tree.genres[i].show = "genres"
                    this.tree.categories = this.tree.genres
                    this.tree.categories[i].children = []
                    await getcategoriesSafety(this.tree.genres[i].id).then(res => {
                        let categories = res.content
                        console.log(res.content);
                        if (categories.length != 0) {
                            if (categories[0].category != null) {
                                categories.forEach(item => {
                                    let temp = JSON.parse(JSON.stringify(item.category))
                                    temp.show = "category"
                                    temp.count = item.count
                                    this.tree.categories[i].children.push(temp)
                                })
                            }
                        }

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

    .safety-body {
        padding: 0 7px;
        widows: 100%;
    }

    .safety-body-top {
        width: 100%;
        height: 100%;
        background: #F9F9F9;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        padding-right: 13px;
        padding-top: 15px;
        color: #2F2F76FF !important;
        align-items: center;
        justify-content: space-between;
        padding-left: 5px;
        color: rgba(112, 112, 112, 1);
    }

    .safety-body-t {
        height: 20px;
        width: 95%;
        align-items: center;
        justify-content: space-between;
    }

    .safety-header {
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 57px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        color: rgba(112, 112, 112, 1);
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
    }
</style>
