<template>
    <div>
        <dialog-svices ref="transFerDialogApply" width="7.9635rem" :title="typeOperational" :button="false">
            <div class="directAdjustmentDialog">
                <div class="directAdjustmentDialog-header">
                    <div class="header-item">
                        <div class="d_select">
                           <div style="width: 150px"><span v-text="'硬件选择：'"></span></div>
                            <el-select v-model="hardware" placeholder="请选择" size="mini">
                                <el-option
                                        v-for="item in hardwareList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button class="resultButton" v-text="actionReset"
                                       @click="clickResult"></el-button>
                        </div>

                    </div>
                    <div class="header-item"><span v-text="'申请装备表单：'"></span>

                    </div>
                </div>
                <div class="directAdjustmentDialog-body">
                    <div class="leftTable">
                        <el-table
                                :data="directObj.orderItems"
                                height="531"
                                style="width: 100%"
                                :align="align"
                        >
                            <el-table-column
                                    prop="name"
                                    label="装备名称"
                                    width="180"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="model"
                                    label="装备型号"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="count"
                                    label="装备数量"
                                    :align="align"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="rightTable">
                        <el-table
                                :data="rightList"
                                height="531"
                                style="width: 100%"
                                :align="align"
                                :row-class-name="tableRowClassName"
                        >
                            <el-table-column
                                    prop="name"
                                    label="装备名称"
                                    width="180"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="model"
                                    label="装备型号"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="count"
                                    label="装备数量"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    :align="align"
                            >
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" class="deleteButtom"
                                               @click="deleteRow(scope.$index)" :disabled="scope.row.flag"
                                               v-text="'【删除】'"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="directAdjustmentDialog-bottom">
                    <el-button class="cancel" @click="close">取消</el-button>
                    <el-button style="margin-left: 0.1771rem" class="submits" @click="submit">提交</el-button>
                </div>
            </div>
        </dialog-svices>
        <dialog-svices ref="transFerDialogTips" width="3.3021rem" :title="typeOperational+'提示'" :button="false">
            <div class="transferdialog-tips">
                <div style="margin-top: 0.4375rem">
                    您的装备信息有误，确定要{{typeOperational}}吗？
                </div>
                <div class="transferdialog-tips-button">
                    <el-button class="cancel" @click="closeTips">取消</el-button>
                    <el-button style="margin-left: 0.0625rem" class="submits" @click="submitTips">确定</el-button>
                </div>
            </div>
        </dialog-svices>
        <dialog-svices ref="transFerDialogReason" width="4.8073rem" title="备注" :button="false">
           <div class="transferdialog-textarea">
               <div class="transferdialog-textarea-body">
                   <div>
                       <span v-text="'异常装备：'"></span>
                       <div class="abnormal-equips">

                       </div>
                   </div>
                   <div>
                       <span v-text="'填写备注：'"></span>
                       <div style="width: 2.0833rem;margin-top: 0.0625rem">
                           <el-input
                                   type="textarea"
                                   :autosize="{ minRows: 13, maxRows: 13}"
                                   placeholder="请输入内容"
                                   v-model="reason"
                                   show-word-limit>
                           </el-input>
                       </div>
                   </div>
               </div>

               <div class="transferdialog-textarea-button">
                   <el-button class="cancel" @click="closeTextarea">取消</el-button>
                   <el-button style="margin-left: 0.0625rem" class="submits" @click="submitTextarea">提交</el-button>
               </div>
           </div>
        </dialog-svices>
        <dialog-svices ref="transFerDialogApplyConfirm" width="3.3021rem" title="申请人确认" :button="false">
            <div class="transferdialog-apply-confirm">
                <div class="transferdialog-apply-confirm-item">
                    <span v-text="'账号：'"></span><el-input style="width: 1.2917rem" v-model="user.userName"></el-input>
                </div>
                <div class="transferdialog-apply-confirm-item">
                    <span v-text="'密码：'"></span><el-input style="width: 1.2917rem;" v-model="user.password"></el-input>
                </div>
                <div class="transferdialog-apply-confirm-buttom">
                    <el-button class="cancel" @click="closeConfirm">取消</el-button>
                    <el-button style="margin-left: 0.0625rem" class="submits" @click="confirmApply">提交</el-button>
                </div>
            </div>
        </dialog-svices>
    </div>
