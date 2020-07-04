<template>
    <view-container>
        <define-input v-model="title" margin="15px 15px" label="必戴装备名称"></define-input>
        <div class="need-wear-body">
            <define-table :data="listData" height="2.8646rem" :havePage="false"
                          :highLightCurrent="true">
                <define-column label="操作" width="100" v-slot="{ data }">
                    <i class="iconfont icontianjia" @click="changeRow(true,data)"></i>
                    <i class="iconfont iconyichu" @click="changeRow(false,data)"></i>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input v-model="data.row.equipArg" :options="{search:'equipArgsSelect'}"
                                  format="{name}({model})" :column="12" :tableEdit="true"></entity-input>
                </define-column>
            </define-table>
            <tool-bar>
                <base-button label="取消" type="text" slot="button" @click="cancel"></base-button>
                <base-button label="提交" type="text" slot="button" @click="confirm"></base-button>
            </tool-bar>
        </div>
    </view-container>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import {addWearRates, updateWearRates} from "api/operation";

    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                listData: [{equipArg: ''}, {equipArg: ''}],
                title: '' //必带装备名称
            };
        },
        methods: {
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            confirm() {
                let equipArg = []
                this.listData.forEach(item => {
                    if (item.equipArg != '') {
                        equipArg.push(item.equipArg)
                    }
                })
                if (this.title == '' || equipArg.length == 0) {
                    this.$message.error("请填写完整")
                } else {
                    this.$route.params.info.edit ? updateWearRates(this.$route.params.info.data.id, {
                            name: this.title,
                            equipArgs: equipArg,
                            id: this.$route.params.info.data.id
                        }).then(res => {
                            this.cancel()
                        }) :
                        addWearRates({name: this.title, equipArgs: equipArg}).then(res => {
                            this.cancel()
                        })
                }
            },
            cancel() {
                this.$router.back()
            },
            changeRow(state, data) {
                state ? this.listData.push({equipArg: ''}) : this.listData.splice(data.$index, 1)
                if (this.listData.length == 0) {
                    this.listData = [{equipArg: ''}]
                }
            },
            changeCurrent(current) {
                this.equipArg = current.equipArgItems
            },
        },
        components: {
            bosTabs,
            serviceDialog,
        },
        created() {
            if (this.$route.params.info.data.name !== '') {
                this.$route.meta.crumb = '编辑必戴装备'
                this.title = this.$route.params.info.data.name
                this.listData = []
                this.$route.params.info.data.equipArgs.forEach(item => {
                    this.listData.push({equipArg: item})
                })
            }else {
                this.$route.meta.crumb = '新增必戴装备'
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
