<template>
  <el-table-column :label="lable" :align="align" :width="cWidth" :min-width="'60px'" :sortable="sort">
    <template slot-scope="scope">
      {{getResult(scope.row,field)}}
      <div v-for="item in videolist" @click="item=='暂无视频'||item=='暂无文档'?'':isvideo(item,scope.row)" :class="(item=='暂无视频'||item=='暂无文档')?classA:classB">
         <span >
         {{item}}
      </span>
      </div>
      
    </template>
  </el-table-column>
</template>


<script>
    import {initmixinBosInput} from '../common/mixinBosInput';
  export default {
    data(){
      return {
        videolist:[],
        classA:'box',
        classB:'doc',
        basePx: localStorage.getItem('fontSize')
      }
    },
    mixins: [initmixinBosInput],
    props: {
      title:{
        type: Object,
        default:null
      },
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
        default:"center"
      },
      width:{
        type: [Number, String],
      },
      sort:{
          type:[Boolean,String],
          default:false
      },
    },
    computed:{
      cWidth(){
        return this.transformNumber(this.width)
      }
    },
    methods:{
      isvideo(data,row){
        if(this.lable=='教学视频')
        {
      this.$emit('videoname',row)
      this.$emit('isvideo',data)
      this.$emit('title-box')
        }
      if(this.lable=='教学文档')
      {
      this.$emit('ispdf',data)
      }
      },
      getResult(row,field){
        if(this.filter) return this.filter(row);
        if(!field)throw new Error('field no set');
        field=field.split('.');
        let val=row;
      
        for(let i=0;i<field.length;i++){
        
          this.videolist=JSON.parse(JSON.stringify(val[field[i]]));
          // this.vidObj.name=
          // if(!val)return val;
        }
     
        for(var i=0;i<3;i++)
        {
          if(this.lable=="教学视频")
          {
           if(this.videolist[i]==undefined||this.videolist[i]=='')
          {
              this.videolist[i]='暂无视频'
          }else{

          }
          }
          if(this.lable=="教学文档")
          {
           if(this.videolist[i]==undefined||this.videolist[i]=='')
          {
              this.videolist[i]='暂无文档'
          }
          }
        }
     
       
      }
    }

  }
</script>
<style scoped>
  .box{
  display: inline-block;
  margin-left: 50px;
  width:100px;
  height:22px;
  font-size:14px;
  font-family:PingFang SC;
  font-weight:400;
  line-height:20px;
  color: black;
  opacity:1;
  text-align: center
  }
  .doc{
  display: inline-block;
  cursor: pointer;
  margin-left: 50px;
  width:100px;
  height:22px;
  font-size:14px;
  font-family:PingFang SC;
  font-weight:400;
  line-height:20px;
  color:rgba(63,95,224,1);
  opacity:1;
  text-align: center
  }
</style>

