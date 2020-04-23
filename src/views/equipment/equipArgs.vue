<template>
    <div>
        <div class="equipArgs-container">
                <div class="equipArgs-body" v-if="!storageInfoShow">
                    <my-header :title="title"></my-header>
                    <div class="equipArgs-info" >
                        <text-input label="装备名称" placeholder="请输入装备名称"></text-input>
                        <base-button label="查询"></base-button>
                        <base-button label="新增装备参数" @click="goInfo('add')"></base-button>
                        <entityInput :options="{search:'equipArgsSelect'}"></entityInput>
                        <base-button label="测试" @click="test()"></base-button>
                    </div>
                    <define-table :data="equipArgsList">
                        <define-column label="操作" v-slot="{data}">
                            <span @click="goInfo('look',data.row)">详情</span>
                        </define-column>
                        <define-column label="装备名称" field="name"></define-column>
                        <define-column label="装备型号" field="model"></define-column>
                        <define-column label="供应商" field="supplier.name"></define-column>
                        <define-column label="质保期" field="shelfLife"></define-column>
                        <define-column label="充电周期" field="chargeCycle"></define-column>
                        <define-column label="保养周期" field="upkeepCycle"></define-column>
                    </define-table>
                </div>
                <storage-info :equipId="equipId" v-if="storageInfoShow" :equipList="equipList" :getPropEquip="propEquip"  :title="title" @black="black"></storage-info>
        </div>
    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import serviceDialog from 'components/base/serviceDialog/index'
    import storageInfo from 'views/equipment/storageInfos'
    import r_label from 'common/vue/ajaxLabel'
    import myHeader from "../../components/base/header/header"
    import textInput from "../../componentized/textBox/textInput";
    import {getEquipArgs} from "../../api/equipArgs";
    import entityInput from "../../componentized/entity/entityInput";

    export default {
        data() {
            return {
                title: '装备参数',
                haveBack:false,
                inquire: '%%',
                options: [],
                commonHouseId: '',
                equipId: '',
                propEquip: {}, // 跳转到入库装备，自动选择的装备数据
                equipList: {}, // 装备数据
                equipData: {}, // 用以暂存新增成功的装备参数
                storageInfoShow: false,
                list: [],
                equipArgsList:[],
                table: {
                    labelList: [
                        {lable: '装备名称', field: 'name'},
                        {lable: '装备型号', field: 'model'},
                        {lable: '供应商', field: 'supplier.name' },
                    ],
                    url:'/equip/findByNameOrModelLike',
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'}, {name: '入库', type: 'primary'}]
                    },
                    search:'',
                },
                mode: true,
                inlineForm: {
                    rfid: '',
                    newRfid: '',
                },
                delEquipObj: {},
                dialogVisible: false,
                writeAll: [],
                writeIndex: '',
                pid: '',
                modeType: '',
                com: 0,
                index: false, // 进程回调判断
            }
        },
        methods: {
            equipArgsInfo(data){
               console.log(data)
            },
            supplierInfo(supplier){
                console.log(supplier)
            },
            clickTable(table) {
                if(table.name === '详情') {
                    this.goInfo('look', table.row)
                } else {
                    this.goInfo('in', table.row)
                }
            },
            goInfo(data, row) {
                switch (data) {
                    case 'add':
                        this.storageInfoShow = true;
                        this.title = '新增装备参数';
                        this.equipId = '';
                        this.haveBack = true
                        break;
                    case 'look':
                        this.storageInfoShow = true;
                        this.title = '装备参数详情';
                        this.equipName = row.name
                        this.equipList = row
                        break;
                    case 'in':
                        this.storageInfoShow = true;
                        this.title = '入库装备';
                        this.propEquip = row;
                        break
                }
            },
            toInHouse() {
                this.$refs.tipDialog.hide()
                this.goInfo('in', this.equipData)
            },
            black(state=null) {
                this.storageInfoShow = false;
                if(state) {
                    this.equipData = state
                    this.$refs.tipDialog.show()
                }
            },
            test(){
                getEquipArgs().then(res => {
                    this.equipArgsList = res.content
                })
            }
        },
        updated() {
            getEquipArgs().then(res => {
              this.equipArgsList = res.content
            })
        },
        components: {
            tabs,
            r_label,
            storageInfo,
            serviceDialog,
            textInput,
            myHeader,
            entityInput
        },
    }
</script>
<style lang="scss" scoped>
    .equipArgs-container {
        color: #707070FF;
        font-size: 16px;
    }

    .equipArgs-info {
        padding: 16px 7px;
        overflow: hidden;
    }

    .equipArgs-body {
        padding: 0 17px;
    }
    .el-card {
        border: none !important;
        font-size: 0.0833rem;
    }

    // 可调整
    // ._card-title {
    //     font-size: 0.0938rem;
    // }
    // 可调整
    // ._textBt {
    //     font-size: 0.0833rem !important;
    // }

    .pattern-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 1.5729rem;

        .pattern {
            width: 0.6354rem;
            height: 0.4844rem;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            opacity: 1;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .dialogButton {
        margin-left: 0.151rem;
        font-size: 0.0833rem;

        .icon {
            vertical-align: top !important;
        }
    }

    .rfidList {
        border: 1px solid rgba(112, 112, 112, 1);
        width: 2.7188rem;
        max-height: 0.9323rem;
        min-height: 0.9323rem;
        margin: auto;
        overflow: auto;
        padding: 0.0833rem;

        .rfid {
            margin-bottom: 0.0521rem;
            color: rgba(112, 112, 112, 1);
            font-size: 0.0833rem;
            display: flex;

            .rfid-left {
                width: 81%;
            }
        }
    }
    .define-column{
        .span{
            margin-left: 10px;
        }
    }

</style>