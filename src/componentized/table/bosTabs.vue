<template>
    <div :style="`margin:${margin}`">
        <div class="bos-card-container" :style="`width:${width}`">
            <div class="top-tabs" v-if="tabs&&header" >
                <div v-for="(item, i) in label" :key="i"
                     :class="{'tabs':true,'selected':selectedIndex==i}"
                     @click="changeTab(i, item)">{{ item.label }}</div>
            </div>
            <div class="slot-component" v-if="header" >
                <slot name="slotHeader"></slot>
            </div>
            <div class="bos-card-body" :style="`grid-template-columns:${gridColumn};height:${fixHeight}`">
                <div v-for="(item, i) in label" :key="'slot'+i"  v-show="label[selectedIndex].key == item.key&&tabs" class="slot">
                    <slot :name="item.key"></slot>
                </div>
                <div class="contrast-component" v-for="(slotName, j) in contrastKey" :key="j" v-show="contrast">
                    <slot :name="slotName"></slot>
                    <div class="mask" v-show="contrastMask" :style="`background-color:${contrastColor[j]}`"></div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'bosTabs',
        data() {
            return {
                selectedIndex: 0,
                tabs: false,
                contrast: false
            }
        },
        props: {
            label: {
                type: Array,
                default() {
                    return [{
                        label: '总清单',
                        key: 'total'
                    }, {
                        label: '明细',
                        key: 'detail'
                    }]
                }
            },
            width: {
                type: String,
                default: '100%'
            },
            margin: {
                default: '0 10px'
            },
            option: {
                type: Array,
                default() {
                    return ['tabs']
                }
            },
            contrastKey: {
                type: Array,
                default() {
                    return ['contrast']
                }
            },
            contrastMask: {
                type: Boolean,
                default: true
            },
            contrastColor: {
                type: Array,
                default() {
                    return ['rgba(244,244,248,0.3)']
                }
            },
            layoutRatio: {
                type: Array,
                default() {
                    return [50,50]
                }
            },
            header: { // 是否启用顶部栏
                type: Boolean,
                default: true
            },
            height:{
                type:[String,Number],
                default:'100%'
            }
        },
        computed: {
            gridColumn() {
                if(!this.contrast) return '100%';
                return this.layoutRatio.reduce((pre, cur) => {
                    if(!/^\d+(\.\d+)?(px|vw|%|rem)?$/g.test(cur)) {
                        console.error("参数："+cur+",格式不正确或不被支持")
                    }
                    pre += isNaN(cur)?cur+' ':cur+'% ';
                    return pre;
                }, "");
            },
            fixHeight(){
                return  this.header ? `calc(${this.height} - 50px)` : this.height;
            }
        },
        methods: {
            changeTab(index, item) {
                this.selectedIndex = index;
                this.$emit('changeTab', Object.assign({index}, item));
            }
        },
        created() {
            this.option.forEach(key => {
                if(['tabs', 'contrast'].includes(key)){
                    this[key] = true;
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .bos-card-container {
        font-size: 16px;
        min-height: 50px;
        /*padding: 0 10px;*/
    }
    .bos-card-body {
        width: 100%;
        display: grid;
        /*避免表格显示异常*/
        .define-table-container{
            margin: 0 !important;
        }
    }
    .top-tabs {
        width: 50%;
        // min-width: 400px;
        min-height: 50px;
        max-height: 50px;
        float: left;
    }
    .tabs {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding: 0 16px;
        background-color: #EAEAEA;
        border: 1px solid #EAEAEA;
        vertical-align: bottom;
        cursor: pointer;
    }
    .tabs:hover {
        color: deepskyblue;
    }
    .slot-component {
        width: 50%;
        min-height: 50px;
        max-height: 50px;
        float: right;
        text-align: right;
    }
    .slot {
        width: auto;
    }
    .selected {
        height: 50px;
        line-height: 50px;
        background-color: white;
    }
    .contrast-component {
        position: relative;
        width: auto;
        // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999;
        opacity: 0.3;
    }
</style>