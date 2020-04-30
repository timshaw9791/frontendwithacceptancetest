<template>
  <div class="training-form-container">
    <my-header :title="$route.meta.title" :haveBlack="false"></my-header>
    <div class="training-form-top">
        <base-button size="default" align="right" label="新增教学培训" @click="dialogShow('add')"></base-button>
    </div>
    <div class="training-form-body" >
        <define-table  slot="slot1" :pageInfo="paginator" @changePage="changePage"
                        :data="order" height="2.6042rem">
            <define-column  label="操作"  v-slot="{ data }">
                <base-button label="编辑" size="mini" @click="dialogShow('edit',data.row)" type="primary"></base-button>
                <base-button label="删除" size="mini" @click="deleteplan(data.row)" type="danger"></base-button>
            </define-column>
            <define-column label="装备参数" field="describes" v-slot="{data}">
                <entity-input v-model="data.row.equipArg" format="{name}({model})" :options="{}"></entity-input>
            </define-column>
            <define-column label="教学视频" field="describes" v-slot="{data}">
                <div v-for="(item, i) in data.row.video" :key="i">{{item}}</div>
            </define-column>
            <define-column label="教学文档" field="describes" v-slot="{data}">
                <div v-for="(item ,i) in data.row.pdf" :key="i">{{item}}</div>
            </define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import uploadFile from '@/componentized/uploadFile'
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import { getTraining, addTraining, editTraining, deleteTraining } from "api/training";
    var _ = require("lodash");
    export default {
        name: "training",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
            };
        },
        methods: {
            fetchData(){
                this.order = []
                getTraining(this.paginator).then(res=>{
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    let temp = _.values(_.groupBy(_.flatten(res.content),item=>`${item.equipArg.model}`))
                    temp.forEach(item=>{
                        let a = {
                            equipArg:{},
                            id:[],
                            pdf:[],
                            video:[]
                        }
                        item.forEach(i=>{
                            a.equipArg = i.equipArg
                            a.id.push(i.id)
                            if(i.type == "pdf"){
                                a.pdf.push(i.fileName)
                            }else if(i.type == "MP4"){
                                a.video.push(i.fileName)
                            }
                        })
                        this.order.push(a)
                    })
                })
            },
            deleteplan(data){
                data.id.forEach(item=>{
                    deleteTraining(item).then(res=>{
                        this.$message.success("删除成功")
                    })
                })
                this.fetchData()
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            dialogShow(data,item){
                let dialogData = {}
                let editflag = false
                if(data=="add"){
                    dialogData = {
                        equipArg:{},
                        pdf:[],
                        video:[]
                    }
                    editflag = false
                }else if(data == "edit"){
                    editflag = true
                    dialogData = item
                }
                this.$router.push({
                    name: 'editTraining',
                    params: {type:'editTraining', info: {data:dialogData,edit:editflag}}
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
            uploadFile
        },
    };
</script>

<style lang="scss" scoped>
  .training-form-container {
    font-size: 16px;
  }
  .training-form-top {
    padding: 18px 7px;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
  }
  .training-form-body {
    padding: 0 7px;
    widows: 100%;
  }
</style>
