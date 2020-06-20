<template>
    <view-container :tabs="tabs" v-model="search" >
<!--            <el-table slot="car1" :data="[]" height="100%">-->
<!--                <el-table-column label="测试列1"></el-table-column>-->
<!--                <el-table-column label="测试列2"></el-table-column>-->
<!--            </el-table>-->
        <define-table :data="[]" height="100%">
            <define-column label="测试列" field="a"></define-column>
            <define-column label="测试列2" field=""b></define-column>
        </define-table>
        <!-- 标签1 -->
        <div slot="car2" style="height: 100vh">
        </div>
        <!-- 标签2 -->
        <div slot="car2" style="height: 100vh">这里是标签 2 内容</div>
        <!-- 标签1 按钮 -->
        <base-button label="按钮1" slot="buttoncar1">按钮1</base-button>
        <base-button label="按钮1" slot="buttoncar1">按钮1</base-button>
        <base-button label="按钮1" slot="buttoncar1">按钮1</base-button>
        
        <!-- 标签2 按钮 -->
        <span slot="buttoncar2">按钮2</span>
        <span slot="buttoncar2">按钮2</span>
        <span slot="buttoncar2">按钮2</span>

        <!-- 无标签 -->
        <base-button label="按钮1" slot="moreButtoncar1">按钮1</base-button>
        <base-button label="按钮1" slot="moreButtoncar1">按钮1</base-button>
        <base-button label="按钮1" slot="moreButtoncar1">按钮1</base-button>
        <div class="test-css-header"></div>
    </view-container>
</template>
<script>
export default {
    name: 'test',
    data() {
        return {
            tabs:[{
                    label: '标签卡1',
                    key: 'car1',
                    baseSearch: true,
                    advancedSearch: true,
                    baseSearchValue: ''
                }, {
                    label: '标签卡2',
                    key: 'car2'
                }],
            search: ''
        }
    }
}
</script>

<style scoped>

</style>