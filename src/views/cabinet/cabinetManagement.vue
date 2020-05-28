<template>
  <div class="opening-box">
    <my-header :title="edit?'警柜分配':'警柜管理'" :haveBlack="edit" @h_black="black"></my-header>
    <div class="btn_box" v-if="!edit">
      <base-button label="一键开柜" align="right" :width="128" :height="25" :fontSize="20"></base-button>
    </div>
    <div class="data-list" v-if="!edit">
      <bos-tabs :option="['contrast']" :layoutRatio="[4,3]" :contrastKey="['slot1', 'slot2']">
        <define-table
          :data="list"
          slot="slot1"
          height="4rem"
          @changeCurrent="selRow"
          :highLightCurrent="true"
          :havePage="false"
        >
          <define-column label="操作" width="150" v-slot="{ data }">
            <div class="span-box">
              <base-button label="分配" @click="toAssign(data.row)" size="small"></base-button>
              <base-button label="开柜" type="danger" @click="opCabniet(data.row)" size="small"></base-button>
            </div>
          </define-column>
          <define-column label="警柜类型" v-slot="{ data }">
            <define-input v-model="data.row.category" :tableEdit="false"></define-input>
          </define-column>
          <define-column label="警柜编号" v-slot="{ data }">
            <define-input v-model="data.row.cabinetNumber" type="Number" :tableEdit="false"></define-input>
          </define-column>
          <define-column label="所属人员" v-slot="{ data }">
            <define-input v-model="data.row.name" :tableEdit="false"></define-input>
          </define-column>
        </define-table>
        <define-table
          :haveIndex="false"
          slot="slot2"
          :havePage="false"
          :data="equipArg"
          height="4rem"
        >
          <define-column label="RFID" v-slot="{data}">
            <define-input v-model="data.row.rfid" :tableEdit="false"></define-input>
          </define-column>
          <define-column label="装备序号" v-slot="{data}">
            <define-input v-model="data.row.serial" :tableEdit="false"></define-input>
          </define-column>
          <define-column label="装备参数" v-slot="{data}">
            <entity-input
              v-model="data.row.equipArg"
              format="{name}({model})"
              :tableEdit="false"
              :options="{}"
            ></entity-input>
          </define-column>
        </define-table>
      </bos-tabs>
    </div>
    <div class="edit-equip" v-if="edit">
      <base-select
        label="警柜类型"
        :column="10"
        v-model="select.selected"
        margin="0 0"
        align="left"
        :selectList="select.selectList"
      ></base-select>
      <entity-input
        label="所属人员"
        v-model="people"
        :column="10"
        :options="{search:'applicant'}"
        margin="15px 0"
        format="{name}"
        :tableEdit="true"
        v-if="select.selected=='0'"
      ></entity-input>
      <div class="btn-box">
        <base-button
          label="取消"
          align="right"
          :width="128"
          :height="25"
          :fontSize="20"
          @click="black"
        ></base-button>
        <base-button
          label="提交"
          align="right"
          :width="128"
          :height="25"
          :fontSize="20"
          @click="confirm"
        ></base-button>
      </div>
    </div>
  </div>
</template>

<script>
import myHeader from "components/base/header/header";
import textInput from "@/componentized/textBox/textInput.vue";
import defineInput from "@/componentized/textBox/defineInput.vue";
import bosTabs from "@/componentized/table/bosTabs.vue";
import baseButton from "@/componentized/buttonBox/baseButton.vue";
import baseSelect from "@/componentized/textBox/baseSelect.vue";
import dateSelect from "@/componentized/textBox/dateSelect.vue";
import entityInput from "@/componentized/entity/entityInput";
import serviceDialog from "components/base/serviceDialog/index";
import divTmp from "@/componentized/divTmp";
import { getPoliceCabinets, assignPeople, cabinetEquip } from "api/warehouse";
export default {
  components: {
    myHeader,
    textInput,
    defineInput,
    baseButton,
    baseSelect,
    dateSelect,
    entityInput,
    divTmp,
    bosTabs,
    serviceDialog
  },
  data() {
    return {
      list: [],
      equipArg: [],
      listData: [],
      params: {
        pageInfo: {
          direction: "ASC",
          page: 1
        },
        returnType: "ARRAY",
        jpql:
          "select e  from Equip e  left join PoliceCabinet pc on e.policeCabinet.id = pc.id where e.policeCabinet.id != null",
        params: []
      },
      paginator: { size: 10, page: 1, totalElements: 0, totalPages: 0 },
      select: {
        selected: "",
        selectList: [
          {
            label: "单警柜",
            value: "0"
          },
          {
            label: "公共柜",
            value: "1"
          },
          {
            label: "备用柜",
            value: "2"
          }
        ]
      },
      edit: false,
      people: "",
      policeCabnietId: ""
    };
  },
  methods: {
    toAssign(data) {
      this.select.selected = "";
      this.policeCabnietId = data.id;
      this.edit = !this.edit;
    },
    openCabniet() {},
    selRow(data) {
      this.equipArg = [];
      this.equipArg = this._.flatten(
        this.listData.filter(
          item => item[0].policeCabinet.id == data.current.id
        )
      );
    },
    confirm() {
      let params = {
        category: this.select.selected
      };
      if (this.select.selected == 0) {
        if (this.people == "") {
          this.$message.error("请选择人员");
        } else {
          assignPeople({
            category: this.select.selected,
            policeCabinetId: this.policeCabnietId,
            userId: this.people.id
          }).then(res => {
            this.$message.success("警柜分配成功");
            this.people = "";
            this.black();
          });
        }
      } else {
        assignPeople({
          category: this.select.selected,
          policeCabinetId: this.policeCabnietId,
        }).then(res => {
          this.$message.success("警柜分配成功");
          this.black();
        });
      }
    },
    getList() {
      getPoliceCabinets()
        .then(res => {
          this.list = res;
          for (let elem of this.list.values()) {
            elem.policeCabinetUserItems.length != 0
              ? (elem.name = elem.policeCabinetUserItems[0].user.name)
              : "";
            if (elem.category == "2") elem.category = "备用柜";
            if (elem.category == "0") elem.category = "单警柜";
            if (elem.category == "1") elem.category = "公共柜";
          }
          this.getCabinetEquipList(this.list[0].id);
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    getCabinetEquipList(id) {
      this.params.params = [];
      cabinetEquip(this.params).then(res => {
        this.listData = this._.flatten(res);
        this.listData = this._.map(
          this._.groupBy(this.listData, item => `${item.policeCabinet.id}`)
        );
      });
    },
    black() {
      this.edit = !this.edit;
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.opening-box {
  font-size: 16px;
  width: 100%;
  // min-height: 4.4323rem;
  .btn_box {
    height: 45px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid rgba(112, 112, 112, 0.13);
    border-bottom: 1px solid rgba(112, 112, 112, 0.13);
  }
  .data-list {
    padding: 0 10px;
    margin-top: 15px;
    height: "2.8648rem";
    // border:1px solid rgba(112, 112, 112, 0.13)
  }
  .btn-box {
    width: 400px;
    height: 50px;
    margin-left: 20px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid black;
    // float: left;
  }
  .span-box {
    display: flex;
    justify-content: space-between;
  }
  .edit-equip {
    height: 400px;
    width: 400px;
    border: 1px solid rgba(112, 112, 112, 0.13);
    margin: 0 auto;
    margin-top: 100px;
    // text-align:center
  }
}
</style>