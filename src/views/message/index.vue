<template>
  <div class="message">
    <div class="msgContents">
      <div>
        <my-header title="消息通知" 
                   ></my-header>
        <div class="top">
          <!-- <tb-select
            :options="options"
            indexDefault="全部"
            style="margin-left: 1vw; min-width: 100px"
            @selected="selected"
          ></tb-select> -->
          <div style="width:200px;cursor: pointer;margin-left:15px">
          <el-input v-model="msgTitle" placeholder="消息标题"></el-input>
          </div>
          <!-- <span class="msgReaded">
            标记为已读
          </span>
          <span class="msgRead">
            标记为未读
          </span> -->
        </div>
        <div class="message_box">
            <el-table :data="list"  highlight-current-row height="3.55rem" align="center">
                        <bos-table-column lable="消息状态" field="status"></bos-table-column>
                        <bos-table-column lable="通知时间" field="createTime" :filter="(row)=>$filterTime(parseInt(row.createTime))"></bos-table-column>
                        <bos-table-column lable="消息标题" field="titleDesc" algin="center"></bos-table-column>
                        <el-table-column label="消息内容" align="center"  min-width="'3.75rem'" fit >
                        <template slot-scope="scope">
                            <div >
                            {{flexContent(scope.row.content)}}
                            <span @click="moreContent(scope.row.content,scope.row.id)" v-if="viewFlag" style="cursor: pointer;">[详]</span>
                           </div>
                        </template>
                        </el-table-column>
                    </el-table>
         <servicedialog title="详情" ref="dialog1" :button="false" :ismore="true" :secondary="false" width="500">
            <div>
                {{this.moreCont}}
            </div>
        </servicedialog>
        </div>
        <div>
            <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "gql/msg.gql";
import servicedialog from 'components/base/serviceDialog'
import { readMsg, getMsgList, getMsgListWithType } from "api/message";
import { formRulesMixin } from "field/common/mixinComponent";
import tabs from "components/base/tabs/index";
import { transformMixin } from "common/js/transformMixin";
import tbSelect from "components/base/tabs-select";
import myHeader from 'components/base/header/header'

export default {
  data() {
    return {
      list: [],
      userId: JSON.parse(localStorage.getItem("user")).id,
      paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
      selectedVal: "全部",
      isSelect: false, // 判断是否是选择变动，如是则禁止scroll获取数据
      getScrollDate: true, // 如果返回值为空，则滚动不再发起请求
      loading: false,
      content: null,
      contentTrue: null,
      inquire: "",
      moreCont:"",
      oldScrollTop: "",
      viewFlag:false,
      searchTitle:'',
      msgTitle:'',
      options: [
        { label: "全部", value: "全部" },
        { label: "报废", value: "EQUIP_SCRAP_MESSAGE" },
        { label: "充电", value: "CHARGE_REMIND" },
        { label: "保养", value: "MAINTAIN_REMIND" },
        { label: "未归还", value: "LONG_TIME_NOT_RETURN" },
        { label: "过保", value: "PERIOD_EXCEED_SHELF_LIFE" },
        { label: "标准库存", value: "SAFE_SOCK_REMIND" }
      ],
    };
  },
  mixins: [formRulesMixin, transformMixin],
  components: {
    tabs,
    tbSelect,
    myHeader,
    servicedialog
  },

  computed: {
    isOpened() {
      return this.$store.state.socket.message;
    }
  },
//   filters: {
//     ellipsis (value) {
//       if (!value) return ''
//       if (value.length > 2) {         
//         return value.slice(0,2) 
//       }
//       return value
//     }
    
//     },
created(){
  this.getList()
},
  methods: {
    getList() {
        // console.log(state);
      let data = {
        id: JSON.parse(localStorage.getItem("user")).id,
        page: this.paginator.page,
        size:this.paginator.size,
        title:this.searchTitle
      };
      console.log("data.title");
      console.log(data.title);
      if(data.title=="")
      {
          delete data.title
      }
      getMsgList(data).then(res => {
        this.paginator.totalPages = res.totalPages
        this.paginator.totalElements = res.totalElements  
        this.loading = false
        let result = JSON.parse(JSON.stringify(res.content))
        this.list=result
        // // if(state) {
        // //   this.list = result;
        // // } else {
        //   this.list.push(result)
        // // }
        this.list.forEach(item=>{
            if(item.status=='false')
            {
                item.status='未读'
            }else{
                item.status='已读'
            }
        })
      });
    },
    moreContent(data,id){
        console.log("id");
        console.log(id);
    this.moreCont=data,
    this.$refs.dialog1.show();
    this.read(id)
    },
    changePage(data) {
                this.paginator.page = data;
                this.getList()
            },
    flexContent(value){
  
    if (!value) return ''
      if (value.length > 12) {   
          this.viewFlag=true      
        return value.slice(0,12)+'...' 
      }
      return value
    },
    getListWithType(type, state) {
      let data = {
        userId: JSON.parse(localStorage.getItem('user')).id,
        type: type,
        page: this.page
      }
      getMsgListWithType(data).then(res => {
        this.loading = false
        let result = JSON.parse(JSON.stringify(res.content))
        if(state) {
          this.list = result
        } else {
          this.list.push(result)
        }
      })
    },

    // scrollGet() {
    //   if(this.isSelect) {
    //     this.isSelect = false
    //     return
    //   }
    //   this.loading = true
    //   this.page++
    //   if(this.selectedVal == "全部") {
    //     this.getList(false)
    //   } else {
    //     this.getList(this.selectedVal, false)
    //   }
    // },


    read(id) {
    //   this.oldScrollTop = this.$refs.ulList.scrollTop;
      readMsg({
          ids:id
      }).then(res => {
        // this.getList(false)
      });
    },
    ulClick(data, index) {
      if (!data.readed) {
        this.read(data);
      }
      this.content = data;
      this.contentTrue = index;
    },
    conversion(data) {
      if (data) {
        return "已读";
      } else {
        return "未读";
      }
    },
    selected(data) {
        console.log(data);
      this.isSelect = true
      this.page = 1
      if(data=='全部')
      {
          this.searchTitle=''
          console.log("111111");
      this.getList()
      }else{
      this.searchTitle=data
      this.getList()
      }
      
      // this.getScrollDate = true
     
    },
    fontNumber(date) {
      const length = date.length;
      if (length > 12) {
        var str = "";
        str = date.substring(0, 12) + "......";
        return str;
      } else {
        return date;
      }
    }
  },
  watch: {
    isOpened(newer, older) {
      if (newer) {
        this.getList(true);
      }
    },
    msgTitle(newVal){
      this.searchTitle=newVal;
      this.getList()
    }

  }
};
</script>

