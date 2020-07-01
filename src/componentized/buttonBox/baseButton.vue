<template>
    <div class="base-button-container" :style="`float:${align};margin:${margin}`">
        <button class="button" :class="[type,size,{disabled: disabled||throttleState}]" @click="clickBtn">
            <i class="iconfont" :class="[icon, iconAlign]"></i>
            {{ label }}
        </button>
    </div>
</template>
<script>
export default {
    name: 'baseButton',
    data() {
        return {
            throttleState: false, // 按钮响应节流状态
        }
    },
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
        },
        disabled: {
            type: Boolean,
            default: false
        },
        throttle: { // 是否启用按钮响应节流
            type: Boolean,
            default: true
        },
        align: {
            type: String,
            default: 'none'
        },
        margin: {
          type: String,
          default: '0 3px'
        },
        icon: {
            type: String,
            default: ''
        },
        iconAlign: {
            type: String,
            default: 'left'
        }
    },
    methods: {
      clickBtn() {
        if(this.throttle) {
            if(this.throttleState||this.disabled) return;
            this.throttleState = true;
            setTimeout(() => {this.throttleState = false}, 1000);
        }
        this.$emit('click');
      }
    }
}
</script>

<style lang="scss" scoped>
.base-button-container {
    display: inline-block;
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
    .text {
        display: inline;
        padding: 0;
        background: transparent;
        border: none;
        color: #51519A;
    }
    .disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .left {
        margin-left: 0;
        float: left;
    }
    .right {
        margin-right: 0;
        float: right;
    }
}
</style>