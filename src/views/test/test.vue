<template>
    <view-container :tabs="tabs" v-model="search">
        <!-- 标签1 -->
        <div slot="car1">
            <define-table :data="[]" height="100%">
                <define-column label="测试列" field="a"></define-column>
                <define-column label="测试列2" field="" b></define-column>
            </define-table>
            <div style="width: 100px; position: relative;">
                <div style="background: red; width: 60px;height: 50px; border-radius: 25px; float: right;position: absolute;line-height: 50px;text-align:center;top:-20px;left: 70px">100</div>
                <div style="background: #409EFF; width: 100px;height: 100px"></div>
            </div>

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
        <base-button label="按钮1" slot="car1morebutton">按钮1</base-button>
        <base-button label="按钮1" slot="car1morebutton">按钮1</base-button>
        <base-button label="按钮1" slot="car1morebutton">按钮1</base-button>
        <!--测试-->
        <base-button label="测试按钮" slot="publicbutton" type="text"></base-button>
        <tool-bar :show-back="true">
            <define-input label="测试输入框" slot="input" :column="6"></define-input>
            <base-button label="测试按钮" type="text" slot="button"></base-button>
            <base-button label="测试按钮" type="text" slot="button"></base-button>
        </tool-bar>
    </view-container>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'test',
        data() {
            return {
                tabs: [{
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
        },
        computed: {
            ...mapGetters([
                'enumsObj'
            ])
        }
    }
</script>