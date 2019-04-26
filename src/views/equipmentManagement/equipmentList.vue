<template>
    <div class="branch">
        <div class="some">
            <form-container>
                <field-select :label="select.title" v-model="select.checkItem" width="10"
                              :list="select.list"></field-select>
            </form-container>
            <el-button type="text" size="mini" @click="add('house')">增加仓库</el-button>
            <el-button type="text" size="mini" @click="add('equi')">新增装备</el-button>
        </div>
        <div style="display: flex;width: 100%">
            <label-tree :tree="tree" :table="table" @clickTable="clickTable" ref="las" @treeEmit="clickTree"
                        :tableFlag="table.flag" :width="table.width"></label-tree>
            <equip :commonHouseId="select.checkItem.value.id" :equipId="table.equipId" v-if="!table.flag" @confirm="addSucess"></equip>
        </div>
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

    export default {
        components: {
            labelTree,
            equip
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
                    width: 100,
                    haveButton: true
                },
                select: {
                    checkItem: {},
                    list: [],
                    title: '选择仓库'
                },
                dialog: {
                    title: ''
                },
                form: {}
            }
        },
        watch: {
            'select.checkItem': {
                deep: true,
                handler(newVal, oldVal) {
                    this.table.graphqlTable.graphqlKey.qfilter.value = this.select.checkItem.value.id;
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
                this.table.width = 100;
                this.table.flag = !this.table.flag;
                this.$refs.las.refetch();
            },
            clickTable(data) {
                if (data) {
                    this.table.width = 30;
                    this.table.equipId = data.id;
                    this.table.flag=!this.table.flag
                }
            },
            filterTime(nS) {
                return new Date(parseInt(nS.inputTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            clickTree(data) {
                if (data) {
                    this.gqlQuery(warehouse.getCommonHouseList, {id: this.tree.node.id}, (data) => {
                        this.select.list = [];
                        data.forEach(item => {
                            this.select.list.push({
                                key: item.name,
                                value: item
                            })
                        })
                    }, true)
                }
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
            addGrapahql() {
                this.$refs.dialog.hide();
                this.form.organUnitId = this.tree.node.id;
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
                    this.$refs.dialog.show();
                } else {
                    this.table.width = 30;
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
        flex-direction: column;
    }

    .branch .some {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
</style>