<template>
    <view-container :tabs="tabs" v-model="search">
        <!-- 标签1 -->
        <define-table :data="[]" height="100%" slot="car2">
            <define-column label="测试列" field="a"></define-column>
            <define-column label="测试列2" field=""b></define-column>
        </define-table>
        <!-- 标签2 -->
        <div slot="car1" style="height: 100vh">
            <upload-file v-model="imgSrc"></upload-file>
            <define-image :url="imgSrc" margin="500px 30px"></define-image>
            <upload-file v-model="imgSrc"></upload-file>
        </div>
        <tool-bar :show-back="true">
            <define-input label="测试输入框" slot="input" :column="6"></define-input>
            <base-button label="测试按钮" type="text" slot="button"></base-button>
            <base-button label="测试按钮" type="text" slot="button"></base-button>
        </tool-bar>
    </view-container>
</template>
<script>
    import uploadFile from "../../componentized/uploadFile";
    import defineImage from "../../componentized/defineImage";
export default {
    name: 'test',
    components: {uploadFile, defineImage},
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
            search: '',
            imgSrc: '73424a3d1c3e41f98e28ac5da5c3284c.png'
        }
    }
}
</script>