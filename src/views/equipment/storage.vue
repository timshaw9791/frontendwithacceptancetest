<template>
    <div>
        <el-card shadow="never" v-if="!storageInfoShow&&storageListShow">

            <!--element card 的头部-->

            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>


            <!--操作拦-->
            <div>
                <tabs>
                    <el-button type="text" class="_textBt" @click="goInfo">
                        <svg-icon icon-class="加" class="textBt"/>
                        入库装备
                    </el-button>
                    <el-checkbox v-model="abnormal" @change="changeState">异常单</el-checkbox>
                    <div class="_buttons">
                        <BosInput
                                placeholder="单号"
                                suffix="el-icon-search"
                                v-model="table.search"
                                :wrapforlike="true"
                                style="width:285px;">
                        </BosInput>
                    </div>
                </tabs>
            </div>

            <!--list列表-->
            <r_label :table="table" ref="lable" @clickTable="clickTable" :buttonState="true" :otherParams="true"></r_label>
            <!--<el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"-->
                      <!--fit>-->
                <!--<bos-table-column lable="RFID" field="rfid"></bos-table-column>-->
                <!--<bos-table-column lable="装备类型" field="equipArg.category.genre.name"></bos-table-column>-->
                <!--<bos-table-column lable="装备小类" field="equipArg.category.name"></bos-table-column>-->
                <!--<bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>-->
                <!--<bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>-->
                <!--<bos-table-column lable="供应商" field="equipArg.supplier.name"></bos-table-column>-->
                <!--<el-table-column label="操作" align="supplier" width="200">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button type="primary" size="mini" @click="goInfo('look',scope.row)">查看</el-button>-->
                        <!--<el-button type="danger" size="mini" @click="toDel(scope.row)">删除</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            <!--</el-table>-->
            <!--<bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>-->
        </el-card>


        <!--内部业务组件-->

        <storageInfo :equipId="equipId" v-if="storageInfoShow" :title="title" @black="black"></storageInfo>
        <in-storage-list v-if="!storageListShow" title="入库单详情" :equipData="equipData" @black="storageListShow=true"></in-storage-list>

        <!--提示的遮罩层 -->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <span>确定删除？</span>
            <span slot="footer">
               <el-button @click="dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="delEquip">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import storageInfo from 'views/equipment/storageInfos'
    import inStorageList from 'components/equipment/inStorageList'
    import serviceDialog from 'components/base/serviceDialog/index'
    // import {formRulesMixin} from "../../field/common/mixinComponent";
    import {getRfid, saveRfid} from "api/rfid";
    import { inHouseOrder } from "api/storage"
    import request from 'common/js/request'
    import {baseURL} from "../../api/config";
    import { start, startOne, killProcess } from 'common/js/rfidReader'
    import r_label from 'common/vue/ajaxTabel'
    // nodejs调用子进程的方法

    // const cmdPath = 'C:\\Users\\Administrator';   //cmd命令的位置
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";

    export default {
        data() {
            return {
                inquire: '%%',
                options: [],
                commonHouseId: '',
                equipId: '',
                delEquipId: '',
                title: '',
                storageInfoShow: false,
                storageListShow: true,
                list: [],
                table: {
                    labelList: [
                        {lable: '入库单号', field: 'orderNumber'},
                        {lable: '装备数量', field: 'count'},
                        {lable: '操作人员', field: 'operatorInfo.operator', },
                        {lable: '入库时间', filter: (row) => this.$filterTime(row.createTime)},
                    ],
                    url:'/inouthouse/findInHouseNumberLike',
                    tableAction:{
                        label:'操作',
                        button:[{name:'详情',type:'primary'},{name:'删除',type:'danger'}]
                    },
                    search:'',
                    abnormal: false
                },
                equipData: {}, // 入库单数据
                abnormal: false, // 是否只显示异常单
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
        components: {
            tabs,
            storageInfo,
            inStorageList,
            serviceDialog,
            r_label
        },
        methods: {
            clickTable(table) {
                if(table.name==='详情'){
                    this.equipData = table.row
                    this.storageListShow = false
                }else {
                    this.delEquipId = table.row.id
                    this.dialogVisible = true
                }
            },
            cancelPattern() {
               // killProcess();
               killProcess(this.pid)
            },
            delEquip() {
                this.dialogVisible = false
                inHouseOrder(this.delEquipId).then(res => {
                    this.$message.success("删除成功")
                    alert("SprWu11")
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
            },
            // toDel(data) {
            //     this.delEquipObj = data;
            //     this.dialogVisible = true
            // },
            goInfo() {
                this.storageInfoShow = true;
                // this.storageListShow = false
                 this.title = '入库装备';
                // this.equipId = '';
            },
            // 是否显示异常单
            changeState(state) {
                this.table.abnormal = state
            },
            black(data) {
                // this.refetch()
                this.storageInfoShow = false;
            },
            cancel(data) {
                if (this.writeIndex) {
                    let epc = `0X${this.writeIndex.epc}`;
                    let newData = parseInt(epc) + 1;
                    saveRfid({"rfidGeneric": newData.toString(16)}).then(res1 => {
                     //   spawn("taskkill", ["/PID", this.pid, "/T", "/F"]); //杀死进程
                     killProcess(this.pid)
                        this.writeIndex = '';
                        this.writeAll = [];
                    })

                } else {
                    // spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);//杀死进程
                    killProcess(this.pid)
                    this.inlineForm = {
                        rfid: '',
                        newRfid: '',
                    };
                }
            },
            writeone() {
                //执行一次不能监听
                startOne("java -jar reading.jar", (data) => {
                    if(data.includes('succeed')) {
                        console.log(data.split('\n')[1]);
                        // this.inlineForm.rfid = data.split('\n')[1];
                        this.$set(this.inlineForm, 'rfid', data.split('\n')[1]);
                    }
                })
                // exec(`java -jar reading.jar ${this.com}`, {cwd: cmdPath}, (err, data) => {
                //     console.log(data);
                //     if (data.includes('succeed')) {
                //         console.log(data.split('\n')[1]);
                //         // this.inlineForm.rfid = data.split('\n')[1];
                //         this.$set(this.inlineForm, 'rfid', data.split('\n')[1]);
                //     }
                // })
            },
            saveOne(data) {

                this.$refs.inlineForm.axiosData(
                    startOne("java -jar writing.jar", (data) => {
                        console.log(data);
                        if(data.includes('succeed')) {
                            this.$message.success('修改成功!')
                        }
                    })
                    // exec(`java -jar writing.jar ${this.com} ${data}`, {cwd: cmdPath}, (err, data) => {
                    //     console.log(data);
                    //     if (data.includes('succeed')) {
                    //         this.$message.success('修改成功!');
                    //     }
                    // })
                );

            },
            // getConfig() {
            //     this.$store.dispatch('LogOut').then(() => {
            //         location.reload() // 为了重新实例化vue-router对象 避免bug
            //         // this.$message.success('退出成功');
            //     })
            // }
        },
        // apollo: {
        //     list() {
        //         return this.getEntityListWithPagintor(api.getEquipList); //  graphql结合自定义组件的mixin方法 传入语句即可
        //     },
        // },
        // mixins: [formRulesMixin],
        computed: {
            authentication() {
                let auth = JSON.parse(localStorage.getItem('user')).role;
                if (auth[0] == 'SUPER_ADMINISTRATOR') {
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            //监听搜索关键词, 因为写过监听param所以修改param可以实现发送graphql请求
            // inquire(newVal, oldVal) {
            //     this.param.namelike = newVal;
            //     this.param['qfilter'] = {
            //         "combinator": "OR",
            //         "key": "rfid",
            //         "operator": "LIKE",
            //         value: newVal,
            //         "next": {
            //             "combinator": "OR",
            //             "key": "equipArg.category.genre.name",
            //             "operator": "LIKE",
            //             value: newVal,
            //             "next": {
            //                 "combinator": "OR",
            //                 "key": "equipArg.category.name",
            //                 "operator": "LIKE",
            //                 value: newVal,
            //                 "next": {
            //                     "combinator": "OR",
            //                     "key": "name",
            //                     "operator": "LIKE",
            //                     value: newVal,
            //                     "next": {
            //                         "combinator": "OR",
            //                         "key": "equipArg.model",
            //                         "operator": "LIKE",
            //                         value: newVal,
            //                     }
            //                 }
            //             }
            //         }
            //     };
            //
            // }
        },
        beforeDestroy() {
            killProcess(this.pid)
        }

    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
        font-size: 16px;
    }
    
    // 可调整
    // ._card-title {
    //     font-size: 0.0938rem;
    // } 
    // 可调整
    // ._textBt {
    //     font-size: 0.0833rem !important;
    // }
    .el-checkbox {
        /deep/ .el-checkbox__label {
            font-size: 16px;
            color: #2f2f76;
            font-family: sans-serif
        }
    }
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

</style>
