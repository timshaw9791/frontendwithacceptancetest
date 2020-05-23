<template>
    <view-container :tabs="tabs">
        <!-- 标签1 -->
        <div slot="car1" style="height: 100vh">这里是标签 1 内容</div>
        <!-- 标签2 -->
        <div slot="car2" style="height: 100vh">这里是标签 2 内容</div>
        <!-- 标签1 按钮 -->
        <!-- <base-button label="按钮1" slot="toolcar1">按钮1</base-button>
        <base-button label="按钮1" slot="toolcar1">按钮1</base-button>
        <base-button label="按钮1" slot="toolcar1">按钮1</base-button>
        <base-button label="按钮1" slot="toolcar1">按钮1</base-button>
        <base-button label="按钮1" slot="toolcar1">按钮1</base-button> -->
        <!-- 标签2 按钮 -->
        <!-- <span slot="toolcar2">按钮2</span>
        <span slot="toolcar2">按钮2</span>
        <span slot="toolcar2">按钮2</span>
        <span slot="toolcar2">按钮2</span>
        <span slot="toolcar2">按钮2</span> -->
        <!-- 无标签 -->
        <div>这里是无标签内容</div>
    </view-container>
</template>

<script>
import viewContainer from '@/componentized/viewContainer'
export default {
    name: 'test',
    data() {
        return {
            tabs:[{
                    label: '标签卡1',
                    key: 'car1'
                }, {
                    label: '标签卡2',
                    key: 'car2'
                }]
        }
    },
    components: {viewContainer}
}
</script>