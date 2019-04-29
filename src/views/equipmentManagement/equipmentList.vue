<template>
    <div class="equipmentList">
        <div class="header" v-if="table.flag">
            <span class="title">装备信息</span>
            <div class="input-box" v-if="false">
                <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                <input class="input" v-model="search" placeholder="名称" ></input>
            </div>
        </div>
        <div class="action-bar" v-if="table.flag">
            <cascader :cascader="cascader"></cascader>
            <my-select class="select" :select="select" :size="1"></my-select>
            <el-button type="text" size="mini" class="action-button" @click="add('house')">增加仓库</el-button>
            <el-button type="text" size="mini" class="action-button" @click="add('equi')">新增装备</el-button>
            <!--<drop-down class="drop-down-box" :drop="drop"></drop-down>-->
        </div>
        <div class="body">
            <labels :table="table" v-if="table.flag"></labels>
            <equip :commonHouseId="select.selectItem" :equipId="table.equipId" v-if="!table.flag" @confirm="addSucess"></equip>
        </div>
        <!--<div style="display: flex;width: 100%">
            <label-tree :tree="tree" :table="table" @clickTable="clickTable" ref="las" @treeEmit="clickTree"
                        :tableFlag="table.flag" :width="table.width"></label-tree>
            <equip :commonHouseId="select.checkItem.value.id" :equipId="table.equipId" v-if="!table.flag" @confirm="addSucess"></equip>
        </div>-->
        <field-dialog :title="dialog.title" @confirm="dialogConfirm" ref="dialog">
            <form-container ref="form" :model="form">
                <field-input v-for="item in dialog.dialogList" v-model="form[item.model]" :label="item.label" width="10"
                             :prop="item.model" :ref="item.model" @input="inputs"></field-input>
                <!-- <el-button type="text" size="mini" @click="test">test</el-button>-->
            </form-container>
        </field-dialog>
    </div>
</template>

