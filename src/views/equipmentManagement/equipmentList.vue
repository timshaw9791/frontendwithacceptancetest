<template>
    <div class="equipmentList">
        <my-header v-show="table.flag" @search="getSearch" :title="'装备信息'" :placeholder="'名称'" :searchFlag="true"></my-header>
        <div class="action-bar" v-show="table.flag">
            <cascader :cascader="cascader"></cascader>
            <my-select class="select" :select="select" :size="1"></my-select>
            <el-button type="text" size="mini" class="action-button" @click="add('house')">增加仓库</el-button>
            <el-button type="text" size="mini" class="action-button" @click="add('equi')">新增装备</el-button>
            <!--<drop-down class="drop-down-box" :drop="drop"></drop-down>-->
        </div>
        <div class="body">
            <labels :table="table" v-show="table.flag" @clickTable="clickTable" @sortCondition="sortGql" ref="las"></labels>
            <equip :commonHouseId="select.selectItem" :equipId="table.equipId" v-if="!table.flag" @black="blacked" @confirm="addSucess"></equip>
        </div>
        <field-dialog :title="dialog.title" @confirm="dialogConfirm" ref="dialog">
            <form-container ref="form" :model="form">
                <field-input v-for="item in dialog.dialogList" v-model="form[item.model]" :label="item.label" width="10"
                             :prop="item.model" :ref="item.model" @input="inputs"></field-input>
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
    import myHeader from 'components/base/header/header'
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
            labels,
            myHeader
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
                    selectCascader:''
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
                    selectItem: '',
                    list: [],
                    title: '选择仓库'
                },
                table: {
                    flag: true,
                    labelList: [
                        {lable: 'RFID', field: 'rfid',sort:false},
                        {lable: '装备名称', field: 'name',sort:false},
                        {lable: '入库时间', field: 'inputTime', filter: this.filterTime,sort:'custom'},

                    ],
                    graphqlTable: {
                        graphqlApi: equi.getEquipList,
                        graphqlKey: {qfilter: {key: "commonHouseId", value: '', operator: "EQUEAL"}}
                    },
                    buttonList:[
                        {name:'查看'}
                    ],
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
                handler() {
                    this.table.graphqlTable.graphqlKey.qfilter.value = this.select.selectItem;
                }
            },
            'cascader.selectCascader': {
                deep: true,
                handler() {
                    debounce(() => {
                        this.getCommonHouseList();
                    }, 1000);
                }
            },
            'search':{
                handler(newval){
                    this.toSearch()
                }
            }
        },
        methods: {
            getSearch(data){
                this.search = data;
            },
            sortGql(data){
              if (data=='descending'){
                  this.table.graphqlTable.graphqlApi=equi.getEquipListDESC;
                 /* this.$set(this.table.graphqlTable,'graphqlApi', equi.getEquipListDESC);*/
              }else {
                  this.table.graphqlTable.graphqlApi=equi.getEquipListASC;
                  /*this.$set(this.table.graphqlTable,'graphqlApi', equi.getEquipListASC);*/
              }

              this.$refs.las.refetch();
            },
            inputs(data){
                console.log('input',data);
            },
            addSucess() {
                this.table.flag = !this.table.flag;
                this.$refs.las.refetch();
            },
            toSearch(){
                let next={
                    key:'name',
                    value:'%'+this.search+'%',
                    operator:'LIKE',
                };
                this.$set(this.table.graphqlTable.graphqlKey.qfilter,'combinator', 'AND');
                this.$set(this.table.graphqlTable.graphqlKey.qfilter,'next', next);

            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
            },
            blacked(data){
                if (data){
                    this.table.flag=!this.table.flag
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.inputTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            getCommonHouseList() {
                this.gqlQuery(warehouse.getCommonHouseList, {id: this.cascader.selectCascader}, (data) => {
                    if(data!=''){
                        this.select.list = [];
                        data.forEach(item => {
                            this.select.list.push({
                                key: item.name,
                                value: item.id
                            })
                        });
                        this.$set(this.select,'selectItem', this.select.list[0].value);
                        this.table.graphqlTable.graphqlKey.qfilter.value = this.select.list[0].value;
                    }else {
                        this.select.list = [];
                        this.select.selectItem='';
                        this.$message('该单位没有仓库')
                    }
                }, true)
            },
            /*changeBox(data) {
                if (data) {
                    this.tree.graphqlTree.graphqlKey = {key: "id", value: "qbM4nUL0HfemI70mXXLrP3O01"}
                } else {
                    this.tree.graphqlTree.graphqlKey = {key: "level", value: "MUNICIPAL"}
                }
            },*/
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
                            value: data.data['commonHouse_saveCommonHouse'].id
                        });
                        this.$message.success('操作成功');
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
                    if(this.cascader.selectCascader!=''){
                        this.dialog = {
                            dialogList: [
                                {model: 'organUnitId', label: '机关单位'},
                                {model: 'name', label: '仓库名称'}
                            ],
                            title: '新增仓库'
                        };
                        this.$set(this.form,'organUnitId', this.getUnitName(this.cascader.cascaderData));
                        this.$refs.dialog.show();
                    }else {
                        this.$message('请先选择机关单位')
                    }
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
    .equipmentList .body{
        width: 100%;
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