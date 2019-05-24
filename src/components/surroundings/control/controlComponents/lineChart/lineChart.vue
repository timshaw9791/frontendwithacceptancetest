<template>
    <div class="lineChart">
        <dialogs :width="1040" ref="dialog" :title="'湿度'">
            <div class="lineChart-box">
                <lin-chart-component></lin-chart-component>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from '../../../surroundingDialog'
    import linChartComponent from './lineChartComponent'
    export default {
        name: "lineChart",
        components: {
            dialogs,
            linChartComponent
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
    .lineChart{}
    .lineChart .lineChart-box{
        height: 567px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>