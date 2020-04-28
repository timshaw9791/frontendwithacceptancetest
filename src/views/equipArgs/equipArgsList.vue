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
                    <img class="img" :src="imgBaseUrl+data.row.image"/>
                </define-column>
                <define-column label="装备名称" field="name"></define-column>
                <define-column label="装备型号" field="model"></define-column>
                <define-column label="供应商" field="supplier.name"></define-column>
                <define-column label="保质期(天)" :filter="(row)=>milliToDay(row.shelfLife)"></define-column>
                <define-column label="充电周期(天)" :filter="(row)=>milliToDay(row.chargeCycle)"></define-column>
                <define-column label="保养周期(天)" :filter="(row)=>milliToDay(row.upkeepCycle)"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import {getEpArgsList} from "../../api/equipArgs";
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
        mixins:[listMixin],
        props: {
            showData: {
                type: Object
            }
        },
        methods: {
            milliToDay(data) {
                let date = JSON.parse(JSON.stringify(data));
                let day = Math.round(date / 24 / 60 / 60 / 1000);
                if (day < 1) {
                    return day = 1 + '天';
                } else {
                    return day + '天'
                }
            },
            changePage(page) {
                this.pageInfo.page = page;
                this.getList();
            },
            fetchData(){
                getEpArgsList(this.pageInfo).then(res => {
                    this.list = res.content;
                    this.pageInfo.totalPages = res.totalPages;
                    this.pageInfo.totalElements = res.totalElements;
                })
            },
            goto(id){
                this.$router.push({
                    path:"equipArgsEdit",
                    query:{
                        id:id
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .equipArgs-info {
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