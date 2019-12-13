<template>
    <div>
        <serviceDialog :title="'申请流程'" ref="selectApplyProcess" width="5.4167rem"
                       :button="false">
            <div class="select_apply_process">
                <div class="select_apply_button_box">
                    <div v-for="item in selectButtons" class="select_apply_button" data-test="button"
                         @click="apply(item.key)">
                        {{item.label}}
                    </div>
                </div>
            </div>
        </serviceDialog>
        <apply-borrow :applyObject="applyObject" ref="borrow"></apply-borrow>
        <apply-scrap :applyObject="applyObject" ref="scrap" @applySucess="sucessApply"></apply-scrap>
        <apply-direct :applyObject="applyObject" ref="direct" @applySucess="sucessApply"></apply-direct>
        <apply-allocation :taskId="taskId" :applyObject="applyObject" ref="allocation" @applySucess="sucessApply"></apply-allocation>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import {getHouseInfo} from 'api/process'
    import applyBorrow from './applyBorrow'
    import applyScrap from './applyScrap'
    import applyDirect from './applyDirect'
    import applyAllocation from './applyAllocation'
    export default {
        name: "selectApplyProcess",
        components: {
            applyDirect,
            serviceDialog, applyBorrow,applyScrap,applyAllocation
        },

        data() {
            return {
                selectButtons: [{key: 'allocation', label: '调拨流程'},  {
                    key: 'direct',
                    label: '直调流程'
                }, {key: 'scrap', label: '报废流程'}],
                applyObject:{
                    house:{}
                }
            }
        },
        created(){
            this.init();
        },
        methods: {
            sucessApply(){
                this.$emit('sucessApply',true)
            },
            init(){
                getHouseInfo().then(res=>{
                    this.$set(this.applyObject,'house',res);
                });
            },
            apply(key) {
                this.cancelDb();
                this.$refs[key].show();
            },
            show() {
                this.$refs.selectApplyProcess.show()
            },
            cancelDb() {
                this.$refs.selectApplyProcess.cancel();
            },
        },
        props:{
            taskId:{
                type:String,
                default:''
            }
        }
    }
</script>

<style scoped>
    .select_apply_process {
        height: 3.6302rem;
        width: 100%;
    }

    .select_apply_process .select_apply_button_box {
        height: 1.6302rem;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-left: 0.4792rem;
        padding-right: 0.4792rem;
    }

    .select_apply_button_box .select_apply_button {
        cursor: pointer;
        width: 1.25rem;
        height: 0.4167rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 0.0625rem rgba(220, 222, 226, 1);
        display: flex;
        margin-top: 0.2865rem;
        font-size: 24px;
        color: #909399FF;
        align-items: center;
        justify-content: center;
    }
</style>