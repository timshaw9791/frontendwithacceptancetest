<template>
  <div class="text-input-container" ref="defineInput" :style="`width:${fixWidth}`"
      :class="[styleObj,{'disabled':disabled&&inTableStateContrl,'border':(tableEdit&&edit)}]" @click="changeEditState(true)">
    <div class="label" v-if="!inTable">{{ label }}
      <span class="required" v-if="required">*</span>
    </div>
    <input type="text" class="input" :disabled="disabled" v-model="insideValue" 
      :maxlength="maxlength" @change="reg" :readonly="!(tableEdit&&edit)" :placeholder="placeholder"
      @blur="changeEditState(false)" @keydown.13="changeEditState(false)"/>
    <div class="icon" v-show="insideValue!=''&&clearable&&!disabled&&tableEdit&&edit">
      <i class="iconfont iconwenbenkuangshanchu" @click="clear"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "defineInput",
  data() {
    return {
      insideValue: "",
      inTable: false,
      edit: true, // 内部判断是否只读
      inTableStateContrl: true,
      styleObj: {
        error: false,
        'table-error': false,
        'table-error': false
      }
    };
  },
  props: {
    label: {
      type: String,
      default: "标题"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    column: {
      type: Number,
      default: 3
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "String"
    },
    tableEdit: {
      type: Boolean,
      default: true
    },
    clearable: {
      // 是否可清空
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: -1
    },
    required: {
      // 是否必填
      type: Boolean,
      default: false
    },
    validate: {
      // 验证函数
      type: Function,
      default() {
        return () => true;
      }
    },
    haveTip: {
      // 是否启用建议输入
      type: Boolean,
      default: false
    },
    tips: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: [Number, String],
      default: ""
    }
  },
  computed: {
    fixWidth() {
      return this.inTable?`calc(100% - 0.1042rem)`:`calc(${8.33*this.column}% - 0.1042rem)`;
    }
  },
  methods: {
    clear() {
      this.insideValue = "";
      this.reg(); // 这里貌似没有触发change事件。暂且手动触发
    },
    reg() {
      let judge = true;
      switch (this.type) {
        case "Number":
            judge = /^-?\d+(\.\d+)?$/.test(this.value);
            break;
        case "Email":
            judge = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(this.value);
            break;
        case 'Phone':
            judge = /^1[3456789]\d{9}$/.test(this.value);
            break;
        case 'CardId':
            judge = /(^\d{15}$)|(^\d{17}(\d|x|X)$)/i.test(this.value);
            break;
        case 'Integer':
            judge = /^-?[0-9]\d*$/.test(this.value);
            break;
        case 'Decimal':
            judge = /^-?([0-9]+\.[0-9]+)$/.test(this.value);
            break;
        case 'Require':
            judge = Boolean(this.value);
            break;
        case 'URL':
            judge = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/.test(this.value);
            break;
        default:
            judge = this.validate(this.value);
            break;
      }
      if(this.required&&this.insideValue=='') {
        judge = false;
      }
      if(judge) {
        this.inTable?this.styleObj['table-error']=false:this.styleObj.error=false;
      } else {
        this.inTable?this.styleObj['table-error']=true:this.styleObj.error=true;
      }
    },
    changeEditState(state) {
      if(!this.inTable || this.disabled) return;
      this.edit = state;
    }
  },
  watch: {
    insideValue(val) {
      this.$emit("input", val);
    },
    value: {
      handler() {
        this.insideValue = this.value;
      }
    }
  },
  created() {
    this.insideValue = this.value;
  },
  mounted() {
    try {
      if(this.$refs.defineInput.parentNode.parentNode.nodeName == 'TD') {
        this.inTable = true;
        this.edit = false;
        if(this.disabled) {
          this.inTableStateContrl = false;
        }
      }
    } catch (error) {
      console.log("当前组件不存在上两级节点");
    }
  }
};
</script>

<style lang="scss" scoped>
.text-input-container {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  min-width: 298px;
  height: 40px;
  max-height: 40px;
  border-radius: 4px;
  box-sizing: border-box;
  margin: 0 0.0521rem;
  .iconwenbenkuangshanchu {
    display: none;
  }
  .label {
    min-width: 55px;
    padding: 0 10px;
    color: #909399;
    overflow: hidden;
    flex-shrink: 0;
  }
  .required {
    color: red;
  }
  .input {
    width: auto;
    padding: 0 5px 1px 0;
    flex-grow: 1;
    height: 100%;
    font-size: 16px;
    outline-style: none;
    border-radius: 4px;
    border: 0px;
    background-color: transparent;
  }
  input::-webkit-input-placeholder {
    color: #C0C4CC;
  }
  .icon {
    padding: 0 10px;
  }
}
.border {
  border: 1px solid #DCDFE6;
}
.error {
  border: 1px solid red;
}
.table-error {
  .input {
    color: red;
  }
}
.disabled {
  background:rgba(248,249,251,1);
  border:1px solid rgba(220,223,230,1);
  .input {
    color:rgba(192,196,204,1);
  }
}
.text-input-container:hover {
  .iconwenbenkuangshanchu {
    display: inline-block;
  }
}
</style>