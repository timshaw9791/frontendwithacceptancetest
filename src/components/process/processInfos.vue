<template>
  <div class="process-infos-container">
    <div class="title">审批流程</div>
    <div class="process-infos-body" :style="'height:'+fixHeight">
      <div class="info" v-for="(item, i) in processList" :key="i">
        <div>{{ item.name }}</div>
        <div>{{ item.assigneeName }}</div> 
        <div>{{ item.state }}</div>
        <div class="reson"><span v-show="item.state=='驳回'" @click="lookReson(item.note)">[查看驳回原因]</span></div>
        <div>操作时间</div>
        <div>{{ item.time }}</div>
      </div>
    </div>
    <service-dialog title="驳回" ref="ratify" confirmInfo="确定" @confirm="$refs.ratify.hide()" :secondary="false">
      <center>
        <text-input label="驳回原因" v-model="reson" width="100%" :disabled="true"></text-input>
      </center>
    </service-dialog>
  </div>
</template>

<script>
import serviceDialog from "components/base/serviceDialog"
import textInput from '@/componentized/textBox/textInput'
export default {
  name: 'processInfos',
  data() {
    return {
      processList: [],
      reson: ""
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return [{
          type: '审核',
          person: 'SprWu',
          state: '通过',
          reson: true,
          time: '2020/3/27'
        },{
          type: '审核',
          person: 'SprWu',
          state: '通过',
          reson: true,
          time: '2020/3/27'
        },{
          type: '审核',
          person: 'SprWu',
          state: '通过',
          reson: true,
          time: '2020/3/27'
        }]
      }
    },
    height: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    fixHeight() {
      if(isNaN(this.height)) {
        return this.height;
      } else {
        return this.height-37+'px';
      }
    }
  },
  watch: {
    list: {
      handler() {
        this.fixList();
      },
      deep: true
    }
  },
  methods: {
    fixList() {
      this.processList = this.list.map((obj, i) => {
        let state = "", note = "";
        switch (obj.taskVariables.pass) {
          case undefined:
            state = "";
            break;
          case true:
            state = "通过";
          case false:
            state = "驳回";
            note = obj.taskVariables.note;
          default:
            break;
        }
        return {
          name: obj.name,
          assigneeName: obj.assigneeName,
          state: obj.name.includes('用户申请')?"通过":state,
          note,
          time: this.$filterTime(obj.endTime)
        };
      })
    },
    lookReson(note) {
      this.reson = note;
      this.$refs.ratify.show();
    }
  },
  components: {
    serviceDialog,
    textInput
  }
}
</script>

<style lang="scss" scoped>
  .process-infos-container {
    font-size: 16px;
  }
  .title {
    color: #3F5FE0;
    padding-bottom: 19px;
  }
  .process-infos-body {
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(144, 147, 153, 0.1);
      border-radius: 20px;
    }
  }
  .info {
    display: grid;
    grid-template-columns: 10% 40% 10% 10% 10% 20%;
    line-height: 30px;
    padding: 10px 0;
    border-top: 1px solid rgba(112,112,112,0.13);

    .reson {
      color: #3F5FE0;
      cursor: pointer;
    }

  }
</style>