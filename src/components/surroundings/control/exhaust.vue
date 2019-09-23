<template>
    <div class="exhaust">
        <dialogs :width="398" ref="dialog" :title="'排风控制'">
            <div class="exhaust-body">
                <div class="exhaust-box">
                    <svg-icon icon-class="排风图标" style="width: 70px;height: 70px"></svg-icon>
                    <span v-text="'排风控制'" style="margin-top: 8px"></span>
                    <switch-control :active="active" :inactive="inactive" style="margin-top: 31px"></switch-control>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../surroundingDialog'
    import surroundingCard from '../surroundingCard'
    import switchControl from './controlComponents/switchControl'
    export default {
        name: "exhaust",
        components: {
            dialogs,
            surroundingCard,
            switchControl
        },
        data() {
            return {
                active:{
                    text:'打开',
                    color:'#39BC53',
                },
                inactive:{
                    text:'关闭',
                    color:'#B8B8B8',
                }
            }
        },
        methods:{
            show(){
                this.$refs.dialog.show();
            },
            close(){
                this.$refs.dialog.close();
            }
        }
    }
</script>

<style scoped>
    .exhaust {
        width: 100%;
    }

    .exhaust .exhaust-body {
        height: 416px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
        color: #707070;
    }
    .exhaust-body .exhaust-box{
        width: 180px;
        height: 248px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
    }
</style>