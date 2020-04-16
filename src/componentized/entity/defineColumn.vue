<template>
  <el-table-column :label="label" :resizable="resizable" :align="align" :width="cWidth" :min-width="'0.3125rem'" :fixed="fixed" :sortable="sort" v-if="columnType=='none'">
    <template slot-scope="scope">
      <slot :data="scope">{{getResult(scope.row,field)}}</slot>
    </template>
  </el-table-column>
  <el-table-column :label="label" :fixed="fixed" :resizable="resizable" :type="columnType" :align="align" :width="cWidth" :min-width="'0.3125rem'" v-else></el-table-column>
</template>


<script>
    import {initmixinBosInput} from '../../field/common/mixinBosInput';
    import entityInput from './entityInput'
  export default {
    data(){
      return {
        search:'',
        basePx: localStorage.getItem('fontSize')
      }
    },
    components: {
      entityInput
    },
    mixins: [initmixinBosInput],
    props: {
      field:{
        type: String,
        default:null
      },
      filter:{
        type:Function,
        default:null
      },
      label:{
        type: String,
        default:null
      },
      align:{
        type: String,
        default:"center"
      },
      width:{
        type: [Number, String],
      },
      sort:{
          type:[Boolean,String],
          default:false
      },
      fixed: {
        type: [Boolean, String],
        default: false
      },
      columnType: {
        type: String,
        default: 'none'
      },
      resizable: {
        type: Boolean,
        default: false
      }
    },
    computed:{
      cWidth(){
        return this.transformNumber(this.width)
      }
    },
    methods:{
      getResult(row,field){
        if(this.filter) return this.filter(row);
        if(!field)  return;
        // throw new Error('field no set');
        field=field.split('.');
        let val=row;
        for(let i=0;i<field.length;i++){
          val=val[field[i]];
          if(!val)return val;
        }
        return val;
      }
    }
  }
</script>

