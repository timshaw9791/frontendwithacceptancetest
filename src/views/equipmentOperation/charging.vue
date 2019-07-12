<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <div class="_buttons">
                        <BosInput
                                v-if="type==='全部'"
                                placeholder="装备/序号/编号/AB面"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <need v-if="show"></need>
                <right v-if="!show"></right>
            </div>
        </el-card>

    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import need from './needCharging'
    import right from './rightCharging'

    export default {
        data() {
            return {
                tabsList: ['需要充电', '正在充电'],
                inquire: '',
                type: '',
                show: true
            }
        },
        methods: {
            selected(data) {
                this.type = data;
                if (data === '需要充电') {
                    this.show = true;
                } else if (data === '正在充电') {
                    this.show = false;
                }
            },
        },

        components: {
            tabs,
            need,
            right
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>