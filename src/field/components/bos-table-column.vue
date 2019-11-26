<template>
  <el-table-column :label="lable" :align="align" :width="cWidth" :min-width="'0.3125rem'" :sortable="sort">
    <template slot-scope="scope">
      {{getResult(scope.row,field)}}
    </template>
  </el-table-column>
</template>


<script>
    import {initmixinBosInput} from '../common/mixinBosInput';
  export default {
    data(){
      return {
        search:'',
        basePx: localStorage.getItem('fontSize')
      }
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
      lable:{
        type: String,
        default:null
      },
      align:{
        type: String,
        default:"left"
      },
      width:{
        type: [Number, String],
      },
      sort:{
          type:[Boolean,String],
          default:false
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
        if(!field)throw new Error('field no set');
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

