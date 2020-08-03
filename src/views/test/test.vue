<template>
    <view-container :tabs="tabs" v-model="search">
        <!-- 标签1 -->
        <div slot="car1">
            <define-table :data=list height="100%">
                <define-column label="测试列" v-slot="{data}" >
                  <define-input v-model="data.row.operator"/>
                </define-column>
                <define-column label="测试列2" field=""></define-column>
            </define-table>
            <label>
                哈哈哈
                <input v-model="list[0].operator">
            </label>
            <el-table height="100%" :border="true" :data="list">
                <el-table-column label="hh" prop="operator"></el-table-column>
            </el-table>
            <base-select :list="$store.getters.enums.device" v-model="selected">

            </base-select>
            <div class="button" @click="start">开始</div>
            <div class="button" @click="close">关闭</div>
            <div class="button" @click="startOne">读一次</div>
            <div class="button" @click="write">写</div>
            <div>{{ rfidInfo }}</div>
        </div>

        <!-- 标签2 -->
        <div slot="car2" style="height: 100vh">
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
    import { wsReadInfo } from "../../common/js/rfidReader";

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
            imgSrc: '73424a3d1c3e41f98e28ac5da5c3284c.png',
            list: [{operator:'chen'}],
            selected:'',
            rfidInfo: ''
        }
    },
    methods: {
        start() {
            wsReadInfo('scan-start', data => {
                this.rfidInfo += "---" + data
            })
        },
        close() {
            wsReadInfo('scan-stop', () => {
                this.rfidInfo = ""
            })
        },
        startOne() {
            wsReadInfo('read', data => {
                this.rfidInfo = "读一次" + data
            })
        },
        write() {
            wsReadInfo('write-19090917', data => {
                this.$message.success('写入成功')
            }, true)
        }
    }
}
</script>