<template>
    <div class="block">
        <span v-text="'选择时间'" @click="dateSlot"></span>
        <el-date-picker
                v-model="value"
                :type="type"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
        </el-date-picker>

    </div>
</template>

<script>
    export default {
        name: "dataTimePicker",
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value: '',
                type:'datetime'
            };
        },
        methods:{
            dateSlot(){
                this.value = [this.value,''];
                this.type='datetimerange';
            }
        }
    }
</script>

<style scoped>
    .block{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>