<template>
  <div>
    <div class="table">
		<define-table :data="list" height="550.0032px" :pageInfo="paginator" 
			:highLightCurrent="true" @changeCurrent="changeCurrent" @changePage="changePage">
				<define-column label="耗材名称" field="name"></define-column>
				<define-column label="耗材数量" field="count"></define-column>
				<define-column label="耗材用途" field="describes"></define-column>
		</define-table>
    </div>
    <div class="footer">
      <base-button label="取消" type="none" @click="cancel"></base-button>
      <base-button label="确定" @click="select"></base-button>
    </div>
  </div>
</template>

<script>
import { baseURL } from 'api/config'
import { getConsumableList } from 'api/consumable'
export default {
  name: 'consumableSelect',
  data() {
    return {
      list: [],
      selected: {},
      paginator: {size: 10, page: 1, totalPages: 0, totalElements: 0, search: ''},
    }
  },
  methods: {
    getConsumableList() {
        getConsumableList(this.paginator).then(res => {
                this.list = res.content;
                this.paginator.totalPages = res.totalPages;
                this.paginator.totalElements = res.totalElements;
        })
    },
    changePage(page) {
		this.paginator.page = page;
		this.getUserList();
    },
    cancel() {
      	this.$emit('cancel');
    },
    select() {
      	this.$emit('select', {data: this.selected, ref: 'consumableSelect'});
    },
    changeCurrent(data) {
      	this.selected = data.current;
    }
  },
  created() {
    this.getConsumableList();
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-table {
    font-size: 18px;
  }
  .table {
    margin-top: 10px;
  }
  .footer {
    text-align: center;
  }
</style>