<template>
    <div class="warehouse">
        <my-header @search="getSearch" :title="header.title" :placeholder="'小类/大类/名称/型号'"
                   :searchFlag="viewStatus.flag"></my-header>
        <div class="action-bar" v-show="viewStatus.flag">
            <cascader :cascader="cascader"></cascader>
            <my-select class="select" :select="select" :size="1"></my-select>
            <el-button type="text" size="mini" class="action-button" @click="add('category')">新增小类</el-button>
            <el-button type="text" size="mini" class="action-button" @click="add('equi')">新增装备信息</el-button>
        </div>
        <div class="action-bar" v-show="!viewStatus.flag">
            <span class="equip-title" v-text="'装备参数'"></span>
        </div>
        <div class="body">
            <labels :table="table" @clickTable="clickTable"
                    ref="tab" v-show="viewStatus.flag"></labels>
            <equip-information v-if="!viewStatus.flag"></equip-information>
        </div>
        <field-dialog :title="dialog.title" @confirm="dialogConfirm" ref="dialog">
            <form-container ref="form" :model="form">
                <field-select :label="dialog.select.title" v-model="form[dialog.select.model]" width="10"
                              :list="dialog.select.list"></field-select>
                <field-input v-for="item in dialog.dialogList" v-model="form[item.model]" :label="item.label" width="10"
                             :prop="item.model" :ref="item.model" @input="inputs"></field-input>
            </form-container>
        </field-dialog>
    </div>
</template>

<script>
    const debounce = (function () {
        let timer = 0;
        return function (func, delay) {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    })();
    import warehouse from 'gql/warehouse.gql'
    import organUnitGql from 'gql/organUnit.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    import myHeader from 'components/base/header/header'
    import equipInformation from 'components/warehouse/equipInformation'
    import cascader from 'common/vue/cascader'
    import mySelect from 'common/vue/select'
    import labels from 'common/vue/label'
    export default {
        name: "index",
        components: {
            myHeader,
            mySelect,
            cascader,
            labels,
            equipInformation
        },
        mixins: [fetchMixin],
        data() {
            return {
                search: '',
                header: {
                    title: '仓库信息'
                },
                cascader: {
                    cascaderData: [],
                    title: '请选择',
                    cascaderProps: {
                        label: 'name',
                        children: 'organUnitSet',
                        value: 'id'
                    },
                    graphqlCascader: {
                        graphqlApi: organUnitGql.getOrganUnitListList,
                        graphqlKey: {key: "level", value: "MUNICIPAL"},
                    },
                    selectCascader: ''
                },
                select: {
                    selectItem: '',
                    list: [],
                    title: '选择仓库'
                },
                viewStatus: {
                    flag: true
                },
                table: {
                    labelList: [
                        {lable: '大类', field: 'category.genre.name', sort: false},
                        {lable: '小类', field: 'category.name', sort: false},
                        {lable: '装备名称', field: 'name', sort: false},
                        {lable: '装备型号', field: 'model', sort: false},
                        /* {lable: '数量', field: 'count', sort: false},*/

                    ],
                    graphqlTable: {
                        graphqlApi: warehouse.getHouseEquipArgList,
                        graphqlKey: {qfilter: {key: "id", value: '%%', operator: "LIKE"}}
                    },
                    buttonList: [
                        {name: '查看'}
                    ],
                    equipId: '',
                    haveButton: true
                },
                dialog: {
                    title: '',
                    select: {
                        model: "",
                        list: '',
                        title: ''
                    }
                },
                form: {},
                searchKey: ['category.genre.name', 'category.name', 'name', 'model'],
            }
        },
        watch: {
            'select.selectItem': {
                deep: true,
                handler() {
                    /* this.table.graphqlTable.graphqlKey.qfilter.value = this.select.selectItem;*/
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
            'search': {
                handler(newval) {
                    let next = {};
                    this.searchKey.forEach(item => {
                        this.getNext(next, item)
                    });
                    this.$set(this.table.graphqlTable.graphqlKey.qfilter, 'next', next.next);
                    this.$set(this.table.graphqlTable.graphqlKey.qfilter, 'combinator', 'AND');
                }
            }
        },
        created() {
        },
        methods: {
            getNext(next, apolloKey) {
                let flag = true;
                for (let key in next) {
                    if (key == 'next') {
                        flag = false;
                        if (next[key].combinator == undefined) {
                            next[key].combinator = 'OR';
                        }
                        this.getNext(next[key], apolloKey);
                    }
                }
                if (flag) {
                    next.next = {
                        key: apolloKey,
                        operator: 'LIKE',
                        value: '%' + this.search + '%'
                    };
                }
            },
            getSearch(data) {
                this.search = data
            },
            getCommonHouseList() {
                this.gqlQuery(warehouse.getCommonHouseList, {id: this.cascader.selectCascader}, (data) => {
                    if (data != '') {
                        this.select.list = [];
                        data.forEach(item => {
                            this.select.list.push({
                                key: item.name,
                                value: item.id
                            })
                        });
                        this.$set(this.select, 'selectItem', this.select.list[0].value);
                    } else {
                        this.select.list = [];
                        this.select.selectItem = '';
                        this.$message('该单位没有仓库')
                    }
                }, true)
            },
            clickTable(table) {
                let data = table.row;
                if (data) {
                    this.table.equipId = data.id;
                    this.table.flag = !this.table.flag
                }
            },
            dialogConfirm() {
                this.addGrapahql();
            },
            addGrapahql() {
                this.$refs.dialog.hide();
                this.$refs.form.gqlValidate(warehouse.categorySave,
                    {category: this.form}, (data) => {
                        console.log(data);
                        this.$message.success('操作成功');
                        this.form = {};
                    });
            },
            add(name) {
                if (name == 'category') {
                    this.dialog = {
                        select: {
                            model: 'type',
                            title: '选择大类',
                            list:
                                [
                                    {key: '防护、防爆装备', val: 'PROTECTIVE_EQUIP'},
                                    {key: '观察、通信及照明器材', val: 'OBSERVED_COMMUNICATE_ILLUMINE_EQUIP'},
                                    {key: '警械类', val: 'POLICE_EQUIP'},
                                    {key: '生活保障物资', val: 'LIFE_SUPPORT_MATERIAL'},
                                    {key: '抢险救援装备', val: 'EMERGENCY_RESCUE_EQUIP'},
                                    {key: '其他装备物资', val: 'OTHER_EQUIP'}
                                ]
                        },
                        dialogList: [
                            {model: 'name', label: '小类名称'}
                        ],
                        title: '新增大类'
                    };
                    this.$refs.dialog.show();
                } else {
                    this.header.title = '新增装备信息'
                    this.viewStatus.flag = !this.viewStatus.flag;
                }
            },
            inputs(data) {
                console.log('input', data);
            }
        }
    }
</script>

<style scoped>
    .warehouse {
        display: flex;
        width: 100%;
        flex-direction: column;
        font-size: 16px;
    }

    .warehouse .body {
        width: 100%;
    }

    .warehouse .action-bar {
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: left;
        flex-direction: row;
        padding-left: 20px;
        width: 100%;
    }

    .action-bar .select {
        margin-left: 29px;
    }

    .action-bar .equip-title {
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }

    .action-bar .action-button {
        margin-left: 27px;
        color: rgba(112, 112, 112, 1);
    }

</style>