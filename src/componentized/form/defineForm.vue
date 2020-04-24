<template>
    <div class="define-form-container">
        <slot name="form"></slot>
        <slot></slot>
    </div>
</template>

<script>
export default {
    methods: {
        validate(callBack) {
            if(typeof callBack != 'function') {
                console.error("defineForm未给定回调函数");
                return;
            }
            this.$slots.form instanceof Array&&this.$slots.form.map(cmp => cmp.componentInstance.reg()).every(s => s)?callBack(true):callBack(false);
        }
    },
    mounted() {
        // console.log(this.$scopedSlots.default()[0].componentInstance.reg());
        // console.log('--------');
        // console.log(this.$slots.default);
        // console.log(this.$slots.default[0]);
    }
}
</script>

<style lang="scss" scoped>
.define-form-container {
    width: 100%;
    height: 160px;
    border: 1px solid black;
}
</style>