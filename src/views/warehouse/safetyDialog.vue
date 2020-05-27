<template>
    <div>
        <service-dialog :title="title" ref="safetyDialogs" width="3.3021rem"
                       :button="false" :secondary="false">
            <div v-if="title.includes('新增')" style="text-align: center;">
                <define-input v-if="title.includes('小类')" v-model="addData.name" margin="15px" label="大类" :column="9" :disabled="true"></define-input>
                <define-input v-model="newName" margin="15px" label="名称" :column="9"></define-input>
            </div>
            <div v-else-if="title.includes('编辑')" style="text-align: center;">
                <define-input v-model="edit.name" margin="15px" :label="title.includes('大类')?'大类名称':'小类名称'" :column="9"></define-input>
            </div>
            <div v-else-if="title.includes('装备')" style="text-align: center;">
                <base-select label="装备大类" :column="12" margin="15px" v-model="selectedData.selectGenre" :selectList="selectData.genre"></base-select>
                <base-select label="装备小类" :column="12" margin="15px" v-model="selectedData.selectCategory" :selectList="selectData.category"></base-select>
            </div>
            <div style="text-align: center;">
            <base-button label="取消" type="none" @click="cancel"></base-button>
            <base-button label="确定" @click="submit"></base-button>
            </div>
        </service-dialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/serviceDialog'
    import { addgenre, editgenre, addcategories, editcategories  ,getgenresList, getcategories, distribution, } from "api/safety"

    export default {
        name: "safetyDialog",
        components: {
            serviceDialog,
        },
        data() {
            return {
                newName:"",
                edit:this.editData,
                selectData:{
                    genre:[],
                    category:[]
                },
                selectedData:{
                    selectGenre:"",
                    selectCategory:""
                }
            }
        },
        props: {
            editData: {
                type: Object
            },
            addData:{
                type:Object
            },
            title:{
                type:String,
                default: ''
            },
            assignedData:{
                type:Array,
            },
        },
        watch:{
            'selectedData.selectGenre':{
                handler(newVal){
                    this.selectedData.selectCategory = ""
                    if(newVal!=""){
                        getcategories(newVal).then(res=>{
                            if(res.length == 0){
                                this.selectData.category = []
                            }else{
                                this.selectData.category = []
                                res.forEach(item=>{
                                    this.selectData.category.push({
                                        label:item.name,
                                        value:item.id
                                    })
                                })
                            }
                        })
                    }
                }
            },
            'editData':{
                handler(newVal){
                    this.edit = JSON.parse(JSON.stringify(newVal))
                }
            },
            // 'title':{
            //     handler(newVal){
            //         if(this.title=="装备分类"){
            //             getgenresList().then(res=>{
            //                 res.content.forEach(item=>{
            //                     this.selectData.genre.push({
            //                         value:item.id,
            //                         label:item.name
            //                     })
            //                 })
            //             })
            //         }
            //     }
            // }
        },
        methods: {
            titleShow(){
                this.$refs.safetyDialogs.show()
                if(this.title=="装备分类"){
                    getgenresList().then(res=>{
                        res.content.forEach(item=>{
                            this.selectData.genre.push({
                                value:item.id,
                                label:item.name
                            })
                        })
                    })
                }
            },
            cancel(){
                this.$refs.safetyDialogs.hide()
                this.newName = ""
                this.selectData={
                    genre:[],
                    category:[]
                },
                this.selectedData={
                    selectGenre:"",
                    selectCategory:""
                }
            },
            clean(){
                this.newName = ""
                this.selectData={
                    genre:[],
                    category:[]
                },
                this.selectedData={
                    selectGenre:"",
                    selectCategory:""
                }
            },
            submit(){
                if(this.title == "新增大类"){
                    addgenre({name:this.newName}).then(res=>{
                        this.$refs.safetyDialogs.hide()
                        this.$emit('fetchData');
                        this.clean()
                    })
                }else if(this.title == "编辑大类"){
                    let params = {name:this.edit.name}
                    editgenre(this.editData.id,params).then(res=>{
                        this.$refs.safetyDialogs.hide()
                        this.$emit('fetchData');
                        this.clean()
                    })
                }else if(this.title == "新增小类"){
                    addcategories(this.addData.id,{name:this.newName,genre:this.addData}).then(res=>{
                        this.$refs.safetyDialogs.hide()
                        this.$emit('fetchData');
                        this.clean()
                    })
                }else if(this.title == "编辑小类"){
                    editcategories(this.editData.id,this.edit).then(res=>{
                        this.$refs.safetyDialogs.hide()
                        this.$emit('fetchData');
                        this.clean()
                    })
                }else if(this.title == "装备分类"){
                    if(this.selectedData.selectCategory != null && this.selectedData.selectCategory != ''){
                        distribution(this.selectedData.selectCategory,{equipArgs:this.assignedData}).then(res=>{
                            this.$refs.safetyDialogs.hide()
                            this.$emit('fetchData');
                        this.clean()
                        })
                    }else {
                        this.$message.error("请选择小类")
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>