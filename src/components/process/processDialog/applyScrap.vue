<template>
    <div>
        <serviceDialog :title="'申请报废流程'" ref="applyScrap" width="5.4167rem"
                       :button="false" @cancel="cancelDialog">
            <div class="apply-scrap-box">
                <div class="apply-scrap-action">
                    <div class="action-button-item">
                        <span v-text="'所在库房：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="applyObject.house.houseName"></el-input>
                        </div>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'指定领导：'"></span>
                        <p_select :options="mixinObject.leaderList" @selected="selectLeader"></p_select>
                    </div>
                    <div class="action-button-item">
                        <span v-text="'选择硬件：'"></span>
                        <p_select :options="hardwareSelect" @selected="selectHardware"></p_select>
                    </div>
                </div>
                <div class="apply-reason">
                    <div style="width: 0.390625rem"><span v-text="'申请原因:'"></span></div>
                    <el-input
                            :autosize="{ minRows: 1, maxRows: 1}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="form.reason">
                    </el-input>
                </div>
                <div class="apply-scrap-table">
                    <process-table :equipArgList="form.equips"  :processType="'scrap'"></process-table>
                </div>
                <div class="apply-scrap-footer">
                    <div class="action-footer-item">
                        <!--<text-button style="color: #2F2F76FF!important;" :buttonName="'清空列表'" :iconClass="'删除'" @click="clearEquip()"></text-button>-->
                    </div>
                    <div class="action-footer-item">
                        <span v-text="'申请人员：'"></span>
                        <div class="button-item-input">
                            <el-input :disabled="true" v-model="form.applicant.name"></el-input>
                        </div>
                    </div>
                </div>
                <div class="apply-scrap-button">
                    <el-button @click="cancelDb" data-test="button">取 消</el-button>
                    <el-button type="primary" @click="apply" data-test="button">确 定</el-button>
                </div>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import p_select from 'components/base/selected'
    import processTable from '../processTable'
    import processCascader from '../processCascader'
    import textButton from 'components/base/textButton'
    import {applyProcessMixin} from "common/js/applyProcessMixin";
    import {equipArgsByName, inHouse, findEquip, updateEquipArg, getAllSupplier, saveEquipArg, updateEquip} from "api/storage"
    import {start, delFile, handheld, killProcess,modifyFileName} from 'common/js/rfidReader'
    export default {
        name: "applyScrap",
        components: {
            serviceDialog,
            p_select,
            processTable,
            processCascader,
            textButton
        },
        props:{
            applyObject:{
                type:Object
            },
            taskId:{
                type: String
            }
        },
        mixins: [applyProcessMixin],
        data() {
            return {
                hardwareSelect:[{name:'手持机',id:'1'},{name:'RFID读写器',id:'2'},{name:'门感天线',id:'3'}],
                hardware:'',
                form:{
                    type:'SCRAP',
                    leader:{},
                    equips:[],
                    outboundOrganUnit:{},
                    applicant: {
                        id: JSON.parse(localStorage.getItem('user')).id,
                        name: JSON.parse(localStorage.getItem('user')).name,
                        organUnitId: ''
                    },
                    reason:''
                },
                selectButtons: [{name: '', label: '调拨流程'}, {name: '', label: '借用流程'}, {
                    name: '',
                    label: '直调流程'
                }, {name: '', label: '报废流程'}],
                pid:0,
                closeGate:false,
                timeId:''
            }
        },
        mounted(){
           setTimeout(()=>{
               this.mixiGetLeader({organUnitId:this.applyObject.house.organUnitId,type:this.form.type});
           },2000)
        },
        watch:{
            'hardware': {
                deep:true,
                handler(newVal, oldVal) {
                    if (newVal === '手持机') {
                        this.form.equips=[];
                        this.handheldMachine();
                    }else if(newVal==='门感天线')
                    {
                        this.getGateAntenna()
                    }
                     else if (newVal === 'RFID读写器') {
                        this.getListUsb();
                    }else if(newVal==='手持机'&&oldVal==='RFID读写器'){
                        killProcess(this.pid)
                    }
                }
            }
        },
        methods: {
            cancelDialog(){
                this.closeGate=true
                let gateModel="RECEIVE_RETURN"
                killProcess(this.pid)
            },
            clearEquip(){
                this.$set(this.form,'equips',[]);
            },
            apply() {
                let equips = [],rfids=[],flag=true;
                this.closeGate=true;
                let gateModel="RECEIVE_RETURN"
                this.form.equips.forEach(item => {
                    equips.push({id:item.id,rfid:item.rfid,name:item.equipArg.name,model:item.equipArg.model});
                    rfids.push(item.rfid);
                });
                let apply = {
                    applicant: this.form.applicant,
                    equips: equips,
                    note:this.form.reason,
                    warehouse:{
                        id: this.applyObject.house.houseId,
                        name: this.applyObject.house.houseName
                    }
                };
                apply.applicant.organUnitId=this.applyObject.house.organUnitId;
                _.forIn(apply,(value)=>{
                    this.judgeObj(value)?'':flag=false;
                });
                this.judgeObj(this.form.leader)?'':flag=false;
                if(flag){
                    if(equips.length!==0){
                        if (this.taskId){
                        }else {
                        }

                    }else {
                        this.$message.error('请先录入装备');
                    }
                }else {
                    this.$message.error('请先将信息填写完整');
                }

            },
            judgeObj(data){
                let judeData=JSON.parse(JSON.stringify(data));
                if (JSON.stringify(judeData)!=='{}'&&JSON.stringify(judeData)!=='[]'){
                    return true
                }else{
                    return false
                }
            },
            selectLeader(data) {
                this.$set(this.form,'leader',data);
            },
            selectHardware(data){
                this.hardware=data.name;
            },
            getEquipByRfid(data){
               data.forEach(item=>{
               })
            },
            getGateAntenna(){
                let gateModel="OUT_HOUSE"
              setTimeout(() => this.throttle = false, 2000)
            },
            handheldMachine() {
                modifyFileName('search.json');
                handheld((err) => this.$message.error(err)).then((data) => {
                    let json = JSON.parse(data);
                    this.getEquipByRfid(json.rfid);
                    this.deleteFile();
                });
                //todo 要换回来
                // let data = inventoryData;
                // this.getEquipByRfid(['190800150000000000000000'])
            },
            getListUsb() {//todo
                start("java -jar scan.jar", (data) => {
                    this.getEquipByRfid([data]);
                }, (fail) => {
                    this.$message.error(fail)
                }, (pid, err) => {
                    pid ? this.pid = pid : this.$message.error(err)
                });
                //  let list=['1100000A0000000000000000','190800150000000000000000'];
                // list.forEach(item=>{
                //     this.getEquipByRfid([item]);
                // })
            },
            deleteFile() {
                delFile(newFile_path, () => {})
            },
            show() {
                this.$set(this.form,'equips',[]);
                this.$set(this.form,'reason','');
                this.$set(this,'hardware','');
                this.$refs.applyScrap.show()
            },
            cancelDb() {
                killProcess(this.pid);
                this.$refs.applyScrap.cancel();
            },
        },
        beforeDestroy() {
            killProcess(this.pid)
            let gateModel="RECEIVE_RETURN"
            clearInterval(this.timeId);
        }
    }
