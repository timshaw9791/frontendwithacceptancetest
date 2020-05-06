<template>
    <div class="equip-args-list-container">
        <my-header title="装备参数列表"></my-header>
        <div class="header">
            <text-input label="装备名称" placeholder="请输入装备名称"></text-input>
            <base-button label="查询"></base-button>
            <base-button label="新增装备参数" @click="goto()"></base-button>
        </div>
        <div class="body">
            <define-table :data="list" @changePage="changePage" :pageInfo="pageInfo">
                <define-column label="操作" v-slot="{data}">
                    <span @click="goto(data.row.id)" style="margin:8px">编辑</span>
                </define-column>
                <define-column label="图片" v-slot="{ data }" style="width: 30px">
                    <img class="img" :src="data.row.image" alt="暂无图片"/>
                </define-column>
                <define-column label="装备名称" field="name"></define-column>
                <define-column label="装备型号" field="model"></define-column>
                <define-column label="供应商" field="supplier.name"></define-column>
                <define-column label="保质期(天)" v-slot="{data}">
                    <date-input v-model="data.row.shelfLife" :disabled="true"  ></date-input>
                </define-column>
                <define-column label="充电周期(天)" v-slot="{data}">
                    <date-input v-model="data.row.chargeCycle" :disabled="true" ></date-input>
                </define-column>
                <define-column label="保养周期(天)" v-slot="{data}">
                    <date-input v-model="data.row.upkeepCycle" :disabled="true" ></date-input>
                </define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import {getEpArgsList} from "@/api/equipArgs";
    import textInput from "../../componentized/textBox/textInput";
    import myHeader from "../../components/base/header/header"
    import {imgBaseUrl} from "../../api/config"
    import {listMixin} from "../../field/mixins/listMixin"

    export default {
        name: "equipArgsList",
        components: {
            textInput,
            myHeader
        },
        data() {
            return {
                list: [],
                imgBaseUrl: imgBaseUrl,
                pageInfo: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''},
            }
        },

        mixins: [listMixin],

        props: {
            showData: {
                type: Object
            }
        },
        methods: {
            changePage(page) {
                this.pageInfo.page = page;
                this.fetchData();
            },
            fetchData() {
                getEpArgsList(this.pageInfo).then(res => {
                    this.list = res.content
                    this.pageInfo.totalPages = res.totalPages
                    this.pageInfo.totalElements = res.totalElements
                    this.fixData()
                })
            },
            // TODO 暂无图片处理
            fixData() {
                this.list.forEach(item => {
                    if (item.image.length > 0) {
                        item.image = imgBaseUrl + item.image
                    }
                })
            },
            goto(id) {
                this.$router.push({
                    path: "equipArgsEdit",
                    query: {
                        id: id
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        padding: 16px 7px;
    }

    .img {
        height: 30px;
        width: 30px;
    }

    .equip-args-list-container {
        color: #707070FF;
        font-size: 16px;
    }
</style>