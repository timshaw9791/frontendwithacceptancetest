<template>
    <div class="view-container">
        <div class="top-tools-contaienr">
            <div class="breadcrumb-box">
                <bread-crumb :routeList="routeList"></bread-crumb>
            </div>
            <div class="tabs-box">
                <div v-for="(tab, i) in tabs" :key="tab.key" class="tab" :class="{'tab-select': tabSelect==i}" @click="selectTab(tab, i)">{{ tab.label }}</div>
            </div>
            <div class="tools-box">
                <div v-for="tab in tabs" :key="'toolslot'+tab.key" v-show="tabs[tabSelect].key==tab.key" class="tools">
                    <slot :name="'tool'+tab.key"></slot>
                </div>
                <span @click="advancedSearchShow = !advancedSearchShow">高级搜索</span>
            </div>
            
        </div>
        <div class="body">
            <div v-for="tab in tabs" :key="'nameSlot'+tab.key" v-show="tabs[tabSelect].key==tab.key" class="name-slot-box">
                <slot :name="tab.key"></slot>
            </div>
            <slot></slot>
        </div>
        <transition name="search">
            <div class="advanced-search-box" v-show="advancedSearchShow"></div>
        </transition>
    </div>
</template>

<script>
import breadCrumb from './breadCrumb'
export default {
    name: 'topTools',
    data() {
        return {
            routeList: [],
            tabSelect: 0,
            advancedSearchShow: false
        }
    },
    methods: {
        selectTab(tabData, index) { // 切换标签卡
            this.tabSelect = index;
            this.$emit('changeTab', tabData);
        }
    },
    props: {
        tabs: {
            type: Array,
            default() {
                return [{
                    label: '标签卡1',
                    key: 'car1'
                }, {
                    label: '标签卡2',
                    key: 'car2'
                }]
            }
        }
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                this.routeList = this._.drop(val.matched);
            },
            deep: true,
            immediate: true
        }
    },
    components: {breadCrumb}
}
</script>

<style lang="scss" scoped>
    $mainHeight: calc(91vh - 78px);
    .view-container {
        width: 100%;
        font-size: 16px;
    }
    .top-tools-contaienr {
        width: 100%;
        height: 60px;
        padding: 0 18px;
        display: grid;
        z-index: 999;
        grid-template-columns: 1fr 1fr 1fr;
        border-bottom: 1px solid #DCDFE6;
        box-shadow:1px 3px 8px rgba(0,0,0,0.04);
        .breadcrumb-box {
            background-color: lightcoral;
            height: 100%;
            display: inline-flex;
            align-items: center;
        }
        .tabs-box {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            // background-color: lightcyan;
            height: 60px;
            .tab {
                padding: 0 17px;
                height: 42px;
                line-height: 42px;
                cursor: pointer;
            }
        }
        .tools-box {
            background-color: lightskyblue;
            line-height: 60px;
            .tools {
                text-align: right;
            }
        }
        .tab-select {
            border: 2px solid #DCDFE6;
            border-bottom: 1px solid white;
        }
    }
    .advanced-search-box {
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        min-height: 100px;
        border:1px solid rgba(220,223,230,1);
        box-shadow:1px 3px 8px rgba(0,0,0,0.04);
        background-color: white;
    }
    .body {
         &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background-color: white;
        }
        &::-webkit-scrollbar-thumb {
            background:rgba(178,178,204,0.7);
            border-radius: 20px;
        }
        width: 100%;
        min-height: $mainHeight;
        max-height: $mainHeight;
        overflow-x: hidden;
        overflow-y: auto;
        margin-top: 18px;
    }    
    .search-enter-active, .search-leave-active {
        transition: opacity .5s;
    }
    .search-enter, .search-leave-to{
        opacity: 0;
    }
</style>