</template>

<script>
    import dialogSvices from 'components/base/gailiangban'
    // import inventoryData from 'views/warehouse/inventoryData'
    import request from 'common/js/request'
    import {baseURL,baseBURL} from "../../../api/config"
    import {findByRfids,outHouse} from 'api/process'
    import { start, delFile, handheld, killProcess,modifyFileName } from 'common/js/rfidReader'

    // import {handheld} from 'common/js/pda'
    // const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // const fs = window.require('fs');
    // const path = window.require('path');
    // const newFile_path = 'C:\\Users\\Administrator\\inventory.json';
    // import {killProcess} from "common/js/kill";

    export default {
        name: "directAdjustmentDialog",
        components: {
            dialogSvices
        },
        props: {
            directObj: {
                type: Object
            },
            billName:{
              type:String
            },
            typeOperational:{
                type:String,
                default:'出库'
            }
        },
        data() {
            return {
                hardware: '',
                hardwareList: [
                    {value: '手持机', label: '手持机'},
                    {value: 'RFID读写器', label: 'RFID读写器'},
                ],
                rightList: [],
                outList: [],
                equipGroup:{},
                align: 'left',
                submitFlag: false,
                types: '',
                pid: '',
                index:0,
                abnormal:[],
                flag: false,
                closeUsb: false,
                com: 0,
                reason:'',
                user:{
                    userName:'',
                    password:''
                },
                inHouseEquip:[]
            }
        },
        watch: {
            'hardware': {
                handler(newVal, oldVal) {
                    if (oldVal == 'RFID读写器' && newVal == '手持机') {
                        this.end(this.pid)
                    }
                    if (newVal == '手持机') {
                        this.rightList = [];
                        this.handheldMachine();
                    } else if (newVal == 'RFID读写器') {
                        this.closeUsb = false;
                        this.rightList = [];
                        this.getListUsb();
                    }
                }
            }
        },
        created() {
            this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];
        },
        computed: {
            actionReset(){
                let name = '重新读取数据';
                if(this.hardware=='RFID读写器'){
                    name = '重启读写器'
                }else {
                    name = '重新读取数据'
                }
                return name
            }
        },
        methods: {
            deleteFile() {
                delFile(newFile_path, () => {console.log('删除文件' + newFile_path + '成功')})
                // fs.unlink(newFile_path, function (error) {
                //     if (error) {
                //         return false;
                //     }
                //     console.log('删除文件' + newFile_path + '成功');
                // })

            },
            end(pid) {
                // alert('关掉了');
                // this.closeUsb=true
                if (pid) {
                //    spawn("taskkill", ["/PID", pid, "/T", "/F"]);
                killProcess(this.pid)
                }
            },
            getListUsb() {//todo

                start("java -jar scan.jar", (data) => {
                    let arr = [];
                    arr.push(data);
                    this.getOutDataCopy(arr);
                }, (fail) => {
                    this.$message.error(fail)
                }, (pid, err) => {pid?this.pid = pid:this.$message.error(err)})

                // this.index = 0;
                // const process = exec(`java -jar scan.jar ${this.com}`, {cwd: cmdPath});
                // this.pid = process.pid;

                // process.stderr.on('data', (err) => {
                //     console.log(err);
                //     this.$message.error('设备故障请重新插拔!插入后请重新选择');
                //     this.index = 1;
                //     killProcess();
                // });


                // process.stdout.on('data', (data) => {
                //     if (this.index > 0) {
                //         let arr = [];
                //         arr.push(data);
                //         this.getOutDataCopy(arr);
                //     } else {
                //         let newData = JSON.parse(data);
                //         newData.status === 'succeed' ? this.index = 1 : this.index = 0;
                //     }
                // });

                // process.on('exit', (code) => {
                //     if (this.index === 0) {
                //         this.$message.error('设备未插入或串口号错误,插入后请重新选择!');
                //     }
                //     console.log(`子进程退出，退出码 ${code}`);
                // });


                // let intercal=setInterval(()=>{
                //     if(this.closeUsb){
                //         clearInterval(intercal);
                //         return;
                //     }
                //     this.getOutDataCopy(['q2', '3', '4', '55','6','7','8','9','11','天下第一','sdfa','10','222','23252s'])
                // },1000)

            },
            deleteRow(index) {
                this.rightList.splice(index, 1)
            },
            close() {
                this.hardware='';
                this.closeUsb = true;
                this.end(this.pid);
                this.$refs.transFerDialogApply.cancelDb();
            },
            closeTextarea(){
                this.$refs.transFerDialogReason.cancelDb();
            },
            closeTips(){
                this.$refs.transFerDialogTips.cancelDb();
            },
            closeConfirm(){
                this.$refs.transFerDialogApplyConfirm.cancelDb();
            },
            submitTextarea(){
                if(this.reason==''){
                    this.$message.info('备注不能为空!');
                }else {
                    if(this.typeOperational=='出库'){
                        this.transferEquipInOrOut('ABNORMAL');
                        // this.$refs.transFerDialogApplyConfirm.show();
                    }else {
                        this.transferEquipInOrOut('ABNORMAL')
                    }
                    this.$refs.transFerDialogReason.cancelDb();
                }

            },
            confirmApply(){
                if(this.user.userName!=''&&this.user.password!=''){
                    console.log(this.directObj);
                   let param={
                       password:this.user.password,
                       userId:this.directObj.applyOrder.inUser.id,
                       username:this.user.userName
                   };
                   request({
                       method:'post',
                       url:baseBURL+'/identity/authentication',
                       params:param
                   }).then(res=>{
                       this.closeConfirm();
                       let state;
                       if(this.submitFlag){
                           state='NORMAL'
                       }else {
                           state='ABNORMAL'
                       }
                       this.transferEquipInOrOut(state)
                   })
               }else {
                   this.$message.info('请先填写完整')
               }
            },
            outHouseByRfid(rfids){

            },
            transferEquipInOrOut(state){
                console.log(state);
                let url;
                let rfids=[];
                let equips=[],note='';
                let aUrl='';
                let orderId=this.directObj.id;
                if(this.typeOperational=='出库'){
                    _.forIn(this.equipGroup, function(value, key) {
                        value.forEach(item=>{
                            rfids.push(item.rfid)
                        })
                    });
                    outHouse(_.join(rfids, ',')).then(res=>{
                        res.forEach(item=>{
                            equips.push({id:item.id,name:item.name,model:item.model,price:item.price,serial:item.serial,productDate:item.productDate,equipArgId:item.equipArg.id})
                        });
                    })
                }else {
                    url=baseURL+'/order-equips/in'+'?orderId='+orderId+'&state='+state;
                    rfids=this.inHouseEquip;
                }
                if(state=='ABNORMAL'){
                    note=this.reason;
                }
                if(this.typeOperational=='出库'){
                    this.$emit('outHouse',{equips:equips,note:note})
                }else {
                    request({
                        method: 'PUT',
                        url: aUrl,
                        data: rfids
                    }).then(res => {
                        this.$message.success('入库成功');
                        this.sucessInOrOut()
                    }).catch(error=>{
                        this.$message.error(error.response.data.message)
                    })
                }

            },
            sucessInOrOut(){
                this.end(this.pid);
                this.closeUsb = true;
               this.$emit('sucesssInOrOut',true);
            },
            submit() {
                if (this.submitFlag) {
                    if(this.typeOperational=='出库'){
                        this.$refs.transFerDialogApplyConfirm.show();
                        // this.transferEquipInOrOut('NORMAL')
                    }else {
                        this.transferEquipInOrOut('NORMAL')
                    }
                    // let rfidC = [];
                    // this.rightList.forEach(item => {
                    //     rfidC.push(item.rfid)
                    // });
                    //
                    // let url = 'http://192.168.50.14:8080/warehouse/transfers/up-to-down/equips-out/';
                    // let param = {
                    //     rfidList: rfidC,
                    //     orderId: this.directObj.id
                    // };
                    // request({
                    //     method: 'DELETE',
                    //     url: url,
                    //     data: param
                    // }).then(res => {
                    //     if (res) {
                    //         console.log(res);
                    //     }
                    // })
                } else {
                    if(this.billName!='借调'||this.billName!='归还'){
                        this.$refs.transFerDialogTips.show();
                    }else {
                        this.$message.error('请确认出库装备正确')
                    }
                    // this.sucessInOrOut();
                    // this.$message.error('请重新确认出库装备')
                }
            },
            submitTips(){
                this.$refs.transFerDialogReason.show();
                this.$refs.transFerDialogTips.cancelDb();
            },
            showDialog(){
                this.$refs.transFerDialogApply.show();
            },
            tableRowClassName({row, rowIndex}) {
                /*if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';*/
                if (row.flag) {
                    return ''
                } else {
                    return 'colorDialog'
                }

            },
            clickResult() {
                if (this.hardware == '手持机') {
                    this.rightList=[];
                    this.handheldMachine();
                } else {
                    this.closeUsb = true;
                    this.end(this.pid);
                    setTimeout(() => {
                        this.closeUsb = false;
                        this.getListUsb()
                    }, 1000)
                }
            },
            handheldMachine() {
                // modifyFileName('search.json');
                // handheld((err) => this.$message.error(err)).then((data) => {
                //     let json = JSON.parse(data);
                //     this.getOutDataCopy(json.rfid);
                //     this.deleteFile();
                //     // findByRfids(json.rfid).then(res => {
                //     //     this.$refs.maintenanceEndDialog.show();
                //     // });
                // });
                //todo 要换回来
                // let data = inventoryData;
                // if(this.typeOperational=='出库'){
                //     this.rightList.push({
                //         name: '圣爱大厦',
                //         model: '茶山是生',
                //         count: 22,
                //         rfid: ['222','19080012'],
                //         flag: false
                //     });
                //     this.getTrueOrFalse();
                // }else {
                //     this.getOutDataCopy(['222','19080012']);,20088892,20088888
                // }
                this.getOutDataCopy(['10048889'])
            },
            // getOutData(data){
            //     console.log(data);
            // },
            getOutDataCopy(data) {
                if(this.typeOperational=='出库'){
                    findByRfids(data).then(res=>{
                        if (res.length!=0) {
                            this.getCategroy(res);
                        }else {
                            this.$message.error(`无法识别当前装备的RFID:[${data}]`)
                        }
                    });
                    // let url = baseURL+'/equips/by-rfidlist';
                    // request({
                    //     method: 'PUT',
                    //     url: url,
                    //     data: data
                    // }).then(res => {
                    //     if (res.length!=0) {
                    //         this.getCategroy(res);
                    //     }else {
                    //         this.$message.error(`无法识别当前装备的RFID:[${data}]`)
                    //     }
                    // })
                }else {
                    let url = baseBURL+'/order-equips/equips-out-house';
                    request({
                        method: 'GET',
                        url: url,
                        params: {orderId:this.directObj.id}
                    }).then(res => {
                        if (res) {
                            this.getCategroyIn(data,res.equips);
                        }
                    })
                }
            },
            getCategroyIn(rfidData,res){
                rfidData.forEach(item=>{
                    let equip=res.find(value=>{
                        return value.rfid==item
                    });
                    if(equip!=undefined){
                        this.inHouseEquip.push(equip);
                        this.getCategroy([equip])
                    }else {
                        this.$message.error('无法获取rfid为'+item+'的装备数据,请取出并单独入库')
                    }
                })
            },
            getCategroy(data) {
                let group=_.groupBy(data, 'equipArg.model');
                this.equipGroup=group;
                this.getTrueOrFalse(group);
            },
            getTypeModel(data) {
                let typeModel = [];
                data.forEach(item => {
                    if (typeModel.length == 0) {
                        typeModel.push(item.equipArg.model);
                    } else {
                        if (typeModel.indexOf(item.equipArg.model) > -1) {
                        } else {
                            typeModel.push(item.equipArg.model);
                        }
                    }
                });
                return typeModel
            },
            getTrueOrFalse(group) {
                let flag=true,rightlist=[];
                this.directObj.orderItems.forEach(item=>{
                   if(group[item.model]){
                       group[item.model].length===item.count?flag=true:flag=false;
                       rightlist.push({name:item.name,model:item.model,count:group[item.model].length})
                   }else {
                       flag=false
                   }
                });
                _.forIn(group, function(value, key) {
                    if(_.findIndex(rightlist, function(o) { return o.model===key;})===-1){
                        rightlist.push({name:value[0].equipArg.name,model:key,count:value.length});
                        flag=false;
                    }
                });
                this.rightList=rightlist;
                this.submitFlag=flag//todo
            },
            indexMethod(index) {
                return index + 1;
            }
        },
        beforeDestroy() {
            killProcess(this.pid)
        }
    }
