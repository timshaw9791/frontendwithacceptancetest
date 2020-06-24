<template>
    <div class="view-container">
        <div class="top-tools-container">
            <div class="breadcrumb-box">
                <bread-crumb :routeList="routeList"></bread-crumb>
            </div>
            <div class="tabs-box">
                <div v-for="(tab, i) in tabs" :key="tab.key" class="tab" v-show="tab.label" :class="{'tab-select': tabSelect==i}" @click="selectTab(tab, i)">{{ tab.label }}</div>
            </div>
            <div class="tools-box" v-if="false">
                <define-input :label="tabs[tabSelect].baseSearchName" v-model="tabs[tabSelect].baseSearchValue" :column="6" v-show="tabs[tabSelect].baseSearch" class="base-input"></define-input>
                <div class="button-box">
                    <div v-for="tab in tabs" :key="'buttonslot'+tab.key" v-show="tabs[tabSelect].key==tab.key" class="button">
                        <slot :name="tab.key+'button'"></slot>
                    </div>
                    <slot name="publicbutton"></slot>
                </div>
                <div class="built-in-box">
                    <span @click="advancedSearchShow = !advancedSearchShow" v-show="tabs[tabSelect].advancedSearch" class="built-in">高级搜索</span>
                    <div class="dropdown-container" @mouseleave="showMenu=false" v-show="showMoreButton">
                        <span class="label" @click="showMenu=!showMenu">更多</span>
                        <div class="menu" v-show="showMenu">
                            <slot :name="tabs[tabSelect].key+'morebutton'"></slot>
                            <slot name="publicmorebutton"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="body">
            <div v-for="tab in tabs" :key="'nameSlot'+tab.key" v-show="tabs[tabSelect].key==tab.key&&tab.label" class="name-slot-box">
                <slot :name="tab.key" v-if="tabs[tabSelect].key==tab.key"></slot>
            </div>
<!--            <slot v-for="tab in tabs" v-if="tabs[tabSelect].key==tab.key" :name="tab.key"></slot>-->
            <slot></slot>
        </div>
        <transition name="search">
            <div class="advanced-search-box" v-show="advancedSearchShow" @mouseleave="advancedSearchShow =false">
                <div class="search-box">
                    <div class="group">
                        <span v-show="!selectObj.groupLast">（ </span>
                        <base-select :selectList="testArr" :haveLabel="false" :column="3.5" margin="0 3px"></base-select>
                        <base-select :selectList="[{label: '勾选', value: 'True'}, {label: '不选', value: 'False'}]" :haveLabel="false" :column="3.5" margin="0"></base-select>
                        <define-input :haveLabel="false" :column="3"  margin="0 3px" align="right"></define-input>
                    </div>
                    <base-select v-model="selectObj.logicLeft" :selectList="[{label: '并且', value: 'and'}, {label: '或者', value: 'or'}]" :haveLabel="false" :column="12"></base-select>
                    <div class="group">
                        <span v-show="selectObj.groupLast">（ </span>
                        <base-select :selectList="testArr" :haveLabel="false" :column="3.5" margin="0 3px"></base-select>
                        <base-select :selectList="[{label: '勾选', value: 'True'}, {label: '不选', value: 'False'}]" :haveLabel="false" :column="3.5"  margin="0 3px"></base-select>
                        <define-input :haveLabel="false" :column="5"></define-input>
                        <span v-show="!selectObj.groupLast"> ）</span>
                    </div>
                    <base-select v-model="selectObj.logicRight" :selectList="[{label: '并且', value: 'and'}, {label: '或者', value: 'or'}]" :haveLabel="false" :column="12" ></base-select>
                    <div class="group">
                        <base-select :selectList="testArr" :haveLabel="false" :column="3.5"  margin="0 3px"></base-select>
                        <base-select :selectList="[{label: '勾选', value: 'True'}, {label: '不选', value: 'False'}]" :haveLabel="false" :column="3.5"  margin="0 3px"></base-select>
                        <define-input :haveLabel="false" :column="3"  margin="0 3px"></define-input>
                        <span v-show="selectObj.groupLast"> ）</span>
                    </div>
                </div>
                <div class="control-box">
                    <checkbox label="组合后两个条件" v-model="selectObj.groupLast" :column="1.5" margin="0 0 0 -1.5625rem"></checkbox>
                    <base-button label="保存"></base-button>
                    <base-button label="重置"></base-button>
                    <base-button label="查询"></base-button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import breadCrumb from './breadCrumb'
