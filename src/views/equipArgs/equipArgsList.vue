<template>
    <view-container>
        <tool-bar>
            <base-button label="查询"></base-button>
            <base-button label="新增装备参数" @click="goto()"></base-button>
        </tool-bar>
        <define-table :data="list" @changePage="changePage" :pageInfo="paginator">
            <define-column label="操作" v-slot="{data}">
                <span @click="goto(data.row.id)" style="margin:8px">编辑</span>
            </define-column>
            <define-column label="图片" v-slot="{ data }" >
                <img class="img" :src="data.row.image" :onerror="noImgUrl" style="height:30px;width:30px;"/>
            </define-column>
            <define-column label="装备名称" field="name"></define-column>
            <define-column label="装备型号" field="model"></define-column>
            <define-column label="供应商" field="supplier.name"></define-column>
            <define-column label="保质期(天)" v-slot="{data}">
                <date-input v-model="data.row.shelfLife" :disabled="true" placeholder="-"></date-input>
            </define-column>
            <define-column label="充电周期(天)" v-slot="{data}">
                <date-input v-model="data.row.chargeCycle" :disabled="true" placeholder="-"></date-input>
            </define-column>
            <define-column label="保养周期(天)" v-slot="{data}">
                <date-input v-model="data.row.upkeepCycle" :disabled="true" placeholder="-"></date-input>
            </define-column>
        </define-table>
    </view-container>
</template>

<script>
    import {getEpArgsList} from "@/api/equipArgs";
    import textInput from "../../componentized/textBox/textInput";
    import myHeader from "../../components/base/header/header"
    import {imgBaseUrl} from "@/api/config"
    import {listTableMixin} from "@/field/mixins/listMixin"

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
                paginator: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''},
                noImgUrl: 'this.src="' + require('../../assets/noImg.png') + '"'
            }
        },

        mixins: [listTableMixin],

        props: {
            showData: {
                type: Object
            }
        },

        methods: {
            changePage(page) {
                this.paginator.page = page;
                this.fetchData();
            },
            fetchData() {
                getEpArgsList(this.paginator).then(res => {
                    this.list = res.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
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

</style>