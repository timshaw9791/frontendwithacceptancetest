<template>
    <div>
        <serviceDialog :title="title" ref="safetyDialog" width="3.3021rem"
                       :button="false">
            <div v-if="title.indexOf('新增')!=-1" style="text-align: center;">
                <define-input v-if="title.indexOf('小类')!=-1" v-model="addData.name" margin="15px" label="大类" :column="9" :disabled="true"></define-input>
                <define-input v-model="newName" margin="15px" label="名称" :column="9"></define-input>
            </div>
            <div v-else-if="title.indexOf('编辑')!=-1" style="text-align: center;">
                <define-input v-model="edit.name" margin="15px" :label="title.indexOf('大类')!=-1?'大类名称':'小类名称'" :column="9"></define-input>
            </div>
            <div v-else-if="title.indexOf('装备')!=-1" style="text-align: center;">
                <base-select label="装备大类" :column="12" margin="15px" v-model="selectedData.selectGenre" :selectList="selectData.genre"></base-select>
                <base-select label="装备小类" :column="12" margin="15px" v-model="selectedData.selectCategory" :selectList="selectData.category"></base-select>
            </div>
            <div style="text-align: center;">
            <base-button label="取消" type="none" @click="cancel"></base-button>
            <base-button label="确定" @click="submit"></base-button>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import { addgenre, editgenre, addcategories, editcategories  ,getgenresList, getcategories,} from "api/safety"

    export default {
        name: "safetyDialog",
        components: {
            serviceDialog,
        },
        data() {
            return {
                newName:"",
                edit:{},
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
            },
        },
        watch:{
            'selectedData.selectGenre':{
                handler(newVal){
                    getcategories(newVal).then(res=>{
                        res.forEach(item=>{
                            this.selectData.category.push({
                                label:item.name,
                                value:item.id
                            })
                        })
                    })
                }
            }
        },
        methods: {
            titleShow(){
                this.$refs.safetyDialog.show()
                this.edit=JSON.parse(JSON.stringify(this.editData))
                if(this.title.indexOf('装备')!=-1){
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
                this.$refs.safetyDialog.hide()
                this.newName = ""
            },
            submit(){
                console.log("提交");
                if(this.title == "新增大类"){
                    addgenre({name:this.newName}).then(res=>{
                        this.$refs.safetyDialog.hide()
                        this.$emit('fetchData');
                    })
                }else if(this.title == "编辑大类"){
                    let params = {name:this.edit.name}
                    editgenre(this.editData.id,params).then(res=>{
                        this.$refs.safetyDialog.hide()
                        this.$emit('fetchData');
                    })
                }else if(this.title == "新增小类"){
                    addcategories(this.addData.id,{name:this.newName,genre:this.addData}).then(res=>{
                        this.$refs.safetyDialog.hide()
                        this.$emit('fetchData');
                    })
                }else if(this.title == "编辑小类"){
                    editcategories(this.editData.id,this.edit).then(res=>{
                        this.$refs.safetyDialog.hide()
                        this.$emit('fetchData');
                    })
                }else if(this.title == "装备分配"){
                    console.log("this.selectedData.selectGenre",this.selectedData.selectGenre);
                    console.log("this.selectedData.selectCategory",this.selectedData.selectCategory);
                }
            }
        }
    }
</script>

<style scoped>

</style>