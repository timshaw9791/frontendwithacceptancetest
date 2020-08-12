/**
 * Created by Administrator on 2018/7/17.
 */
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import {formRulesMixin, extendRules} from './common/mixinComponent';

import {_upload} from './common/upload';

import FormContainer from './components/form-container.vue';
import FieldInput from './components/field-input.vue';
import FieldCheckbox from './components/field-checkbox.vue';
import FieldRadio from './components/field-radio.vue';
import FieldSelect from './components/field-select.vue';
import FieldDatePicker from './components/field-date-picker.vue';
import FieldImage from './components/field-image.vue';
import FieldRichText from './components/field-rich-text';
import FieldDialog from './components/field-dialog.vue';
import FieldTree from './components/field-tree.vue';
import FieldTable from './components/field-table.vue'
import FieldCascader from './components/field-cascader'
import FieldInputQuery from './components/field-input-query'
import TeachTableColumn from './components/teach-table-column.vue';

import BosPaginator from './components/bos-paginator';
import BosTableColumn from './components/bos-table-column.vue';
import BosInput from './components/bos-input'

import FieldEntity from './components/field-entity.vue';

import defineTable from '@/componentized/table/defineTable.vue'
import defineColumn from '@/componentized/table/defineColumn.vue'
import hoverImg from '@/componentized/hoverImg.vue'
// import defineInput from '@/componentized/textBox/defineInput.vue'
// import baseButton from '@/componentized/buttonBox/baseButton.vue'
// import baseSelect from '@/componentized/textBox/baseSelect.vue'
import divTmp from '@/componentized/divTmp'
import defineForm from '@/componentized/form/defineForm'
import textInput from '@/componentized/textBox/textInput'
// import dateSelect from '@/componentized/textBox/dateSelect'
import numberInput from '@/componentized/textBox/numberInput'
import entityInput from '@/componentized/entity/entityInput'
import dateInput from '@/componentized/textBox/dateInput'
import radio from '@/componentized/radio'
import checkbox from '@/componentized/checkbox'
import checkboxGroup from '@/componentized/checkboxGroup'
import viewContainer from '@/componentized/viewContainer/viewContainer'
import toolBar from "../componentized/viewContainer/toolBar";

let componentsList = {
    'FormContainer': FormContainer,
    'FieldInput': FieldInput,
    'FieldCheckbox': FieldCheckbox,
    'FieldRadio': FieldRadio,
    'FieldSelect': FieldSelect,
    'FieldDatePicker': FieldDatePicker,
    'FieldImage': FieldImage,
    'FieldRichText': FieldRichText,
    'BosPaginator': BosPaginator,
    'BosTableColumn': BosTableColumn,
    'FieldDialog': FieldDialog,
    'FieldEntity': FieldEntity,
    'FieldTree': FieldTree,
    'FieldTable': FieldTable,
    'FieldCascader': FieldCascader,
    'BosInput': BosInput,
    'FieldInputQuery': FieldInputQuery,
    'TeachTableColumn':TeachTableColumn,
    defineTable,
    defineColumn,
    hoverImg,
    // defineInput,
    // baseButton,
    // baseSelect,
    divTmp,
    defineForm,
    textInput,
    // dateSelect,
    numberInput,
    entityInput,
    dateInput,
    radio,
    checkbox,
    checkboxGroup,
    viewContainer,
    toolBar
};


export default {
    install(Vue) {
        // Vue.use(ElementUI);
        // Vue.mixin(formRulesMixin);
        Object.keys(componentsList).map((name) => {
            Vue.component(name, componentsList[name]);
        });
    },
    // mixin: formRulesMixin,
    extend: extendRules,
    upload: _upload
}




