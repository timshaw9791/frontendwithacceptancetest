<template>
    <div class="equip-args-list-container" v-if="showList">
        <my-header title=装备参数列表></my-header>
        <div class="equip-args-header">
            <define-input label="装备名称" v-model="paginator.search"></define-input>
            <base-button label="查询" @click="getList()"></base-button>
            <base-button label="新增装备参数" @click="toEdit(true)"></base-button>
        </div>
        <div class="equip-args-body">
            <define-table :data="equipArgsList" height="3.9063rem" :pageInfo="paginator" @changePage="changePage">
                <define-column label="操作" v-slot="{data}">
                    <base-button label="详情" size="small" @click="toEdit(false,data.row)"></base-button>
                    <base-button label="编辑" type="danger" size="small" @click="toEdit(false,data.row)"></base-button>
                </define-column>
                <define-column label="图片" v-slot="{ data }">
                    <upload-file v-model="data.row.image" size="mini"></upload-file>
                </define-column>
                <define-column label="装备名称" field="name"></define-column>
                <define-column label="装备型号" field="model"></define-column>
                <define-column label="供应商" field="supplier.name"></define-column>
                <!-- 使用完善后的日期组件显示天数/使用格式化方法 -->
                <define-column label="质保期" field="shelfLife"></define-column>
                <define-column label="充电周期" field="chargeCycle"></define-column>
                <define-column label="保养周期" field="upkeepCycle"></define-column>
            </define-table>
        </div>
    </div>
    <equip-args-edit :isAdd="equipEdit.isAdd" :equipData="equipEdit.equipData" @back="back" v-else></equip-args-edit>
</template>

<script>
import myHeader from "@/components/base/header/header"
import uploadFile from '@/componentized/uploadFile'
import equipArgsEdit from './spequipArgsEdit'
import { getEquipArgs } from "api/equipArgs";
export default {
    name: 'equipArgsList',
    data() {
        return {
            equipArgsList: [],
            showList: true, // 控制列表和编辑界面切换
            equipEdit: {
                isAdd: '', // 操作类型
                equipData: '', // 详情装备id
            },
            paginator: {page: 1, size: 10, totalElements: 0, totalPages: 1, search: ''}
        }
    },
    methods: {
        getList() {
            getEquipArgs(this.paginator).then(res => {
                this.equipArgsList = res.content;
                this.paginator.totalPages = res.totalPages;
                this.paginator.totalElements = res.totalElements;
            })
        },
        toEdit(operate, data) {
            this.equipEdit.isAdd = operate;
            this.equipEdit.equipData = data;
            this.showList = false;
        },
        changePage(page) {
            this.paginator.page = page;
            this.getList();
        },
        back() {
           this.showList = true;
           this.getList();
        },
    },
    created() {
        this.getList();
    },
    components: { myHeader, uploadFile, equipArgsEdit }
}
</script>

<style lang="scss" scoped>
.equip-args-list-container {
    font-size: 16px;
}
.equip-args-header {
    margin: 10px 0;
}
</style>