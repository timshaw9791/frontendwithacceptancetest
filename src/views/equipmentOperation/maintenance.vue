<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span class="_card-title">{{$route.meta.title}}</span>
      </div>
      <div>
        <tabs :list="tabsList" :indexDefault="0" @selected="selected">
          <el-button type="text" class="_textBt" @click="maintenanceShow" v-if="show">
            <svg-icon icon-class="批量" />批量保养
          </el-button>
          <el-button type="text" class="_textBt" @click="batch=!batch" v-else>
            <svg-icon icon-class="批量" />
           <span v-if="!batch">批量入库</span>
           <span v-else>取消入库</span>
          </el-button>
          <div class="_buttons">
            <BosInput
              v-if="type==='需要保养'"
              placeholder="rfid"
              suffix="el-icon-search"
              v-model="inquire"
              :wrapforlike="true"
              style=" width:285px;"
            ></BosInput>
          </div>
        </tabs>
        <div v-if="show">
          <el-table :data="list" fit highlight-current-row>
            <!-- <el-table-column
                                type="selection"
                                v-if="batch"
                                width="55">
            </el-table-column>-->
            <bos-table-column lable="RFID" field="equip.rfid"></bos-table-column>
            <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
            <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
            <bos-table-column
              lable="架体AB面"
              :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"
            ></bos-table-column>

            <bos-table-column lable="保养周期/天" :filter="(row)=>milliToDay(row.upkeepCycle)"></bos-table-column>

            <bos-table-column lable="上次保养时间" :filter="(row)=>formatTime(row.lastUpkeepTime)"></bos-table-column>

            <bos-table-column
              lable="保养倒计时"
              :filter="(row)=>countdown(row.lastUpkeepTime,row.upkeepCycle)"
            ></bos-table-column>

            <!-- <el-table-column label="操作" align="center" width="200">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="single(scope.row)"
                                           v-if="scope.row.equip.state==='IN_HOUSE'">保 养
                                </el-button>
                            </template>
            </el-table-column>-->
          </el-table>

          <!-- <div class="_contentBt" v-if="batch">
                        <el-button @click="cancel(false)">取 消</el-button>
                        <el-button type="primary" @click="submit">提 交</el-button>
          </div>-->

          <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage" />

          <serviceDialog title="确认保养装备清单" ref="maintenanceDialog" @confirm="submit" width="1040px">
            <el-table :data="maintenance.list" height="500" fit class="list">
              <el-table-column label="序号" width="60" align="center">
                <template scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <bos-table-column lable="RFID" field="equip.rfid"></bos-table-column>
              <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
              <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
              <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
              <bos-table-column
                lable="架体AB面"
                :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"
              ></bos-table-column>
              <el-table-column label width="60" align="center">
                <template scope="scope">
                  <img
                    :src="haveImg"
                    title="点击取消保养该装备"
                    width="16px"
                    height="13px"
                    @click="cancelMaintenance(scope.row)"
                    v-show="scope.row.rfidConfirm == 1"
                  />
                  <img :src="noneImg" width="3px" height="17px" v-show="scope.row.rfidConfirm == 0" />
                </template>
              </el-table-column>
            </el-table>
            <div class="bottom-tip">
              <img :src="haveImg" width="16px" height="13px" /> &nbsp;为确定保养装备，
              <img :src="noneImg" width="3px" height="17px" /> &nbsp;为取消保养装备
            </div>
          </serviceDialog>

          <serviceDialog title="提示" ref="dialogButton" :secondary="false" @confirm="dialogConfim">
            <div class="_dialogDiv">您确定要取消保养该装备吗？</div>
          </serviceDialog>
        </div>

        <right :batch="batch" @cancel="cancel" v-if="!show"></right>
       
      </div>
    </el-card>
  </div>
</template>

<script>
import tabs from "components/base/tabs/index";

import right from "./rightMaintenance";

