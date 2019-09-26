<template>
    <div style="width: 100%">
        <el-table
                :data="tableData"
                height="424"
                border
                style="width: 100%"
                :align="align"
        >
            <el-table-column
                    prop="rfid"
                    label="RFID"
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
                    prop="name"
                    label="装备名称"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="serial"
                    label="装备序号"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="location.number"
                    label="架体编号"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="location.surface"
                    label="架体AB面"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="location.floor"
                    label="架体层号"
                    :align="align"
            >
            </el-table-column>
            <el-table-column
                    prop="location.section"
                    label="架体节号"
                    :align="align"
            >
            </el-table-column>
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
        <dialog-svices title="复制RFID" ref="copyRfidDialog" width="634px" :button="false" @cancel="cancel">
            <div class="copyRfid">
                <div class="copyRfid-content">
                    <span v-text="'RFID:'"></span>
                    <div style="width: 218px;margin-left: 10px">
                        <el-input
                                placeholder="请输入内容"
                                v-model="cRfid"
                                :disabled="true">
                        </el-input>
                    </div>
                </div>
                <div class="copyRfid-button">
                    <el-button class="copyRfid-button-cancel" @click="cancelCopy">取消</el-button><el-button class="copyRfid-button-submits" @click="copyRfid">写入</el-button>
                </div>
            </div>
        </dialog-svices>>
    </div>
</template>

<script>
    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";
    import dialogSvices from 'components/record/recordServiceDialog'
    export default {
        name: "inventoryTable",
        components:{dialogSvices},
        props:{
            tableData:{
                type:Array
            }
        },
        data(){
            return{
                align:'center',
                cRfid:''
            }
        },
        methods:{
            handleClick(row){
              this.cRfid=row.rfid;
              this.$refs.copyRfidDialog.show()
            },
            cancelCopy(){
                this.$refs.copyRfidDialog.hide();
                killProcess();
            },
            cancel(){
                killProcess();
            },
            copyRfid() {
                exec(`java -jar writing.jar ${JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM']} ${this.cRfid}`, {cwd: cmdPath}, (err, data) => {
                    console.log(data);
                    if (data.includes('succeed')) {
                        this.$message.success('复制成功!');
                        this.$refs.copyRfidDialog.hide();
                    } else {
                        this.$message.error('复制失败!');
                    }
                })
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
        font-size: 18px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 91px;
    }
    .copyRfid .copyRfid-button{
        margin-top: 116px;
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
        margin-left: 12px;
        width:70px;
        height:32px;
        line-height: 0px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:4px;
    }
</style>