</script>

<style scoped>
    .transferdialog-apply-confirm{
        width: 100%;
        height: 1.3125rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 0.125rem;
    }
    .transferdialog-apply-confirm .transferdialog-apply-confirm-item{
        display:flex;
        align-items: center;
        width: 1.6146rem;
        margin-top: 0.1042rem;
    }
    .transferdialog-apply-confirm .transferdialog-apply-confirm-buttom{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.2375rem;
    }
    .transferdialog-textarea{
        width: 100%;
        height: 2.0833rem;

    }
    .transferdialog-textarea-body{
        display: flex;
        width: 100%;
        margin-top: 0.1354rem;
        padding: 0 0.1875rem;
        justify-content: space-between;
    }
    .transferdialog-textarea-body .abnormal-equips{
        width:2.0833rem;
        height:1.4769rem;
        background:rgba(245,247,250,1);
        border:1px solid rgba(220,223,230,1);
        opacity:1;
        border-radius:0.0208rem;
        margin-top: 0.0625rem
    }
    .transferdialog-textarea .transferdialog-textarea-button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.1042rem;
    }
    .transferdialog-tips{
        width: 100%;
        height: 1.3125rem;
        display: flex;
        justify-content: center;
        position: relative;
        font-size: 0.1042rem;
        color: #707070;
    }
    .transferdialog-tips .transferdialog-tips-button{
        position: absolute;
        bottom: 0.1875rem;
    }
    .directAdjustmentDialog {
        height: 781px;
        width: 100%;
        padding: 0.078125rem 0.2865rem;
        color: #707070;
    }

    .colorDialog {
        color: #FF0000;
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .directAdjustmentDialog .directAdjustmentDialog-body {
        margin-top: 0.0729rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .directAdjustmentDialog-body .leftTable {
        width: 3.6458rem;
        border:0.0052rem solid rgba(112,112,112,0.13);
    }

    .directAdjustmentDialog-body .rightTable {
        width: 3.6458rem;
        border:0.0052rem solid rgba(112,112,112,0.13);
    }

    .rightTable .deleteButtom {
        color: #FF0000;
    }

    .directAdjustmentDialog .directAdjustmentDialog-header {
        width: 100%;
    }

    .directAdjustmentDialog-header .header-item {
        display: flex;
        width: 100%;
        margin-top: 0.0729rem;
        justify-content: space-between;
        align-items: center;
    }

    .header-item .d_select {
        display: flex;
        align-items: center;
    }

    .d_select .resultButton {
        width: 137px;
        height: 30px;
        margin-left: 0.0625rem;
        background: rgba(47, 47, 118, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        line-height: 0px;
        color: white;
        border-radius: 6px;
    }

    .directAdjustmentDialog .directAdjustmentDialog-bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.296875rem;
    }

    .submits {
        width: 70px;
        height: 30px;
        background: rgba(47, 47, 118, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        color: white;
        line-height: 0px;
    }

    .cancel {
        width: 70px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        line-height: 0px;
    }
</style>
