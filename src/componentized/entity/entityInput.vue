<template>
  <div class="entity-input-container" ref="entityInput" :style="'width:'+fixWidth+';margin:'+margin" 
              :class="{'disabled':disabled&&inTableStateContrl,'border':(tableEdit&&edit)}" 
              @click="changeEditState(true)" @mouseleave="changeEditState(false)">
     <div class="label" v-if="!inTable">{{ label }}
      <span class="required" v-if="required">*</span>
    </div>
    <input type="text" class="input" :disabled="disabled" v-model="insideValue"
      readonly :placeholder="placeholder" @keydown.13="changeEditState(false)"/>
    <div class="icon">
      <i class="iconfont iconwenbenkuangshanchu" @click="clear" v-show="insideValue&&!disabled&&tableEdit&&edit"></i>
      <i class="iconfont iconsousuo" @click="showSearch" v-show="search&&!disabled&&tableEdit&&edit"></i>
      <i class="iconfont iconxiang" @click="showDetail" v-show="detail&&!disabled&&tableEdit&&edit"></i>
    </div>
    <service-dialog title="申请人员选择" ref="applicant" :button="false" :secondary="false">
      <applicant-select @select="selected" @cancel="$refs.applicant.hide()"></applicant-select>
    </service-dialog>
    <service-dialog title="位置信息选择" ref="locationSelect" :button="false" :secondary="false">
      <equip-location-select @select="selected" @cancel="$refs.locationSelect.hide()"></equip-location-select>
    </service-dialog>
    <service-dialog title="装备参数选择" ref="equipArgsSelect" width="1300px" :button="false" :secondary="false">
      <equip-args-select @select="selected" @cancel="$refs.equipArgsSelect.hide()"></equip-args-select>
    </service-dialog>
    <service-dialog title="机构选择" ref="organUnits" width="500px" :button="false" :secondary="false">
      <organ-units @select="selected" @cancel="$refs.organUnits.hide()"></organ-units>
    </service-dialog>
    <service-dialog title="供应商选择" ref="supplierSelect" width="500px" :button="false" :secondary="false">
      <supplier-select @select="selected" @cancel="$refs.supplierSelect.hide()"></supplier-select>
    </service-dialog>

  </div>
</template>

<script>
import serviceDialog from "components/base/serviceDialog"
import applicantSelect from "./select/applicantSelect"
import equipArgsSelect from './select/equipArgsSelect'
import equipLocationSelect from './select/equipLocationSelect'
import organUnits from './select/organUnits'
import supplierSelect from "./select/supplierSelect";
export default {
    name: 'textInput',
    data() {
      return {
          inputPrePt: null,
          insideValue: "",
          inTable: false, // 是否为表格内联
          inTableStateContrl: true,
          edit: true, // 内部是否可编辑
          search: false, // 是否显示搜索图标
          detail: false, // 是否显示详情图标
      }
    },
    props: {
        label: {
            type: String,
            default: ""
        },
        value: {
            type: [String, Number, Object],
            default: ""
        },
        column: {
            type: Number,
            default: 3
        },
        height: {
            type: Number,
            default: 40
        },
        disabled: {
            type: Boolean,
            default: false
        },
        tableEdit: { // 是否为表格编辑状态
          type: Boolean,
          default: true
        },
        required: { // 是否必填
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [Number, String],
            default: ""
        },
        options: {
          type: Object,
          default() {
            return {
              search: 'applicant'
            }
          }
        },
        format: {
          type: String,
          default: '[{policeSign}]{name}'
        },
        margin: {
          type: String,
          default: '0 0.0521rem'
        }
    },
    methods: {
        changePreStyle(state=true) {
            this.inputPrePt.style.background = state?'#f5f7fa':'white';
            this.inputPrePt.style.cursor = state?'not-allowed':'auto';
        },
        showSearch() {
          this.$refs[this.options.search].show();
        },
        showDetail() {
          this.$refs[this.options.detail].show();
        },
        selected(data) { // 联系组件完成
          this.fixValue(data.data);
          this.$refs[data.ref].hide();
        },
        fixValue(data) { // 整理显示的值 可接收函数(未)
          if(JSON.stringify(data) == '{}' || data.id == '') {
            this.insideValue = "";
            return;
          }
          this.insideValue = this.format.replace(/{([a-zA-Z]+)}/g, (r, k) => data[k]);
          this.$emit('input', data);
        },
        clear() { // 清空
          this.insideValue = "";
          this.$emit('input', "");
          this.$emit('clear');
        },
        changeEditState(state) {
          if(!this.inTable) return;
          this.edit = state
        }
    },
    computed: {
      fixWidth() {
        return this.inTable?`calc(100% - 0.1042rem)`:`calc(${8.33*this.column}% - 0.1042rem)`;
      }  
    },
    watch: {
        disabled: {
            handler(val) {
                this.changePreStyle(val);
            },
        },
        value: {
          handler(val) {
            if(typeof this.value == 'object') {
              this.fixValue(this.value);
            } else {
              this.insideValue = this.value
            }
          },
          deep: true
        }
    },
    components: {
      serviceDialog,
      applicantSelect,
      equipArgsSelect,
      organUnits,
      equipLocationSelect,
      supplierSelect
    },
    created() {
      if(typeof this.value == 'object') {
        this.fixValue(this.value);
      } else {
        this.insideValue = this.value
      }
    },
    mounted() {
        this.inputPrePt = document.querySelector('.el-input-group__prepend');
        Object.keys(this.options).forEach(item => {
          this[item] = true
        })
        try {
          if(this.$refs.entityInput.parentNode.parentNode.nodeName == 'TD') {
            this.inTable = true;
            this.edit = false;
            if(this.disabled) {
              this.inTableStateContrl = false;
            }
          }
        } catch (error) {
          
        }
    }
}
</script>

<style lang="scss" scoped> 
  .entity-input-container {
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
    min-width: 32px;
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
.entity-input-container:hover {
  .iconwenbenkuangshanchu {
    display: inline-block;
  }
}
</style>