import dropdown from './dropdown'
export default {
    name: 'viewContainer',
    data() {
        return {
            routeList: [], // 路由面包屑
            tabSelect: 0, // 当前选择的标签卡索引
            advancedSearchShow: false, // 是否显示高级搜索框
            showMenu: false, // 控制下拉菜单
            // showMoreButton: false, // 是否显示更多文字(通过判断是否填充了插槽)
            logicArr: [{label: '并且', key: 'and'}, {label: '或者', key: 'or'}],
            triggleArr: [{label: '勾选', key: 'True'}, {label: '不选', key: 'False'}],
            testArr: [{label: '星标1', value: 'xb1'}, {label: '星标2', value: 'xb2'}],
            selectObj: {
                logicLeft: 'and',
                logicRight: 'or',
                gourpLast: false
            }
        }
    },
    methods: {
        selectTab(tabData, index) { // 切换标签卡
            this.tabSelect = index;
            this.advancedSearchShow = false;
            this.$emit('changeTab', tabData); // 返回值为选中的tab数据
        }
    },
    props: {
        tabs: {
            type: Array,
            default() {
                return [{
                    label: '',
                    key: '',
                    baseSearchName: '搜索'
                }]
            }
        },
        value: {},
    },
    computed: {
        // showMoreButton() {
        //     return Object.keys(this.$slots)
        //         .some(sortName=>sortName.includes(`${this.tabs[this.tabSelect].key}morebutton`)||sortName.includes('publicmorebutton'))
        // }
    },
    components: {breadCrumb, dropdown},
    created() {
        console.log(this.$route)
        this.routeList = this._.drop(this.$route.matched)
    }
}
</script>

<style lang="scss" scoped>
    /deep/ .checkbox-container {
        .label {
            color: #2F2F76;
        }
    }
    $mainHeight: 928px;
    .view-container {
        width: 100%;
        font-size: 16px;
    }
    .top-tools-container {
        width: 100%;
        height: 60px;
        padding: 0 6px;
        display: grid;
        z-index: 999;
        grid-template-columns: 0.9fr 1fr 1.1fr;
        border-bottom: 1px solid #DCDFE6;
        box-shadow:1px 3px 8px rgba(0,0,0,0.04);
        .breadcrumb-box {
            height: 60px;
            display: inline-flex;
            align-items: center;
        }
        .tabs-box {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 60px;
            .tab {
                padding: 0 17px;
                height: 42px;
                line-height: 42px;
                cursor: pointer;
            }
        }
        .tools-box {
            min-width: 620px;
            display: inline-flex;
            justify-content: flex-end;
            align-items: center;
            height: 60px;
            line-height: 60px;
            .base-input {
                min-width: 240px;
            }
            .button-box {
                width: auto;
                // min-width: 230px;
                flex-grow: 1;
                height: 60px;
                white-space: nowrap;
                text-align: right;
                color: #51519A;
                font-size:18px;
                overflow: hidden;
                user-select: none;
            }
            .built-in-box {
                max-width: 124px;
                /*min-width: 50px;*/
                flex-grow: 0;
                flex-shrink: 0;
                display: inline-flex;
                justify-content: flex-end;
            }
            .built-in {
                cursor: pointer;
            }
            .button {
                text-align: right;
            }
        }
        .tab-select {
            border: 2px solid #DCDFE6;
            border-bottom: 1px solid white;
        }
    }
    .dropdown-container {
        display: inline-block;
        width: 50px;
        position: relative;
        text-align: center;
        .label {
            cursor: pointer;
        }
        .menu {
            z-index: 9999999999;
            position: absolute;
            line-height: initial;
            width: 100px;
            min-height: 100px;
            background-color: white;
            border: 1px solid #ebeef5;
            box-shadow:1px 3px 8px rgba(0,0,0,0.1);
            left: -50px;
        }
        .menu::before {
            content: '';
            position: absolute;
            bottom: 100%;
            right: 10%;
            width: 0;
            height: 0;
            border-width:5px;
            border-style:solid;
            border-color: transparent;
            border-bottom-width: 8px;
            border-bottom-color: currentColor;
            color: #FFFFFF;
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
        .search-box {
            width: 100%;
            height: 70px;
            display: grid;
            grid-template-columns: minmax(2.1667rem,28%) 6% minmax(2.1667rem,28%) 6% minmax(2.1667rem,28%);
            column-gap: 1%;
            align-items: center;
        }
        .group {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #F0F2F7;
        }
        .control-box {
            display: inline-block;
            width: 100%;
            margin: 30px 0;
            text-align: center;
        }
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
        height: $mainHeight;
        max-height: $mainHeight;
        overflow-x: hidden;
        overflow-y: auto;
        margin-top: 8px;
        padding: 0 8px;
        .name-slot-box {
            height: 100%;
        }
    }    
    .search-enter-active, .search-leave-active {
        transition: opacity .5s;
    }
    .search-enter, .search-leave-to{
        opacity: 0;
    }
</style>