<script>
    import organUnitGql from 'gql/organUnit.gql'
    import warehouse from 'gql/warehouse.gql'
    import equi from 'gql/equi.gql'
    import labelTree from 'common/vue/labelTree'
    import {fetchMixin} from 'field/common/mixinFetch'
    import equip from 'components/equipment/addEquipment'
    import cascader from 'common/vue/cascader'
    import mySelect from 'common/vue/select'
    import dropDown from 'common/vue/dropDown'
    import labels from 'common/vue/label'
    const debounce = (function() {
        let timer = 0;
        return function(func, delay) {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    })();
    export default {
        components: {
            labelTree,
            equip,
            cascader,
            mySelect,
            dropDown,
            labels
        },
        name: "equipmentList",
        mixins: [fetchMixin],
        data() {
            return {
                search:'',
                cascader:{
                    cascaderData:[],
                    title:'请选择',
                    cascaderProps:{
                        label:'name',
                        children:'organUnitSet',
                        value:'id'
                    },
                    graphqlCascader: {
                        graphqlApi: organUnitGql.getOrganUnitListList,
                        graphqlKey: {key: "level", value: "MUNICIPAL"},
                    },
                    selectCascader:[]
                },
                drop:{
                    title:'批量管理',
                    list:[
                        {key:'领取',value:'RECEIVE'},
                        {key:'归还',value:'RETURN'},
                        {key:'维修',value:'MAINTAIN'},
                        {key:'保养',value:'UPKEEP'},
                        {key:'报废',value:'SCRAP'},
                        {key:'充电',value:'CHARGE'}
                    ]
                },
                select: {
                    selectItem: {},
                    list: [],
                    title: '选择仓库'
                },
                table: {
                    flag: true,
                    labelList: [
                        {lable: 'rfid', field: 'rfid'},
                        {lable: '物品名', field: 'name'},
                        {lable: 'id', field: 'id'},
                        {lable: '创建时间', field: 'inputTime', filter: this.filterTime},

                    ],
                    graphqlTable: {
                        graphqlApi: equi.getEquipList,
                        graphqlKey: {qfilter: {key: "commonHouseId", value: '', operator: "EQUEAL"}}
                    },
                    equipId:'',
                    haveButton: true
                },
                dialog: {
                    title: ''
                },
                form: {}
            }
        },
        watch: {
            'select.selectItem': {
                deep: true,
                handler(newVal, oldVal) {
                    this.table.graphqlTable.graphqlKey.qfilter.value = this.select.selectItem;
                }
            },
            'cascader.selectCascader': {
                deep: true,
                handler(newVal, oldVal) {
                    debounce(() => {
                        this.getCommonHouseList();
                    }, 500);
                }
            }
        },
        methods: {
            test(){
                console.log(this.$refs);
            },
            inputs(data){
                console.log('input',data);
            },
            addSucess() {
                this.table.flag = !this.table.flag;
                this.$refs.las.refetch();
            },
            clickTable(data) {
                if (data) {
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.inputTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            getCommonHouseList() {
                this.gqlQuery(warehouse.getCommonHouseList, {id: this.cascader.selectCascader}, (data) => {
                    this.select.list = [];
                    data.forEach(item => {
                        this.select.list.push({
                            key: item.name,
                            value: item.id
                        })
                    })
                    console.log('addGrapahql',this.select.list);
                }, true)
            },
            changeBox(data) {
                if (data) {
                    this.tree.graphqlTree.graphqlKey = {key: "id", value: "qbM4nUL0HfemI70mXXLrP3O01"}
                } else {
                    this.tree.graphqlTree.graphqlKey = {key: "level", value: "MUNICIPAL"}
                }
            },
            dialogConfirm() {
                this.addGrapahql();
            },
            addGrapahql() {
                this.$refs.dialog.hide();
                this.form.organUnitId = this.cascader.selectCascader;
                this.$refs.form.gqlValidate(warehouse.commonHouseSaveCommonHouse,
                    this.form, (data) => {
                        this.select.list.push({
                            key: data.data['commonHouse_saveCommonHouse'].name,
                            value: data.data['commonHouse_saveCommonHouse']
                        });
                        this.$message.success('新增仓库' + data.data['commonHouse_saveCommonHouse'].name);
                        this.form = {};
                    });
            },
            getUnitName(data){
                let name;
                let flag = false
                data.forEach(item=>{
                    if (item.id==this.cascader.selectCascader){
                       name=item.name;
                       flag=true
                    }
                })
                if(flag){
                    return name
                }else {
                    this.getUnitName(data.organUnitSet)
                }
            },
            add(name) {
                if (name == 'house') {
                    this.dialog = {
                        dialogList: [
                            {model: 'organUnitId', label: '机关单位'},
                            {model: 'name', label: '仓库名'}
                        ],
                        title: '新增仓库'
                    };
                    if (this.cascader.selectCascader){
                        this.$set(this.form,'organUnitId', this.getUnitName(this.cascader.cascaderData));
                    }
                    this.$refs.dialog.show();
                } else {
                    this.table.flag = !this.table.flag;
                    console.log(!this.table.flag);
                }
            }
        }
    }
</script>

<style scoped>
    .equipmentList {
        display: flex;
        width: 100%;
        flex-direction: column;
        font-size: 16px;
    }
    .equipmentList .header {
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 33px;
        color:rgba(112,112,112,1);

    }
    .equipmentList .body{
        width: 100%;
    }
    .header .input-box{
        width:285px;
        position: relative;
    }
    .header .title{
        font-size: 20px;
    }
    .input-box .input{
        width: 100%;
        height:38px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
        border-radius:19px;
        padding-left: 15px;
        outline:medium;
    }
    .input-box .icon-search{
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }
    .equipmentList .action-bar {
        margin-top: 8px;
        border-top: rgba(112,112,112, 0.13) solid 1px ;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: left;
        flex-direction: row;
        margin-left: 20px;
        width: 100%;
    }
    .action-bar .select{
        margin-left: 29px;
    }
    .action-bar .drop-down-box{
        width: 57%;
        display: flex;
        justify-content: flex-end;
    }
    .action-bar .action-button{
        margin-left: 27px;
        color: rgba(112,112,112,1);
    }
</style>