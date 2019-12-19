<template>
    <div style="width: 100%">
        
        <el-table
                :data="tableData"
                height="2rem"
                border
                style="width: 100%"
                :align="align"
        >
        <bos-table-column lable="RFID" field="equipInfo.rfid"></bos-table-column>
        <bos-table-column lable="装备序号" field="equipInfo.serial"></bos-table-column>
        <bos-table-column lable="装备型号" field="equipInfo.model"></bos-table-column>
        <bos-table-column lable="装备名称" field="equipInfo.equipName"></bos-table-column>
        <bos-table-column lable="装备位置"
                            :filter="(row)=>$filterFrame(row.equipInfo)"></bos-table-column>
            <el-table-column
                    prop="serial"
                    label="操作"
                    :align="align"
            >
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleClick(scope.row)">复制RFID</el-button>
                </template>
            </el-table-column>操作
        </el-table>
        <dialog-svices title="复制RFID" ref="copyRfidDialog" width="3.3021rem" :button="false" @cancel="cancel">
            <div class="copyRfid">
                <div class="copyRfid-content">
                    <span v-text="'RFID:'"></span>
                    <div style="width: 1.1354rem;margin-left: 0.0521rem">
                        <el-input
                                placeholder="请输入内容"
                                v-model="cRfid"
                                :disabled="true">
                        </el-input>
                    </div>
                </div>
                <div class="copyRfid-button">
                    <el-button class="copyRfid-button-cancel" @click="cancelCopy">取消</el-button><el-button class="copyRfid-button-submits" @click="copyRfid">复制</el-button>
                </div>
            </div>
        </dialog-svices>
    </div>
</template>

<script>
    //const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";
    import { startOne } from 'common/js/rfidReader'
    import {transformMixin} from 'common/js/transformMixin'
    import dialogSvices from 'components/record/recordServiceDialog'
    export default {
        name: "inventoryTable",
        components:{dialogSvices},
        props:{
            tableData:{
                type:Array
            }
        },
        mixins: [transformMixin],
        data(){
            return{
                align:'center',
                cRfid:''
            }
        },
        methods:{
            handleClick(row){
              this.cRfid=row.equipInfo.rfid;
              this.$refs.copyRfidDialog.show()
            },
            cancelCopy(){
                this.$refs.copyRfidDialog.hide();
                //killProcess();
            },
            cancel(){
                //killProcess();
            },
            copyRfid() {
                startOne("java -jar writing.jar", (data) => {
                    console.log("data",data);
                    if(data&&data.indexOf('succeed')!=-1){
                        this.$message.success('复制成功!');
                        this.$refs.copyRfidDialog.hide();
                    }else {
                        this.$message.error('复制失败!');
                    }
                }, this.cRfid)
                // exec(`java -jar writing.jar ${JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM']} ${this.cRfid}`, {cwd: cmdPath}, (err, data) => {
                //     console.log(data);
                //     if (data.includes('succeed')) {
                //         this.$message.success('复制成功!');
                //         this.$refs.copyRfidDialog.hide();
                //     } else {
                //         this.$message.error('复制失败!');
                //     }
                // })
            },
            indexMethod(index) {
                return index +1;
            }
        }
    }
</script>

<style scoped>
.copyRfid{
    height: 302px;
    display: flex;
    align-items: center;
    flex-direction: column;
}
    .copyRfid .copyRfid-content{
        font-size: 0.0938rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 0.474rem;
    }
    .copyRfid .copyRfid-button{
        margin-top: 0.6042rem;
    }
    .copyRfid-button .copyRfid-button-cancel{
        width:70px;
        height:32px;
        border:1px solid rgba(47,47,118,1);
        opacity:1;
        line-height: 0px;
        border-radius:4px;
    }
    .copyRfid-button .copyRfid-button-submits{
        color: white;
        margin-left: 0.0625rem;
        width:70px;
        height:32px;
        line-height: 0px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:4px;
    }
</style>