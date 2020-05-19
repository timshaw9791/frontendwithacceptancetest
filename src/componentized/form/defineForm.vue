<template>
    <div class="define-form-container" :style="`width:${fixWidth};float:${align};margin:${margin}`">
        <!-- <slot name="form"></slot> -->
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        column: {
            type: Number,
            default: 12
        },
        align: {
            type: String,
            default: 'none'
        },
        margin: {
            type: String,
            default: '0'
        },
    },
    methods: {
        validate(callBack) {
            if(typeof callBack != 'function') {
                console.error("defineForm未给定回调函数");
                return;
            }
            typeof this.$slots.default == 'undefined'?callBack(true):this.$slots.default.filter(cmp => cmp.componentInstance&&'valid' in cmp.componentInstance.$attrs)
                .map(cmp => cmp.componentInstance.reg()).every(s => s)?callBack(true):callBack(false);
        }
    },
    computed: {
        fixWidth() {
            return `calc(${8.33*this.column}%)`;
        }
    },
}
</script>

<style lang="scss" scoped>
.define-form-container {
    width: 100%;
    height: auto;
    padding: 10px 0;
}
</style>