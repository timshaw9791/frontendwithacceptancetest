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
        <apply-borrow ref="borrow"></apply-borrow>
        <apply-scrap ref="scrap"></apply-scrap>
        <apply-direct ref="direct"></apply-direct>
        <apply-allocation ref="allocation"></apply-allocation>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
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
                selectButtons: [{key: 'allocation', label: '调拨流程'}, {key: 'borrow', label: '借用流程'}, {
                    key: 'direct',
                    label: '直调流程'
                }, {key: 'scrap', label: '报废流程'}]
            }
        },
        methods: {
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