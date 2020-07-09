<template>
  <el-table-column :label="label" :resizable="resizable" :align="align" :width="cWidth" :min-width="'0.3125rem'" :fixed="fixed" :sortable="sort" v-if="columnType=='none'">
    <template slot-scope="scope">
      <slot :data="scope">{{getResult(scope.row,field)}}</slot>
    </template>
    <slot name="merge"></slot>
  </el-table-column>
  <el-table-column :label="label" :fixed="fixed" :resizable="resizable" :type="columnType" :align="align" :width="cWidth" :min-width="'0.3125rem'" v-else></el-table-column>
</template>


<script>
  export default {
    name: 'defineColumn',
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
      },
      placeholder:{
        type:String,
        default:'--'
      }
    },
    computed:{
      cWidth(){
        return isNaN(this.width)?this.width:this.width+'px';
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
          if(!val)return this.placeholder;
        }
        return val;
      }
    }
  }
</script>