import { formRulesMixin } from "field/common/mixinAxios";
import serviceDialog from "components/base/serviceDialog";
import api from "gql/operation.gql";
import { transformMixin } from "common/js/transformMixin";
import { getNeedUpkeep } from "api/needs";

export default {
  data() {
    return {
      tabsList: ["需要保养", "正在保养"],
      type: "",
      inquire: "",
      batch: false, // 是否显示多选框(正在保养)
      show: true,
      title: "",
      equipList: [],
      param: {
        property: "lastUpkeepTime",
        direction: "ASC"
      },
      list: [], // 界面装备数据
      haveImg: require("@/assets/have.png"),
      noneImg: require("@/assets/none.png"),
      rfidList: [], // 扫描时，记录rfid
      maintenance: {
        list: [],
        cancelZb: {} // 取消保养的装备
      } // 批量保养列表
    };
  },
  mixins: [formRulesMixin, transformMixin],

  methods: {
    selected(data) {
      console.log(data);
      this.type = data;
      if (data === "需要保养") {
        // this.title = '批量保养';
        this.show = true;
        this.getList();
      } else if (data === "正在保养") {
        // this.title = '批量入库';
        this.show = false;
      }
      this.batch = false;
    },

    cancel(data) {
      this.batch = data;
    },

    async getList() {
      this.list = await this.getAxiosList(getNeedUpkeep);
      console.log(this.list);
    },
    /* 显示具体的保养列表 */
    maintenanceShow() {
      // this.$message.error("该装备不属于装备保养清单！")
      this.maintenance.list = this.list.map(item => {
        // return Object.assign(item, {rfidConfirm: -1}) // -1为初始 无显示， 1为勾， 0为感叹号
        this.$set(item, "rfidConfirm", -1); // 对返回对象进行响应式属性添加
        return item;
      });
      this.$refs.maintenanceDialog.show();
      setTimeout(() => {
        this.startRfid("19080011");
      }, 5000);
    },
    /* RFID读卡器数据 */
    startRfid(rfid) {
      this.maintenance.list.forEach(item => {
        if (item.equip.rfid.includes(rfid)) {
          item.rfidConfirm = 1;
          this.$message({
              message: "装备扫描成功！",
              type: 'success'
          })
        }
      });
    },
    /* 点击保养列表勾 */
    cancelMaintenance(item) {
      this.maintenance.cancelZb = item;
      this.$refs.dialogButton.show();
    },
    /* 确认取消保养该装备 */
    dialogConfim() {
      this.maintenance.cancelZb.rfidConfirm = 0;
      this.$refs.dialogButton.hide();
    },
    /* 确认保养 */
    submit() {
      if (0 in this.equipList) {
        this.gqlMutate(
          api.admin_upkeepEquips,
          {
            equipIdList: this.equipList
          },
          res => {
            this.$refs.dialogButton.hide();
            this.$message.success("正在保养了!");
            this.cancel(true);
            this.getList();
            this.equipList = [];
          }
        );
      } else {
        this.$message.error("未选择装备!");
      }
    },
    /* 多选框选中后 */
    // handleSelectionChange(val) {
    //     this.equipList = val.map((res) => {
    //         return res.equip.id
    //     });
    // },
    single(row) {
      this.$refs.dialogButton.show();
      this.equipList.push(row.equip.id);
    }
  },

  mounted() {
    if (this.$route.query) {
      this.inquire = this.$route.query.name;
    }
    this.getList();
  },

  watch: {
    inquire(newVal) {
      if (newVal) {
        this.$set(this.param, "rfid", newVal);
      }
    }
  },

  components: {
    tabs,
    right,
    serviceDialog
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  border: none !important;
}
.bottom-tip {
  margin-top: 10px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 20px;
  color: rgba(112, 112, 112, 1);
}
</style>

<style>
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  height: 20px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background: rgba(47, 47, 118, 0.37);
  border-radius: 22px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
}
</style>