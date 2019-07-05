<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="batch=!batch">
                        <svg-icon icon-class="批量"/>
                        {{title}}
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                v-if="type==='全部'"
                                placeholder="装备/序号/编号"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <need :batch="batch" @cancel="cancel" v-if="show"></need>
                <right :batch="batch" @cancel="cancel" v-if="!show"></right>
            </div>
        </el-card>


    </div>
</template>

<script>

    import tabs from 'components/base/tabs/index'
    import need from './needMaintenance'
    import right from './rightMaintenance'

    export default {

        data() {
            return {
                tabsList: ['需要保养', '正在保养'],
                type: '',
                inquire: '',
                batch: false,
                show: true,
                title: ''
            }
        },

        methods: {
            selected(data) {
                console.log(data);
                this.type = data;
                if (data === '需要保养') {
                    this.title = '批量保养';
                    this.show = true;
                } else if (data === '正在保养') {
                    this.title = '批量入库';
                    this.show = false;
                }
                this.batch = false;
            },
            cancel(data) {
                this.batch = data;
            }
        },

        components: {
            tabs,
            need,
            right
        },

    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>