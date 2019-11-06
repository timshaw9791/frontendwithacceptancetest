<template>
  <div class="p-s-list-box">
    <div v-for="item in list">
      <div @click="clickPersonnel(item)">
        <p_template :item="item"></p_template>
      </div>
    </div>
    <div class="paginator-box">
      <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"></bos-paginator>
    </div>
  </div>
</template>

<script>
import p_template from "./personnelTemplate";
import { getUserList } from "api/personnel";
import { formRulesMixin } from "field/common/mixinTableRest";
export default {
  name: "personnelLsit",
  components: {
    p_template
  },
  mixins: [formRulesMixin],
  data() {
    return {
      param: this.personnel.table,
      partialPiginator: { totalPages: 10, totalElements: 10 }, //默认值
      nameLike: "",
      list: []
    };
  },
  props: {
    personnel: {
      type: Object
    }
  },
  watch: {
    personnel: {
      handler(newVal) {
        this.getUsersList();
      },
      deep: true
    }
  },
  computed: {
    paginator() {
      //获取分页信息
      return Object.assign({}, this.partialPiginator, this.param.paginator);
    }
  },
  methods: {
    clickPersonnel(item) {
      this.$emit("clickPersonnel", item);
    },
    getUsersList() {
      let data = Object.assign(
        {},
        this.personnel.table.paginator,
        this.personnel.table.query
      );
      getUserList(data).then(res => {
        let result = JSON.parse(JSON.stringify(res.data.content)),
          arr = [];
        result.forEach(item => {
          if (item.role.roleDescribe != "超级管理员") {
            arr.push(item);
          }
        });
        this.partialPiginator.totalElements = res.data.totalElements
            this.partialPiginator.totalPages = res.data.totalPages
        this.list = arr;
      });
    }
  },
  created() {
    this.getUsersList();
  }
};
</script>

<style scoped>
.p-s-list-box {
  width: 100%;
  font-size: 16px;
  color: #707070;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 10px;
}
.p-s-list-box .paginator-box {
  width: 100%;
}
</style>