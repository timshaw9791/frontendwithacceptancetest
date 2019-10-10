<template>
    <div class="tabs">
        <div v-for="(item,index) in list" :key="item" class="button" :class="{visited:visited===index}" ref="list"
             @click="tabsClick(index,item)">{{item}}
        </div>
        <slot>
        </slot>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visited: this.indexDefault,
            }
        },
        methods: {
            tabsClick(index, item) {
                this.visited = index;
                this.$emit('selected', item)
            }
        },
        mounted() {
            if (this.$refs.list) {
                this.$emit('selected', this.$refs.list[this.visited].innerText)
            }
        },
        props: {
            list: {
                type: Array,
                default: () => [],
            },
            indexDefault: {
                type: Number,
                default: 0,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tabs {
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px solid #EBEEF5;
        max-height: 44px;
        min-height: 44px;
        position: relative;

        .button {
            margin-right: 18px;
            width: 100px;
            height: 32px;
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .button:hover, .visited {
            background: rgba(47, 47, 118, 1);
            color: white;
            transition: all 0.3s;
        }


    }
</style>