</script>

<style lang="scss" scoped>
    .apply-scrap-box {
        height: 3.6302rem;
        position: relative;
    }
    .apply-scrap-box .apply-scrap-button{
        position: absolute;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0.224rem;
        /deep/ .el-button {
            height: 0.1667rem;
            line-height: 0px;
        }
    }
    .apply-scrap-box .apply-reason{
        width: 100%;
        padding: 0rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: left;
        /deep/ .el-textarea__inner {

        }
    }
    .apply-scrap-box .apply-scrap-action {
        width: 100%;
        padding: 0.0833rem 0.1771rem 0.0625rem 0.1771rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .apply-scrap-box .apply-scrap-table{
        width: 100%;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }
    .apply-scrap-box .apply-scrap-footer{
        width: 100%;
        margin-top: 0.0677rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 0.1771rem;
        padding-right: 0.1771rem;
    }
    .apply-scrap-footer .action-footer-item{
        display: flex;
        align-items: center;
        justify-content: center;
        /deep/ .el-input__inner {
            width: 1.1458rem;
            height: 0.1667rem;
        }
    }
    .apply-scrap-action .action-button-item {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action-button-item .button-item-input {
        /deep/ .el-input__inner {
            width: 1.1458rem;
            height: 0.1667rem;
        }
    }
</style>