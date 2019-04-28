<template>
    <div class="tabs">
        <div v-for="(item,index) in list" :key="item" class="button" :class="{visited:visited===index}"
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
                visited: 0,
            }
        },
        methods: {
            tabsClick(index, item) {
                this.visited = index;
                this.$emit('selected', item)
            }
        },
        props: {
            list: {
                type: Array,
                default: [],
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tabs {
        display: flex;
        padding-bottom: 16px;
        border-bottom: 1px solid #EBEEF5;
        .button {
            margin-right: 18px;
            width: 82px;
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