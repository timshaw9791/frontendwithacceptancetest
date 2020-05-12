<template>
  <div class="training-container">
    <div class="training-header">
        <span style="font-size: 20px;">{{$route.meta.title}}</span>
    </div>
    <div class="training-top">
        <base-button size="default" align="right" label="新增教学培训" @click="dialogShow('add')"></base-button>
    </div>
    <div class="training-body" >
        <define-table :pageInfo="paginator" @changePage="changePage"
                        :data="order" height="3.6042rem">
            <define-column  label="操作"  v-slot="{ data }">
                <base-button label="编辑" size="mini" @click="dialogShow('edit',data.row)" type="primary"></base-button>
                <base-button label="删除" size="mini" @click="deleteplan(data.row)" type="danger"></base-button>
            </define-column>
            <define-column label="装备参数" field="describes" v-slot="{data}">
                <entity-input v-model="data.row.equipArg" format="{name}({model})" :options="{}"></entity-input>
            </define-column>
            <define-column label="教学视频" field="describes" v-slot="{data}">
                <div  style="cursor:pointer;" v-for="(item, i) in data.row.video.fileName" :key="i">
                    <span @click="show('MP4',item)">{{item}}</span>
                </div>
            </define-column>
            <define-column label="教学文档" field="describes" v-slot="{data}">
                <div style="cursor:pointer;" v-for="(item ,i) in data.row.pdf.fileName" :key="i">
                    <span @click="show('PDF',item)">{{item}}</span>
                </div>
            </define-column>
        </define-table>
    </div>
  </div>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
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
                            pdf:{fileName:[],id:[]},
                            video:{fileName:[],id:[]},
                        }
                        item.forEach(i=>{
                            a.equipArg = i.equipArg
                            if(i.type == "pdf"){
                                a.pdf.fileName.push(i.fileName)
                                a.pdf.id.push(i.id)
                            }else if(i.type == "MP4"){
                                a.video.fileName.push(i.fileName)
                                a.video.id.push(i.id)
                            }
                        })
                        this.order.push(a)
                    })
                })
            },
            deleteplan(data){
                Promise.all([this.deleteTrainingOne(data)]).then(response=>{
                    this.fetchData()
                })
            },
            async deleteTrainingOne(data){
                let id =data.pdf.id
                data.video.id.forEach(item=>{
                    id.push(item)
                })
                for(let i in id){
                    await deleteTraining(id[i])
                }
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
                        pdf:{fileName:[],id:[]},
                        video:{fileName:[],id:[]},
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
            show(data,item){
                this.$router.push({
                    name: 'trainingShow',
                    query: {type:'trainingShow', info: {data:data,item:item}}
                })
            }
        },
        created() {
            this.fetchData()
        },
        components: {
            baseButton,
            entityInput
        },
    };
</script>

<style lang="scss" scoped>
    .training-container {
        font-size: 16px;
    }
    .training-top {
        padding: 18px 7px;
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
    }
    .training-body {
        padding: 0 7px;
        widows: 100%;
    }
    .training-header {
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
        color: rgba(112,112,112,1);
        border-bottom: 1px solid rgba(112,112,112, 0.13);
    }
</style>
