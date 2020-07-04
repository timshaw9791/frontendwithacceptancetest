<template>
    <div class="equip-params-container">
        <define-input label="搜索" v-model="paginator.search" placeholder="装备名称/装备型号"></define-input>
        <div class="table">
            <define-table :data="list" height="560px" @changeCurrent="select" :pageInfo="paginator" @changePage="changePage" :highLightCurrent="true">
                <define-column label="装备图片" v-slot="{ data }">
                    <hover-img  image-url="data.row.image" alt="暂无图片"/>
                </define-column>
                <define-column label="装备名称" field="name"></define-column>
                <define-column label="装备型号" field="model"></define-column>
                <define-column label="保质期(天)" v-slot="{data}">
                    <date-input v-model="data.row.shelfLife" placeholder="--" :disabled="true"></date-input>
                </define-column>
                <define-column label="充电周期(天)" v-slot="{data}">
                    <date-input v-model="data.row.chargeCycle" placeholder="--" :disabled="true"> </date-input>
                </define-column>
                <define-column label="保养周期(天) " v-slot="{data}">
                    <date-input v-model="data.row.upkeepCycle" placeholder="--" :disabled="true"></date-input>
                </define-column>
                <define-column label="供应商" field="supplier.name"></define-column>
            </define-table>
        </div>
        <div class="footer">
            <base-button label="取消" type="none" @click="cancel"></base-button>
            <base-button label="确定" @click="selected"></base-button>
        </div>
    </div>
</template>

<script>
    import {getEpArgsList} from "api/equipArgs";
    import {imgBaseUrl} from "api/config"
    export default {
        name: "equipArgsSelect",
        data() {
            return {
                currentSel: '', // 当前选中行数据
                list: [],
                paginator: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''},
                imgBaseUrl:imgBaseUrl
            }
        },
        methods: {
            getList() {
                getEpArgsList(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                })
            },
            cancel() {
                this.$emit('cancel');
            },
            select(current) {
                this.currentSel = current.current;
            },
            selected() {
                if(!this.currentSel) {
                    this.$message.warning("请选择装备参数");
                } else {
                    this.$emit('select', {data: this.currentSel, ref: 'equipArgsSelect'});
                }
            },
            changePage(page) {
                this.paginator.page = page;
                this.getList();
            },
        },
        watch: {
            "paginator.search": {
                handler(newval) {
                    this.paginator.search=newval
                    this.getList();
                }
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style scoped>
    .table {
        margin: 10px;
    }
    .footer {
        text-align: center;
    }
    .img{
        width: 30px;
        height: 30px;
    }
</style>