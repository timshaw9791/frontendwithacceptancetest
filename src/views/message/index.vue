<template>
  <div class="message">
    <div class="msgContents">
      <div>
        <div class="top">
          <tb-select
            :options="options"
            indexDefault="全部"
            style="margin-left: 1vw; min-width: 100px"
            @selected="selected"
          ></tb-select>

          <div class="_buttonsLeft" style="margin-left: 1vw">
            <!--<BosInput-->
            <!--placeholder="装备/序号/编号/AB面"-->
            <!--suffix="el-icon-search"-->
            <!--v-model="inquire"-->
            <!--:wrapforlike="true"-->
            <!--style=" width:13vw;">-->
            <!--</BosInput>-->
          </div>
        </div>
        <div class="ulList" ref="ulList" :v-loading="true" v-infinite-scroll="getnextPagemessage" infinite-scroll-distance="1">
          <div
            v-for="(item,index) in list"
            :key="index"
            @click="ulClick(item,index)"
            class="megDiv"
          >
            <!-- {{item.title}} -->
            {{fontNumber(item.title)}}
            <div class="i" v-show="!item.readed"></div>
            <span>{{$filterTime(item.time)}} {{conversion(item.readed)}}</span>
          </div>
        </div>
        <div class="msgBottom">消息只保存三个月，请及时查看</div>
      </div>

      <transition name="el-fade-in-linear">
        <div class="contents" v-if="content">
          <div class="title">
            <h2>{{content.title}}</h2>
            <h4>推送时间 : {{$filterTime(content.time)}}</h4>
          </div>
          <div v-html="content.content" class="msgText"></div>
        </div>
        <div class="mes" v-if="!content">
          <img src="@/common/images/消息空白.png" />
          <div>我是消息盒子,主人需要看点什么吗?</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import api from "gql/msg.gql";
import { readMsg, getMsgList, getMsgListWithType } from "api/message";
import { formRulesMixin } from "field/common/mixinComponent";
import tabs from "components/base/tabs/index";
import { transformMixin } from "common/js/transformMixin";
import tbSelect from "components/base/tabs-select";

export default {
  data() {
    return {
      list: [],
      page:1,
      totalElements:0,
      maxpage:0,
      userId: JSON.parse(localStorage.getItem("user")).id,
      content: null,
      contentTrue: null,
      inquire: "",
      oldScrollTop: "",
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
    tbSelect
  },

  computed: {
    isOpened() {
      return this.$store.state.socket.message;
    }
  },
  created:{
    page:1
  },
  methods: {
    getList() {
      let data = {
        userId: JSON.parse(localStorage.getItem("user")).id,
        page:this.page,
      };
      this.page++;
      getMsgList(data).then(res => {
        this.list = JSON.parse(JSON.stringify(res.content));
        this.totalElements = res.totalElements
        this.maxpage = res.totalPages
        if (this.oldScrollTop) {
          this.$nextTick(() => {
            this.$refs.ulList.scrollTop = this.oldScrollTop;
          });
        }
      });
    },

    getnextPagemessage(){
      let data = {
        userId: JSON.parse(localStorage.getItem("user")).id,
        page:this.page,
      };
      if(this.page<=this.maxpage){
        this.page++;
        getMsgList(data).then(res => {
          let a = JSON.parse(JSON.stringify(res.content))
          for(let index=0;a[index];index++){
            this.list.push(a[index])
          }
        });
      }
    },
    read(data) {
      this.oldScrollTop = this.$refs.ulList.scrollTop;
      readMsg(data.id).then(res => {
        data.readed = true;
      });
      // this.gqlMutate(api.houseUser_readMessage,
      //     {
      //         messageId: data.id
      //     }, (res) => {
      //         // 重新拉取消息数据，会刷新列表
      //         // this.list = [];
      //         // this.getList();
      //         // 只改变当前消息，不会刷新列表
      //         data.readed = true
      //     });
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
      if (data === "全部") {
        this.getList()
      } else {
        this.getListWithType(data)
      }
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
        this.getList();
      }
    }

    // 'this.$store.state.socket.message': {
    //     handler(newer, older) {
    //         console.log(newer);
    //         console.log(older);
    //         if (newer) {
    //             this.qfilter = {
    //                 combinator: 'AND',
    //                 key: "userId",
    //                 operator: 'LIKE',
    //                 value: this.userId,
    //             };
    //             this.getList();
    //         }
    //     },
    //     deep: true // 开启深度监听
    // }
  }
};
</script>

<style lang="scss" scoped>
.message {
  font-size: 16px;
}

.msgContents {
  display: flex;
  height: 82vh;
  .top {
    display: flex;
    align-items: center;
    padding: 0.0833rem 0;
    border-bottom: 1px solid rgb(228, 231, 237);
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