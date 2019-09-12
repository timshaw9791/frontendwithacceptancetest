<template>
    <div class="branch">
        <div class="some" style="margin-top: 10px;margin-bottom: 10px">
            <form-container style="display: flex;flex-direction: row;align-items: center">
                <field-input style="margin: 0px 0px 0" v-model="from.search" label="搜索" width="2"
                             prop="search"></field-input>
                <field-select style="margin: 0px 0px 0" :label="from.select.title" v-model="from.select.checkItem"
                              width="2"
                              :list="from.select.list"></field-select>
                <field-date-picker style="margin: 0px 0px 0" v-model="from.time.times" label="选择日期" width="4"
                                   prop="times" :type="from.time.type"></field-date-picker>
                <field-select style="margin: 0px 0px 0" :label="from.selectOperate.title" v-model="from.selectOperate.checkItem"
                              width="2"
                              :list="from.selectOperate.list"></field-select>
            </form-container>
        </div>
        <label-tree :tree="tree" :table="table"  @clickTable="clickTable" ref="las" @treeEmit="clickTree"
                    :tableFlag="table.flag" :width="table.width"></label-tree>
    </div>
</template>

<script>
    import organUnitGql from 'gql/organUnit.gql'
    import equipRecord from 'gql/equipRecord.gql'
    import warehouse from 'gql/warehouse.gql'
    import labelTree from 'common/vue/labelTree'
    import {fetchMixin} from 'field/common/mixinFetch'

    export default {
        components: {
            labelTree
        },
        name: "equipmentRecord",
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
                        {lable: '操作', field: 'operate', filter: this.filterOperate}
                    ],
                    graphqlTable: {
                        graphqlApi: equipRecord.getEquipOperateRecordList,
                        graphqlKey: {qfilter: {key: "houseId", operator: "EQUEAL", value: ""}}
                    },
                    haveButton: false,
                    width: 100
                },
                from: {
                    select: {
                        checkItem: {},
                        list: [],
                        title: '选择仓库'
                    },
                    selectOperate:{
                        checkItem: {},
                        list: [
                            {key:"全部",value:""},
                            {key:"归还",value:"RETURN"},
                            {key:"领取",value:"RECEIVE"},
                            {key:"维修",value:"MAINTAIN"},
                            {key:"保养",value:"UPKEEP"},
                            {key:"报废",value:"SCRAP"},
                            {key:"充电",value:"CHARGE"}
                        ],
                        title: '操作大类'
                    },
                    time: {
                        times: '',
                        type: 'datetimerange'
                    },
                    search:''
                },
                searchKey: {
                    startTime: '',
                    endTime: '',
                    operate: '',
                    equipSerial: '',
                    equipName: '',
                    operator: ''
                },
                searchType: {
                    LIKE: [
                        "equipName",
                        "operator",
                        "equipSerial"
                    ],
                    EQUEAL:["operate"],
                    NOTLESSTHAN:["startTime"],
                    NOTGREATTHAN:["endTime"],
                    Combinator:{
                        OR:["equipName","equipSerial","operator"],
                        AND:["startTime","operate","endTime"],
                        NOT:[]
                    }
                }
            }
        },
        created(){
            this.initSearch(this.searchType)
        },
        watch: {
            'from.select.checkItem': {
                deep: true,
                handler(newVal) {
                    console.log(newVal);
                    this.$set(this.table.graphqlTable.graphqlKey.qfilter,'value', newVal.value.id);

                }
            },
            'from.selectOperate.checkItem':{
                deep: true,
                handler(newVal) {
                    this.searchKey.operate.value=newVal.value;
                    this.modifyQfilter()
                }
            },
            'from.time.times': {
                deep: true,
                handler(newVal) {
                    this.searchKey.startTime.value=newVal[0];
                    this.searchKey.endTime.value=newVal[1];
                    this.modifyQfilter()
                }
            },
            'from.search':{
                deep:true,
                handler(newVal) {
                    this.searchType.Combinator.OR.forEach(item=>{
                        this.searchKey[item].value="%"+newVal+"%"
                    });
                    this.modifyQfilter()
                }
            }
        },
        methods: {
            clickTable(data) {
                if (data) {}
            },
            modifyQfilter(){
                if(this.table.graphqlTable.graphqlKey.qfilter.value!=''){
                    this.getNext();
                }else {
                    this.$message.error("请先选择公安局与仓库")
                }
            },
            initSearch(type){
                for(let typeName in type){
                    if(typeName!="Combinator"){
                        type[typeName].forEach(item=>{
                            let key = item;
                            if(item=='endTime'){
                                key = 'startTime'
                            }
                            this.searchKey[item]={
                                key: key,
                                operator: typeName,
                                value: ''
                            }
                        })
                    }
                }
            },
            getNext() {
                let apllo = JSON.parse(JSON.stringify(this.searchKey));
                let CombinatorList = this.searchType.Combinator;
                let Combinator='';
                let nexts ={};
                for(let sort in apllo){
                    if(apllo[sort].value!=''){
                        nextApollo(nexts,apllo[sort])
                    }
                }
                console.log(nexts);
                if(nexts.next.key!=undefined||nexts.next!=undefined){
                    this.$set(this.table.graphqlTable.graphqlKey.qfilter,'next', nexts.next);
                    this.$set(this.table.graphqlTable.graphqlKey.qfilter,'combinator', "AND");
                }
                function nextApollo(next,apollo) {
                    let flag = true;
                    for (let key in next){
                        if(key=='next'){
                            flag =false;
                            if(next[key].combinator==undefined){
                                for(let combinator in CombinatorList){
                                    let flag = CombinatorList[combinator].indexOf(next[key].key,0)
                                    if(flag!=-1){Combinator = combinator;}
                                }
                                next[key].combinator=Combinator;
                            }
                            nextApollo(next[key],apollo);
                        }
                    }
                    if(flag){
                        next.next=apollo;
                    }
                }
            },
            filterOperate(row) {
                let operate = row.operate;
                switch (operate) {
                    case 'RETURN':
                        operate = "归还";
                        break;
                    case 'RECEIVE':
                        operate = "领取";
                        break;
                    case 'MAINTAIN':
                        operate = "维修";
                        break;
                    case 'UPKEEP':
                        operate = "保养";
                        break;
                    case 'SCRAP':
                        operate = "报废";
                        break;
                    case 'CHARGE':
                        operate = "充电";
                        break;
                }
                return operate
            },
            filterTime(row) {
                return new Date(parseInt(row.startTime || row.endTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            clickTree(data) {
                if (data) {
                    this.gqlQuery(warehouse.getCommonHouseList, {id: this.tree.node.id}, (data) => {
                        this.from.select.list = [];
                        data.forEach(item => {
                            this.from.select.list.push({
                                key: item.name,
                                value: item
                            })
                        })
                    }, true)
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