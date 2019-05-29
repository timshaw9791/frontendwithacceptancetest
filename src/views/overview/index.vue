<template>
    <div class="overview">
        <el-card shadow="never" :body-style="{ padding:'30px'}">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div class="ov-content">
                <div class="statistics">
                    <div class="total">
                        <div>在库总数<span>1</span></div>
                        <div>出库总数<span>2</span></div>
                    </div>
                </div>
                <div class="block">
                    <div class="bk-style" v-for="item in 4" :key="item">
                        <div class="bk-top">
                            <span>{{item}}</span>
                        </div>
                        <div class="bk-content">
                            <el-table :data="list" fit highlight-current-row>
                                <bos-table-column lable="序号" field="equip.name"></bos-table-column>
                                <bos-table-column lable="编号" field="equip.id"></bos-table-column>
                                <bos-table-column lable="类型" field="equip.location.number"></bos-table-column>
                                <bos-table-column lable="状态" field="equip.location.number"></bos-table-column>
                                <bos-table-column lable="倒计时" field="equip.location.number"></bos-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="bk-style" v-for="item in 2" :key="item*0.1">
                        <div class="bk-top">
                            <span>{{item}}</span>
                        </div>
                    </div>

                </div>
            </div>
        </el-card>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                list: []
            }
        }
    }
</script>

<style lang="scss" scoped>
    .overview {
        .el-card {
            border: none !important;
        }

        .ov-content {

            .statistics {
                padding: 0 2vw;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                display: flex;
                align-items: center;
                height: 148px;
                width: 100%;
                margin-bottom: 30px;

                .total {
                    font-size: 16px;
                    font-weight: bold;
                    color: rgba(77, 79, 92, 1);

                    div {
                        padding-bottom: 10px;
                    }

                    span {
                        margin-left: 14px;
                        font-size: 20px;
                    }
                }
            }

            .block {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .bk-style {
                    width: 510px;
                    height: 321px;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                    margin-bottom: 30px;
                    color: rgba(112, 112, 112, 1);

                    .bk-top {
                        height: 42px;
                        border-left: 4px solid rgba(47, 47, 118, 0.75);
                        padding: 14px;
                        margin-bottom: 10px;

                        span {
                            font-size: 18px;

                        }
                    }

                    .bk-content {
                        padding: 0 30px;
                    }
                }


            }
        }

    }


</style>