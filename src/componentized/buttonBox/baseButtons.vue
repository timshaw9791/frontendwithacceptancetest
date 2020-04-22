<template>
    <div class="base-button-container">
        <button class="button" :class="[type,size]">{{ label }}</button>
    </div>
</template>

<script>
export default {
    name: 'baseButton',
    props: {
        label: {
          type: String,
          default: "按钮"  
        },
        type: {
            type: String,
            default: 'primary'
        },
        size: {
            type: String,
            default: 'default'
        }
    }
}
</script>

<style lang="scss" scoped>
.base-button-container {
    font-size: 16px;
    .button {
        border-width: 0;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
        text-align: center;
        background-color: white;
        border: 1px solid #dcdfe6;
    }
    .mini {
        height: 25px;
        font-size: 13px;
    }
    .small {
        height: 30px;
        font-size: 14px;
        padding: 0 10px;
    }
    .default {
        height: 40px;
        padding: 0 12px;
    }
    .medium {
        height: 50px;
        font-size: 18px;
        padding: 0 12px;
    }
    .large {
        height: 70px;
        font-size: 20px;
        padding: 0 20px;
    }
    .primary {
        background-color: #2f2f76;
        color: white;
    }
    .simple {
        background-color: #409EFF;
        color: white;
    }
    .success {
        background-color: #67C23A;
        color: white;
    }
    .warning {
        background-color: #E6A23C;
        color: white;
    }
    .danger {
        background-color: #F56C6C;
        color: white;
    }
}
</style>