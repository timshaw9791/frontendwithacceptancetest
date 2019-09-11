<template>
    <div>
        <el-card shadow="never" v-if="!storageInfoShow">

            <!--element card 的头部-->

            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>


            <!--操作拦-->
            <div>
                <tabs>
                    <el-button type="text" class="_textBt" @click="goInfo('add')">
                        <svg-icon icon-class="加"/>
                        新增装备信息
                    </el-button>
                    <el-button type="text" class="_textBt" @click="goInfo('storage')">
                        <svg-icon icon-class="加"/>
                        装备入库
                    </el-button>

                    <el-button type="text" class="_textBt" @click="goInfo('rfid')" v-if="authentication">
                        <svg-icon icon-class="加"/>
                        修改RFID
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="RFID/类型/类别/名称/型号"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
            </div>

            <!--list列表-->

            <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                      fit>
                <bos-table-column lable="RFID" field="rfid"></bos-table-column>
                <bos-table-column lable="装备类型" field="equipArg.category.genre.name"></bos-table-column>
                <bos-table-column lable="装备类别" field="equipArg.category.name"></bos-table-column>
                <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                <bos-table-column lable="供应商" field="equipArg.supplier.name"></bos-table-column>
                <el-table-column label="操作" align="supplier" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="goInfo('look',scope.row)">查看</el-button>
                        <el-button size="mini" @click="toDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
        </el-card>


        <!--内部业务组件-->

        <storageInfo :equipId="equipId" v-if="storageInfoShow" :title="title" @black="black"></storageInfo>


        <!--RFID遮罩层 -->

        <service-dialog ref="dialogPattern" title="选择模式" width="634px" :button="false" @cancel="cancelPattern">
            <div class="pattern-box">
                <el-button class="pattern" v-text="'连号模式'" @click="rfidMode('serial')"></el-button>
                <el-button class="pattern" style="margin-left: 109px" v-text="'单件模式'"
                           @click="rfidMode('singleton')"></el-button>
            </div>
        </service-dialog>

        <!--RFID遮罩层 -->

        <service-dialog ref="dialogModify" title="修改RFID" width="634px" :button="false" @cancel="cancel">

            <div v-if="modeType=='serial'">
                <div class='rfidList'>
                    <div v-for="(item,index) in writeAll" class="rfid">
                        <div class="rfid-left">
                            RFID{{index+1}} : <span>{{item.epc}}</span>
                        </div>
                        <span>{{item.status==='succeed'?'写入成功':'已重复请下一个'}}</span>
                    </div>
                </div>
                <div class="_button">
                    <el-button type="primary" size="medium" @click="">重新写入</el-button>
                </div>
            </div>

            <div v-else>
                <form-container ref="inlineForm" :model="inlineForm">
                    <field-input v-model="inlineForm.rfid" size="medium" label="RFID:" width="8"
                                 :disabled="true"></field-input>
                    <el-button style="margin-left: 12px" type="primary" @click='writeone'>读取</el-button>
                    <br/>
                    <field-input v-model="inlineForm.newRfid" size="medium" label="修改RFID:" width="8"></field-input>
                </form-container>
                <div class="_button">
                    <el-button size="medium" @click="$refs.dialogModify.hide()">取消</el-button>
                    <el-button type="primary" size="medium" @click="saveOne(inlineForm.newRfid)">写入</el-button>
                </div>
            </div>

        </service-dialog>

        <!--提示的遮罩层 -->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <span>确定删除？</span>
            <span slot="footer" >
               <el-button @click="dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="delEquip">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import storageInfo from 'views/equipment/storageInfo'
    import api from 'gql/eqList.gql'
    import serviceDialog from 'components/base/serviceDialog/index'
    import {formRulesMixin} from "../../field/common/mixinComponent";
    import {getRfid, saveRfid} from "api/rfid";
    import request from 'common/js/request'
    import {baseURL} from "../../api/config";

    // nodejs调用子进程的方法

    const cmdPath = 'C:\\Users\\Administrator';   //cmd命令的位置
    const exec = window.require('child_process').exec;
    const spawn = window.require('child_process').spawn;


    export default {
        data() {
            return {
                inquire: '%%',
                options: [],
                commonHouseId: '',
                equipId: '',
                title: '',
                storageInfoShow: false,
                list: [],
                param: {
                    qfilter: {
                        "key": "rfid",
                        "operator": "LIKE",
                        value: '%%',
                    }
                },
                mode: true,
                inlineForm: {
                    rfid: '',
                    newRfid: '',
                },
                delEquipObj:{},
                dialogVisible: false,
                writeAll: [],
                writeIndex: '',
                pid: '',
                modeType: '',
                com: 0
            }
        },
        components: {
            tabs,
            storageInfo,
            serviceDialog
        },
        methods: {
            cancelPattern() {

            },
            delEquip() {
                request({
                    method:'DELETE',
                    url:baseURL+'/equips/'+this.delEquipObj.id,
                }).then(res=>{
                    this.$message.success('删除成功');
                    this.refetch();
                    this.dialogVisible=false;
                });
            },
            toDel(data){
                this.delEquipObj=data;
                this.dialogVisible=true
            },
            rfidMode(mode) {
                this.modeType = mode;
                if (this.modeType == 'serial') {
                    this.serialRfid();
                }
                this.$refs.dialogModify.show();
            },
            goInfo(data, row) {
                switch (data) {
                    case 'add':
                        this.storageInfoShow = true;
                        this.title = '新增装备信息';
                        this.equipId = '';
                        break;
                    case 'storage':
                        this.storageInfoShow = true;
                        this.title = '装备入库';
                        this.equipId = '';
                        break;
                    case 'look':
                        this.storageInfoShow = true;
                        this.title = '装备查看';
                        this.equipId = row.id;
                        break;
                    case 'rfid':
                        this.$refs.dialogPattern.show();
                        break;
                }
            },
            serialRfid() {
                getRfid().then(res => {

                    //是以流的形式,可以监听
                    const process = exec(`java -jar auto.jar ${this.com} ${res}`, {cwd: cmdPath}); //调用cmd执行读写器
                    this.pid = process.pid;
                    let start = false;

                    //成功的时候
                    process.stdout.on('data', (data) => {
                        let newData = JSON.parse(data);
                        console.log(newData);
                        if (start === true) {
                            this.writeAll.unshift(newData);
                            this.writeIndex = newData;
                        } else if (start === false) {
                            newData.status === 'succeed' && newData.epc === undefined ? start = true : start = false;
                        }
                    });

                    //报错的时候
                    process.stderr.on('data', (err) => {
                        console.log(err);
                        this.$message.error('设备故障请重新插拔!');
                    });

                    //退出的时候
                    process.on('exit', (code) => {
                        console.log(`子进程退出，退出码 ${code}`);
                    });
                });
            },
            black(data) {
                this.storageInfoShow = false;
                this.refetch();
            },
            cancel(data) {
                if (this.writeIndex) {
                    let epc = `0X${this.writeIndex.epc}`;
                    let newData = parseInt(epc) + 1;
                    saveRfid({"rfidGeneric": newData.toString(16)}).then(res1 => {

                        spawn("taskkill", ["/PID", this.pid, "/T", "/F"]); //杀死进程
                        this.writeIndex = '';
                        this.writeAll = [];
                    })

                } else {
                    spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);//杀死进程
                    this.inlineForm = {
                        rfid: '',
                        newRfid: '',
                    };
                }
            },
            writeone() {
                //执行一次不能监听
                exec(`java -jar reading.jar ${this.com}`, {cwd: cmdPath}, (err, data) => {
                    console.log(data);
                    if (data.includes('succeed')) {
                        console.log(data.split('\n')[1]);
                        // this.inlineForm.rfid = data.split('\n')[1];
                        this.$set(this.inlineForm, 'rfid', data.split('\n')[1]);
                    }
                })
            },
            saveOne(data) {

                this.$refs.inlineForm.axiosData(
                    exec(`java -jar writing.jar ${this.com} ${data}`, {cwd: cmdPath}, (err, data) => {
                        console.log(data);
                        if (data.includes('succeed')) {
                            this.$message.success('修改成功!');
                        }
                    })
                );

            },
            getConfig() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                    // this.$message.success('退出成功');
                })
            }
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipList); //  graphql结合自定义组件的mixin方法 传入语句即可
            },
        },
        mounted() {
        },
        created() {
            this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];//获取到串口号
        },
        mixins: [formRulesMixin],
        computed:{
            authentication(){
                let auth = JSON.parse(localStorage.getItem('user')).role;
                if(auth[0]=='SUPER_ADMINISTRATOR'){
                    return true
                }else {
                    return false
                }
            }
        },
        watch: {
            //监听搜索关键词, 因为写过监听param所以修改param可以实现发送graphql请求
            inquire(newVal, oldVal) {
                this.param.namelike = newVal;
                this.param['qfilter'] = {
                    "combinator": "OR",
                    "key": "rfid",
                    "operator": "LIKE",
                    value: newVal,
                    "next": {
                        "combinator": "OR",
                        "key": "equipArg.category.genre.name",
                        "operator": "LIKE",
                        value: newVal,
                        "next": {
                            "combinator": "OR",
                            "key": "equipArg.category.name",
                            "operator": "LIKE",
                            value: newVal,
                            "next": {
                                "combinator": "OR",
                                "key": "name",
                                "operator": "LIKE",
                                value: newVal,
                                "next": {
                                    "combinator": "OR",
                                    "key": "equipArg.model",
                                    "operator": "LIKE",
                                    value: newVal,
                                }
                            }
                        }
                    }
                };

            }
        }

    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

    .pattern-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 302px;

        .pattern {
            width: 122px;
            height: 93px;
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
        margin-left: 29px;
        font-size: 16px;

        .icon {
            vertical-align: top !important;
        }
    }

    .rfidList {
        border: 1px solid rgba(112, 112, 112, 1);
        width: 522px;
        max-height: 179px;
        min-height: 179px;
        margin: auto;
        overflow: auto;
        padding: 16px;

        .rfid {
            margin-bottom: 10px;
            color: rgba(112, 112, 112, 1);
            font-size: 16px;
            display: flex;

            .rfid-left {
                width: 81%;
            }
        }
    }

</style>
