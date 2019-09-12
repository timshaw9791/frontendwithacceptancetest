<template>
    <div >
        <div class="block">
            <span class="demonstration">选择单位:   </span>
            <el-cascader
                    placeholder="机关单位"
                    :options="organUnit"
                    :props="cascaderProps"
                    filterable
                    change-on-select
                    @change="handleChange"></el-cascader>
            <el-button type="text" size="mini" @click="add('categoryItem')">增加小类</el-button>
            <el-button type="text" size="mini" @click="add('equipArg')">新增装备信息</el-button>
            <span v-text="selectCasaderItem.name"></span>
            <div class="casader-box">
                <div class="casader" v-for="(options,layer) in casaderArray">
                    <div class="casader-item" v-for="item in options" @click="handleCasaderItem(item,layer)">
                        <span v-text="item.name"></span>
                        <svg-icon icon-class="箭头" v-if="item.categoryItems[0]!=undefined" class="iconClass"/>
                    </div>
                </div>
            </div>
            <field-dialog :title="dialog.title" @confirm="dialogConfirm" ref="dialog">
                <form-container ref="form" :model="form">
                    <field-input v-for="item in dialog.dialogList" v-model="form[item.model]" :label="item.label" width="10"
                                 :prop="item.model" :ref="item.model" @input="inputs"></field-input>
                </form-container>
            </field-dialog>
        </div>
    </div>
</template>

<script>
    import warehouse from "gql/warehouse.gql"
    import organUnitGql from 'gql/organUnit.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    export default {
        name: "warehouse",
        mixins: [fetchMixin],
        data() {
            return {
                casaderArray:[],
                organUnit:[],
                cascaderProps:{
                    label:'name',
                    children:'organUnitSet',
                    value:'id'
                },
                dialog: {
                    title: ''
                },
                form: {},
                selectCasaderItem:""
            };
        },
        created(){
            this.getOrganUnitData();
        },
        methods: {
            getOrganUnitData() {
                this.getQuery(organUnitGql.getOrganUnitListList,{key: "level", value: "MUNICIPAL"},"OrganUnitList").then(data=>{
                    this.organUnit.push(data[0])
                })
            },
            getQuery(api,value,name){
                let promise=new Promise((resolve)=>{
                    this.gqlQuery(api, value, (res) => {
                        if (res.data[name].content.length > 0) {
                            resolve(
                                JSON.parse(JSON.stringify(res.data[name].content))
                            );
                        }
                    });
                });
                return promise
            },
            add(name) {
                if (name == 'categoryItem') {
                    this.dialog = {
                        dialogList: [
                            {model: 'categoryId', label: '所选大类'},
                            {model: 'name', label: '小类名'}
                        ],
                        title: '新增小类',
                        type:'categoryItem'
                    };
                    this.$set(this.form,'categoryId', this.selectCasaderItem.name);
                    this.$refs.dialog.show();
                } else {
                    this.table.width = 30;
                    this.table.flag = !this.table.flag;
                }
            },
            dialogConfirm() {
                this.addGrapahql();
            },
            addGrapahql() {
                this.$refs.dialog.hide();
                if(this.dialog.type=='categoryItem'){
                    this.form.categoryId=this.selectCasaderItem.id
                }else {

                }
                this.$refs.form.gqlValidate(this.dialog.type === 'categoryItem' ? warehouse.categoryAddCategoryItem : userGql.identitySaveUser,
                    this.dialog.type === 'categoryItem' ? this.form : {user: this.form}, (data) => {
                        if(this.dialog.type=='categoryItem'){
                            let saveOrganUnit=data.data['category_addCategoryItem'];
                            console.log(saveOrganUnit)
                        }
                        this.form = {};
                    });
            },
            handleChange(value) {
                this.getQuery(warehouse.getCategoryList,{qfilter:{key: "organUnitId", operator: "EQUEAL", value: value[value.length-1]}},"CategoryList").then(data=>{
                    this.casaderArray=[];
                    this.casaderArray.push(data);
                })
            },
            handleCasaderItem(item,layer){
                if(item.categoryItems[0]!=undefined){
                    if(this.casaderArray.length-1>=layer+2){
                        this.casaderArray.splice(layer+2);
                    }
                    this.$set(this.casaderArray,[layer+1],item.categoryItems);
                }
                this.selectCasaderItem = item;
            },
            initCasaderData(data,targetKey,modifykey){

            }
        }
    }
</script>

<style scoped>
    .casader-box{
        white-space: nowrap;
        background: #fff;
        position: absolute;
        margin: 5px 20px;
        z-index: 2;
        border: 1px solid #E4E7ED;
        border-radius: 2px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .casader-item{
        height: 60px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
    }
    .casader-item:hover {
        color: #409EFF;
        background: #f5f7fa;
    }
    .iconClass{
        font-size: 14px;
    }
    .casader{
        display: inline-block;
        vertical-align: top;
        min-height: 180px;
        overflow: auto;
        border-right: solid 1px #E4E7ED;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 6px 0;
        min-width: 160px;
        flex-direction: column;
    }
</style>