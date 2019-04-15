<template>
    <div class="branch">
        <div class="some">
            <form-container style="display: flex;flex-direction: row;align-items: center">
                <field-select style="margin: 0px 0px 0"  :label="from.select.title" v-model="from.select.checkItem" width="8"
                              :list="from.select.list"></field-select>
                <field-date-picker style="margin: 0px 0px 0" v-model="from.time.times" label="选择日期" width="12"
                                    prop="times" :type="from.time.type"></field-date-picker>
                <span v-if="from.time.times!=''&&Array.isArray(from.time.times)!=true" @click="dateSlot">>></span>

            </form-container>
        </div>
        <!--<div style="display: flex;width: 100%">
            <label-tree :tree="tree" :table="table" @clickTable="clickTable" ref="las" @treeEmit="clickTree"
                        :tableFlag="table.flag" :width="width"></label-tree>
            <equip :commonHouseId="select.checkItem.value.id" v-if="!table.flag" @confirm="addSucess"></equip>
        </div>-->
        <label-tree :tree="tree" :table="table" @clickTable="clickTable" ref="las" @treeEmit="clickTree"
                    :tableFlag="table.flag" :width="table.width"></label-tree>
        <!--<field-dialog :title="dialog.title" :showFlag="dialog.flag" @confirm="dialogConfirm" ref="dialogs">
            <form-container ref="form" :model="form">
                <field-input v-for="item in dialog.dialogList" v-model="form[item.model]" :label="item.label" width="10"
                             :prop="item.model" :ref="item.model" @input="inputs"></field-input>
                <el-button type="text" size="mini" @click="test">test</el-button>
            </form-container>
        </field-dialog>-->
    </div>
</template>

<script>
    import organUnitGql from 'gql/organUnit.gql'
    import equipRecord from 'gql/equipRecord.gql'
    import warehouse from 'gql/warehouse.gql'
    import labelTree from 'common/vue/labelTree'
    import {fetchMixin} from 'field/common/mixinFetch'
    import dateTime from 'common/vue/dataTimePicker'
    export default {
        components: {
            labelTree,
            dateTime
            /*equip*/
        },
        name: "equipmentList",
        mixins: [fetchMixin],
        data() {
            return {
                tree: {
                    treeData: [],
                    defaultProps: {
                        children: 'organUnitSet',
                        label: 'name'
                    },
                    graphqlTree: {
                        graphqlApi: organUnitGql.getOrganUnitListList,
                        graphqlKey: {key: "level", value: "MUNICIPAL"},
                        graphglName: 'OrganUnitList',
                    },
                    node: {}
                },
                table: {
                    flag: true,
                    labelList: [
                        {lable: '序列号', field: 'equipSerial'},
                        {lable: '物品名', field: 'equipName'},
                        {lable: 'id', field: 'id'},
                        {lable: '开始时间', field: 'startTime', filter: this.filterTime},
                        {lable: '结束时间', field: 'endTime', filter: this.filterTime},
                        {lable: '操作人', field: 'operator'},
                        {lable: '操作', field: 'operate', filter: this.operate},
                    ],
                    graphqlTable: {
                        graphqlApi: equipRecord.getEquipOperateRecordList,
                        graphqlKey: {qfilter: {
                                key:"commonHouseId",
                                operator:"EQUEAL",
                                value:''}}
                    },
                    haveButton: false,
                    width: 100
                },
                from:{
                    select: {
                        checkItem: {},
                        list: [],
                        title: '选择仓库'
                    },
                    time:{
                        times:'',
                        type:'datetimerange'
                    }
                }
            }
        },
        watch: {
            'from.select.checkItem': {
                deep: true,
                handler(newVal, oldVal) {
                    this.table.graphqlTable.graphqlKey.qfilter.value = this.from.select.checkItem.value.id;
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
                this.width = 100;
                this.table.flag = !this.table.flag;
                this.$refs.las.refetch();
            },
            clickTable(data) {
                if (data) {

                }
            },
            operate(row){
                let operate = row.operate;
                switch (operate)
                {
                    case 'RETURN':
                        operate="归还";
                        break;
                    case 'RECEIVE':
                        operate="领取";
                        break;
                    case 'MAINTAIN':
                        operate="维修";
                        break;
                    case 'UPKEEP':
                        operate="保养";
                        break;
                    case 'SCRAP':
                        operate="报废";
                        break;
                    case 'CHARGE':
                        operate="充电";
                        break;
                }
                return operate
            },
            filterTime(row) {
                return new Date(parseInt(row.startTime||row.endTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            clickTree(data) {
                if (data) {
                    this.gqlQuery(warehouse.getCommonHouseList, {id: this.tree.node.id}, (data) => {
                        this.from.select.list = [];
                        data.forEach(item => {
                            this.from.select.list.push({
                                key: item.environmentInfo,
                                value: item
                            })
                        })
                    }, true)
                }
            },
            /*dialogConfirm() {
                this.addGrapahql();
            },*/
            /*addGrapahql() {
                this.form.organUnit = {id: this.tree.node.id};
                this.$refs.form.gqlValidate(this.dialog.type === 'unit' ? organUnitGql.architectureSaveOrganUnit : userGql.identitySaveUser,
                    this.dialog.type === 'unit' ? {organUnit: this.form} : {user: this.form}, (data) => {
                        if(this.dialog.type=='unit'){
                            let saveOrganUnit=data.data['architecture_saveOrganUnit'];
                            if(Array.isArray(this.node)){
                                this.tree.node.push(saveOrganUnit)
                            }else {
                                this.tree.node.organUnitSet.push(saveOrganUnit)
                            }
                        }else {
                            this.$refs.las.refetch();
                        }
                        this.dialog.flag = false;
                        this.form = {};
                    });
            },*/
           /* addGrapahql() {
                this.form.organUnitId = this.tree.node.id;
                this.$refs.form.gqlValidate(warehouse.commonHouseSaveCommonHouse,
                    this.form, (data) => {
                        this.select.list.push({
                            key: data.data['commonHouse_saveCommonHouse'].environmentInfo,
                            value: data.data['commonHouse_saveCommonHouse']
                        });
                        this.$refs.dialog.hide();
                        this.$message.success('新增仓库' + data.data['commonHouse_saveCommonHouse'].environmentInfo);
                        this.form = {};
                    });
            },*/
            add(name) {
                if (name == 'house') {
                    this.dialog = {
                        dialogList: [
                            {model: 'organUnitId', label: '机关单位'},
                            {model: 'evenInfo', label: '仓库名'}
                        ],
                        title: '新增仓库'
                    };
                    this.$set(this.form,'organUnitId', this.tree.node.name)

                    this.$refs.dialogs.show();
                } else {
                    this.width = 30;
                    this.table.flag = !this.table.flag;
                }
            }
        }
    }
</script>

<style scoped>

    .branch {
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
    }

    .branch .some {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
</style>