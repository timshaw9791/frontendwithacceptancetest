<template>
    <div class="define-table-container" :style="`margin:${margin}`" ref="tableContainer">
        <el-table :data="data" :height="fixHeight" :border="border" ref="table" fit
                  :highlight-current-row="highLightCurrent" @current-change="changeCurrent"
                  :show-summary="showSummary" :summary-method="summaryFunc">
            <el-table-column label="序号" width="65" align="center" v-if="haveIndex" :fixed="indexFixed">
                <template slot-scope="scope">{{(pageInfo.page-1)*pageInfo.size+scope.$index+1}}</template>
            </el-table-column>
            <slot></slot>
        </el-table>
        <bos-paginator :pageInfo="pageInfo" @bosCurrentPageChanged="changePage" :border="true"
                       v-if="havePage"></bos-paginator>
    </div>
</template>

<script>
    import defineColumn from './defineColumn'

    export default {
        name: "definTable",
        data() {
            return {
                selectData: '',
                selectIndex: '',
                multiSelectiton: '',
                isScroll: false
            }
        },
        props: {
            data: {
                type: Array,
                default() {
                    return []
                }
            },
            height: {
                type: String,
                default: '920px'
            },
            margin: {
                type: String,
                default: '0 10px'
            },
            border: {
                type: Boolean,
                default: true
            },
            highLightCurrent: { // 是否高亮当前选中行
                type: Boolean,
                default: false
            },
            showSummary: { // 是否显示底部合计行
                type: Boolean,
                default: false
            },
            summaryText: {
                type: String,
                default: '合计'
            },
            summaryFunc: { // 底部合计行计算方法
                type: Function,
                default: () => {
                }
            },
            pageInfo: { // 分页信息
                type: Object,
                default() {
                    return {
                        page: 1,
                        size: 10,
                        totalElements: 0,
                        totalPages: 0,
                    }
                }
            },
            havePage: { // 是否有分页
                type: Boolean,
                default: true
            },
            haveIndex: {
                type: Boolean,
                default: true
            },
            indexFixed: {
                type: [Boolean, String],
                default: true
            },
            initSelect: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            fixHeight() { // 减去底部分页的高度
                return this.havePage ? `calc(${this.height} - 45px)` : this.height
            }
        },
        methods: {
            changePage(page) {
                this.selectIndex = 0
                this.$emit('changeCurrent', {current: {}, index: 0})
                this.$emit('changePage', page);
            },
            changeCurrent(current, pre) { // 当前选中行改变
                this.selectData = current;
                this.selectIndex = this._.findIndex(this.data, current);
                current && this.$emit('changeCurrent', {current, index: this.selectIndex});
            },
            getSelection() {
                this.multiSelectiton = this.$refs.table.selection;
                return this.multiSelectiton;
            },
            refreshLayout() { // 刷新表格布局
                this.$refs.table.doLayout();
            }
        },
        mounted() {
            if (this.highLightCurrent && this.initSelect) {
                this.$watch('data', newVal => {
                    this.$refs.table.setCurrentRow(this.data[0])
                }, {
                    deep: true
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .actionButton {
        width: 70px;
        height: 32px;
        opacity: 1;
        color: white;
        border-radius: 4px;
    }

    /deep/ .el-table {
        font-family: 'Source Han Sans CN'; // 统一表格内的字体

        input::placeholder { // placeholder颜色显示和表格一致
            color: #707070 !important;
        }

        ::-webkit-scrollbar {
            display: none;
            width: 9px;
            height: 15px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(178, 178, 204, 1);
            border-radius: 20px;
        }

        ::-webkit-scrollbar-track {
            position: absolute !important;
        }

        .el-table__body-wrapper { // 使滚动条显示在文档内部，避免对文档内容造成位置影响
            overflow-x: overlay !important;
            overflow-y: overlay !important;
        }

        .el-table__fixed {
            pointer-events: none; // 解决固定列一侧横向滚动条无法移动的问题
        }

        .el-table__fixed-body-wrapper {
            pointer-events: all; // 解决添加上一样式后，固定列内容无法选中问题
        }
    }

    .define-table-container:hover {
        /deep/ .el-table {
            ::-webkit-scrollbar {
                display: block;
                width: 9px;
                height: 15px;
            }
        }
    }
</style>