<template>
    <div class="branch">
        <div class="some">
           <!-- <el-checkbox v-model="tree.checked" @change="changeBox">只显示本级</el-checkbox>-->
            <el-button type="text" size="mini" @click="add('unit')">增加机关单位</el-button>
            <el-button type="text" size="mini" @click="add('user')">增加用户</el-button>
        </div>
        <label-tree :tree="tree" :table="table" @clickTable="clickTable" ref="las"></label-tree>
        <field-dialog :title="dialog.title" ref="dialog" @confirm="dialogConfirm">
            <form-container ref="form" :model="form">
                <field-input v-for="item in dialog.dialogList" v-model="form[item.model]" :label="item.label" width="10"
                             :prop="item.model"></field-input>
                <field-select :label="dialog.select.title" v-model="form[dialog.select.model]" width="5"
                              :list="dialog.select.list" ></field-select>
            </form-container>
        </field-dialog>
    </div>
</template>

<script>
    import organUnitGql from 'gql/organUnit.gql'
    import userGql from 'gql/list.gql'
    import labelTree from 'common/vue/labelTree'

    export default {
        components: {
            labelTree
        },
        name: "branchManagement",
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
                    checked: true,
                    node: {},
                    nodeKey:'id'
                },
                table: {
                    labelList: [
                        {lable: '账号名', field: 'username'},
                        {lable: '姓名', field: 'name'},
                        {lable: 'id', field: 'id'}
                    ],
                    tableParams:{
                        id:''
                    },
                    graphqlTable: {
                        graphqlApi: userGql.getUserList,
                        graphqlKey:{id:''}
                    },
                    haveButton: false
                },
                dialog: {
                    title: '',
                    select: {
                        model: "",
                        list: '',
                        title: ''
                    },
                    type: ''
                },
                form: {}
            }
        },

        methods: {
            clickTable(data) {
                if (data) {
                    console.log('toDoSome', data)
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
            addGrapahql() {
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
                            this.$message('添加成功')
                        }else {
                            this.$refs.las.refetch();
                        }
                        this.$refs.dialog.hide();
                        this.form = {};
                    });
            },

            add(name) {
                if (name == 'unit') {
                    this.dialog={
                        dialogList : [
                            {model: 'name', label: '名称'},
                            {model: 'location', label: '地址'},
                        ],
                        title : '增加机关单位',
                        type : 'unit',
                        select:{
                            model : 'level',
                            title : '级别',
                            list :
                                [{val: 'MUNICIPAL', key: '市级'}, {val: 'DISTRICT', key: '区/县级'}, {
                                    val: 'POLICE_STATION',
                                    key: '派出所'
                                }]
                        }
                    }
                } else {
                    this.dialog={
                        dialogList : [
                            {model: 'username',  label: '账号名'},
                            {model: 'password',  label: '密码'},
                            {model: 'organUnit', label: '机关单位'}
                        ],
                        title : '增加用户',
                        type : name,
                        select:{
                            model : 'roleItems',
                            title : '权限',
                            list :
                                [{val:[{id:'scMACaFmGbmm3vJpvnoIf0R01'}], key: '超级管理员'}, {val: [{id:'PqkmGejCE4u2qmryY2O9q3R01'}], key: '管理员'}, {
                                    val: [{id:'WXIsFL2_GOeEvhUrQBNXp3R01'}],
                                    key: '警员'
                                }]
                        }
                    };
                    this.form.organUnit=this.tree.node.name;
                }
               this.$refs.dialog.show()
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
        flex-direction: row;
    }
</style>