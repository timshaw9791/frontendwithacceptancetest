<template>
    <div>
        <el-card shadow="never" v-if="!storageInfoShow">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs>
                    <!--<el-cascader-->
                    <!--:options="options"-->
                    <!--:show-all-levels="false"-->
                    <!--&gt;</el-cascader>-->

                    <el-button type="text" class="_textBt" @click="goInfo('add')">
                        <svg-icon icon-class="加"/>
                        新增装备信息
                    </el-button>
                    <el-button type="text" class="_textBt" @click="goInfo('storage')">
                        <svg-icon icon-class="加"/>
                        装备入库
                    </el-button>

                    <el-button type="text" class="_textBt" @click="goInfo('rfid')">
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
                    </template>
                </el-table-column>
            </el-table>
            <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
        </el-card>

        <storageInfo :equipId="equipId" v-if="storageInfoShow" :title="title" @black="black"></storageInfo>

        <service-dialog ref="dialogPattern" title="选择模式" width="634px" :button="false" @cancel="cancelPattern">
            <div class="pattern-box">
                <el-button class="pattern" v-text="'连号模式'" @click="rfidMode('serial')"></el-button>
                <el-button class="pattern" style="margin-left: 109px" v-text="'单件模式'" @click="rfidMode('singleton')"></el-button>
            </div>

            <!--<el-button type="text" class="dialogButton" style="margin-bottom: 20px" @click="mode=!mode">-->
                <!--<svg-icon icon-class="切换模式" class="icon"/>-->
                <!--切换模式-->
            <!--</el-button>-->


            <!--<div v-if="mode">-->
                <!--<div class='rfidList'>-->
                    <!--<div v-for="(item,index) in writeAll" class="rfid">-->
                        <!--<div class="rfid-left">-->
                            <!--RFID{{index+1}} : <span>{{item.epc}}</span>-->
                        <!--</div>-->
                        <!--<span>{{item.status==='succeed'?'写入成功':'写入失败'}}</span>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="_button">-->
                    <!--<el-button type="primary" size="medium">重新写入</el-button>-->
                <!--</div>-->
            <!--</div>-->

            <!--<div v-else>-->
                <!--<form-container ref="inlineForm" :model="inlineForm">-->
                    <!--<field-input v-model="inlineForm.rfid" size="medium" label="RFID:" width="8"-->
                                 <!--:disabled="true"></field-input>-->
                    <!--<el-button style="margin-left: 12px" type="primary" @click='writeone'>读取</el-button>-->
                    <!--<br/>-->
                    <!--<field-input v-model="inlineForm.newRfid" prop="newRfid"-->
                                 <!--:rules="r(true).all(R.rfid)" size="medium" label="修改RFID:" width="8"></field-input>-->
                <!--</form-container>-->
                <!--<div class="_button">-->
                    <!--<el-button size="medium" @click="$refs.dialog.hide()">取消</el-button>-->
                    <!--<el-button type="primary" size="medium" @click="saveOne(inlineForm.newRfid)">写入</el-button>-->
                <!--</div>-->
            <!--</div>-->

        </service-dialog>
        <service-dialog ref="dialogModify" title="修改RFID" width="634px" :button="false" @cancel="cancel">

            <!--<el-button type="text" class="dialogButton" style="margin-bottom: 20px" @click="mode=!mode">-->
                <!--<svg-icon icon-class="切换模式" class="icon"/>-->
                <!--切换模式-->
            <!--</el-button>-->


            <div v-if="modeType=='serial'">
                <div class='rfidList'>
                    <div v-for="(item,index) in writeAll" class="rfid">
                        <div class="rfid-left">
                            RFID{{index+1}} : <span>{{item.epc}}</span>
                        </div>
                        <span>{{item.status==='succeed'?'写入成功':'写入失败'}}</span>
                    </div>
                </div>
                <div class="_button">
                    <el-button type="primary" size="medium">重新写入</el-button>
                </div>
            </div>

            <div v-else>
                <form-container ref="inlineForm" :model="inlineForm">
                    <field-input v-model="inlineForm.rfid" size="medium" label="RFID:" width="8"
                                 :disabled="true"></field-input>
                    <el-button style="margin-left: 12px" type="primary" @click='writeone'>读取</el-button>
                    <br/>
                    <field-input v-model="inlineForm.newRfid" prop="newRfid"
                                 :rules="r(true).all(R.rfid)" size="medium" label="修改RFID:" width="8"></field-input>
                </form-container>
                <div class="_button">
                    <el-button size="medium" @click="$refs.dialogModify.hide()">取消</el-button>
                    <el-button type="primary" size="medium" @click="saveOne(inlineForm.newRfid)">写入</el-button>
                </div>
            </div>

        </service-dialog>

    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import storageInfo from 'views/equipment/storageInfo'
    import api from 'gql/eqList.gql'
    import serviceDialog from 'components/base/serviceDialog/index'
    import {formRulesMixin} from "../../field/common/mixinTable";
    import {getRfid, saveRfid} from "api/rfid";

    const cmdPath = 'C:\\Users\\Administrator';
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
                writeAll: [],
                writeIndex: '',
                pid: '',
                modeType:''
            }
        },
        components: {
            tabs,
            storageInfo,
            serviceDialog
        },
        methods: {
            cancelPattern(){

            },
            rfidMode(mode){
                this.modeType=mode;
                if(this.modeType=='serial'){
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
                        // this.$refs.dialog.show();
                        //
                        // if (this.mode) {
                        //     getRfid().then(res => {
                        //         console.log(res);
                        //         const process = exec(`java -jar auto.jar 5 ${res}`, {cwd: cmdPath});
                        //         this.pid = process.pid;
                        //         let start = false;
                        //         process.stdout.on('data', (data) => {
                        //             console.log(data);
                        //             let newData = JSON.parse(data);
                        //             console.log(newData);
                        //             if (start === true) {
                        //                 this.writeAll.push(newData);
                        //                 this.writeIndex = newData;
                        //                 console.log(this.writeAll);
                        //                 console.log(this.writeIndex);
                        //             } else if (start === false) {
                        //                 newData.status === 'succeed' && !newData.epc ? start = true : start = false;
                        //             }
                        //         });
                        //         process.stderr.on('data', (err) => {
                        //             console.log(err);
                        //         });
                        //         process.on('exit', (code) => {
                        //             console.log(`子进程退出，退出码 ${code}`);
                        //         });
                        //     });
                        // } else {
                        //
                        //
                        // }


                        break;

                }
            },
            serialRfid(){
                    getRfid().then(res => {
                        console.log(res);
                        const process = exec(`java -jar auto.jar 5 ${res}`, {cwd: cmdPath});
                        this.pid = process.pid;
                        let start = false;
                        process.stdout.on('data', (data) => {
                            console.log(data);
                            let newData = JSON.parse(data);
                            console.log(newData);
                            if (start === true) {
                                this.writeAll.push(newData);
                                this.writeIndex = newData;
                                console.log(this.writeAll);
                                console.log(this.writeIndex);
                            } else if (start === false) {
                                newData.status === 'succeed' && !newData.epc ? start = true : start = false;
                            }
                        });
                        process.stderr.on('data', (err) => {
                            console.log(err);
                        });
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
                    saveRfid({"rfidGeneric": this.writeIndex.epc}).then(res1 => {
                        console.log(res1);
                        spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);
                        this.writeIndex = '';
                        this.writeAll = [];
                    })
                } else {
                    this.inlineForm = {
                        rfid: '',
                        newRfid: '',
                    }
                }
            },
            writeone() {
                exec(`java -jar reading.jar 5`, {cwd: cmdPath}, (err, data) => {
                    console.log(data);
                    if (data.includes('succeed')) {
                        console.log(data.split('\n')[1]);
                        this.inlineForm.rfid = data.split('\n')[1];
                    }
                })
            },
            saveOne(data) {
                exec(`java -jar writing.jar 5 ${data}`, {cwd: cmdPath}, (err, data) => {
                    console.log(data);
                    if (data.includes('succeed')) {
                        this.$message.success('修改成功!');
                    }
                })
            },
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipList);
            },
        },
        mounted() {

        },
        mixins: [formRulesMixin],

        watch: {
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

    .pattern-box{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 302px;
        .pattern{
            width:122px;
            height:93px;
            background:rgba(255,255,255,1);
            box-shadow:0px 3px 6px rgba(0,0,0,0.16);
            opacity:1;
            border-radius:8px;
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
                width: 82%;
            }
        }
    }

</style>