<style lang="scss" scoped>
.message {
  // margin-left: 100px;
  font-size: 16px;
}

.msgContents {
  display: flex;
  height: 85vh;
  .top {
    display: flex;
    align-items: center;
    padding: 0.0833rem 0;
    text-align: center;
    border-bottom: 1px solid rgb(228, 231, 237);
  }
  .message_box{
    margin-left: 0.9375rem;
    // border:1px solid red;
      margin:0 auto;
      width: 8rem;
      height: 3.5rem;
    //   border: 1px solid red
  }
  .left-tab {
    border-right: 2px solid rgb(228, 231, 237);
    padding-right: 1%;
    div {
      height: 36px;
      margin-bottom: 15px;
      cursor: pointer;
      line-height: 36px;
      margin-right: 2%;
      width: 6vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    div:hover {
      background: rgb(47, 47, 118);
      color: white;
      border-radius: 20px;
    }
    .visited {
      background: rgb(47, 47, 118);
      color: white;
      border-radius: 20px;
    }
  }
  .msgBottom {
    width: 100%;
    border-bottom: white;
    position: absolute;
    bottom: 0;
    min-width: 23vw;
    font-size: 14px;
    color: rgba(185, 185, 185, 1);
    margin-left: 16px;
    background: white;
  }

  .tip {
      width: 100%;
      height: 25px;
      text-align: center;
      line-height: 25px;
      background-color: rgba(204, 204, 204, 0.2)
  }
  .ulList {
    min-width: 23vw;
    max-width: 23vw;
    height: 72vh;
    overflow-y: scroll;
    position: relative;
    .megDiv {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 16px;
      line-height: 20px;
      cursor: pointer;
      span {
        display: inline;
        float: right; // flex-direction: row-reverse;
        color: rgb(195, 195, 195); // margin-top: 10px;
      }
    }

    div:hover {
      color: #409eff;
    }
    .divColor {
      color: #409eff;
      background: rgb(249, 249, 249);
    }
    .i {
      background: #f00;
      border-radius: 50%;
      width: 5px;
      height: 5px;
      left: 5px;
      margin-top: -15px;
      position: absolute;
    }
  }
  .ulList::-webkit-scrollbar {
    width: 4px;
    height: 10px;
  }
  .ulList::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(228, 231, 237, 0.1);
  }
  .ulList::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(#2f2f76, 0.37);
  }
  .contents {
    margin: 0 3% 0 0;
    width: 100%;
    .title {
      border-bottom: 1px solid rgb(228, 231, 237);
      color: rgba(112, 112, 112, 1);
      h2 {
        margin-left: 28px;
      }
      h4 {
        letter-spacing: 2px;
        text-align: right;
      }
    }
    .msgText {
      padding: 40px 0 0 28px;
    }
  }
  .msgReaded{
    margin-left:15px;
    width:112px;
    height:40px;
    background:rgba(47,47,118,1);
    opacity:1;
    border-radius:4px;
  }
  .msgRead{
    margin-left:15px;
    width:112px;
    height:40px;
    background:rgba(47,47,118,1);
    opacity:1;
    border-radius:4px;
  }
  .mes {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 120px;
      height: 120px;
    }
    div {
      margin-top: 5vh;
      font-size: 18px;
      color: rgb(195, 195, 195);
    }
  }
}
</style>