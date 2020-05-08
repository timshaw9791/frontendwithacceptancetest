<template>
    <div class="inventory-container">
        <my-header title="装备盘点列表"></my-header>
        <div class="header">
            <base-button label="开始盘点" ></base-button>
        </div>
        <div class="body">
            <define-table :data="list">
                <define-column label="操作"></define-column>
                <define-column label="单号"></define-column>
                <define-column label="应盘点总数"></define-column>
                <define-column label="已盘点总数"></define-column>
                <define-column label="未知装备数"></define-column>
                <define-column label="盘点人员"></define-column>
                <define-column label="盘点时间"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'

    export default {
        name: "inventory",
        components: {
            myHeader,
        },
        data() {
            return {
                list:[]
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped>
    .inventory-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 8px;
    }
</style>
