<template>
    <div class="inventory">
        <dialogs ref="dialog" :width="523" :title="'盘点'">
            <div class="d_body">
                <div class="d_up">
                    <span v-text="'盘点总数'"></span><span style="margin-left: 20px" v-text="size"></span>
                </div>
                <div class="d_table">
                    <el-table
                            :data="rfList"
                            height="499"
                            border
                            style="width: 100%"
                            :align="align"
                    >
                        <el-table-column
                                prop="number"
                                label="序号"
                                :align="align"
                                width="190"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="rfId"
                                label="RFID"
                                :align="align"
                        >
                        </el-table-column>
                    </el-table>
                </div>
                <div class="d_bottom">
                    <el-button class="cancel" @click="cancel">取消</el-button><el-button style="margin-left: 34px" class="submits" @click="submit">提交</el-button>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from 'components/surroundings/surroundingDialog'
    export default {
        name: "inventoryDialog",
        components:{
            dialogs
        },
        data(){
            return{
                align:'center',
            }
        },
        props:{
          rfList:{
              type:Array
          },
            size:{
              type:String
            }
        },
        methods:{
            show(){
                this.$refs['dialog'].show();
            },
            cancel(){
                this.$refs['dialog'].close();
            },
            submit(){
                this.$emit('submit',true);
                this.$refs['dialog'].close();
            }
        }
    }
</script>

<style scoped>
    .inventory{
        width: 523px;
    }
    .inventory .d_body{
        width: 100%;
        height: 697px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .d_body .d_up{
        width: 457px;
        font-size: 24px;
        color: #2F2F76;
    }
    .d_body .d_table{
        width: 457px;
        margin-top: 22px;
    }
    .d_body .d_bottom{
        width: 457px;
        display: flex;
        justify-content: center;
        margin-top: 21px;
    }
    .d_bottom .submits{
        width:70px;
        height:30px;
        background:rgba(47,47,118,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        border-radius:6px;
        color: white;
        line-height: 0px;
    }
    .d_bottom .cancel{
        width:70px;
        height:30px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        border-radius:6px;
        line-height: 0px;
    }
</style>