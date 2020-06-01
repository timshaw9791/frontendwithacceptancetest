<template>
  <div class="define-input-container" ref="defineInput" :style="`width:${fixWidth};float:${align};margin:${margin}`"
      :class="[styleObj,{'disabled':disabled&&inTableStateContrl,'border':(tableEdit&&edit)}]" @click="changeEditState(true)">
    <div class="label" v-if="!inTable&&haveLabel">
      <i :class="`iconfont ${iconfont}`" v-if="iconfont"></i>
      <span v-else>{{ label }}</span>
      <span class="required" v-if="required">*</span>
    </div>
    <input :type="insidePattern" class="input" :disabled="disabled" v-model="insideValue" 
      :maxlength="maxlength" @change="reg" :readonly="!(tableEdit&&edit)" :placeholder="placeholder"
      @blur="changeEditState(false)" @keydown.13="changeEditState(false)"/>
      <div class="icon" v-show="insideValue!=''&&clearable&&!disabled&&tableEdit&&edit">
        <i class="iconfont iconwenhao" @click="trigglePattern" v-if="pattern=='password'"></i>
        <i class="iconfont iconwenbenkuangshanchu" @click="clear"></i>
      </div>
  </div>
</template>

<script>
import { judgeRules } from "../rules"
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
        'table-error': false
      },
      insidePattern: 'text' , // 内部pattern状态
    };
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    iconfont: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ""
    },
    column: {
      type: Number,
      default: 3
    },
    align: {
      type: String,
      default: 'none'
    },
    margin: {
      type: String,
      default: '0 0.0521rem'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      default: 'text',
      validator: function(value) {
        return ['text', 'password'].includes(value);
      }
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
    placeholder: {
      type: [Number, String],
      default: ""
    },
    haveLabel: {
      type: Boolean,
      default: true
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
      if(judgeRules(this.required, this.type, this.value, this.validate)) {
        this.inTable?this.styleObj['table-error']=false:this.styleObj.error=false;
        return true;
      } 
      this.inTable?this.styleObj['table-error']=true:this.styleObj.error=true;
      return false;   
    },
    changeEditState(state) {
      if(!this.inTable || this.disabled) return;
      this.edit = state;
    },
    trigglePattern() { // 在输入框为密码框类型时，用以切换值是否可见
      this.insidePattern = this.insidePattern=='text'?'password':'text';
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
    this.insidePattern = this.pattern;
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
.define-input-container {
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
  .iconfont {
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
    width: 100%;
    padding: 0 5px 1px 0;
    // flex-grow: 1;
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
    min-width: 35px;
    overflow: hidden;
    display: inline-flex;
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
.define-input-container:hover {
  .iconfont {
    display: inline-block;
  }
}
</style>