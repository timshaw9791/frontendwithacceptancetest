<template>
	<div class="message-container">
		<my-header title="消息中心"></my-header>
		<div class="top">
			<define-input label="消息标题" v-model="fetchParam.search"></define-input>
		</div>
		<div class="body">
			<define-table :data="list" :pageInfo="paginator" @changePage="changePage">
				<define-column label="操作" width="100" v-slot="{ data }">
					<span :class="['sign',{unread: !data.row.status}]" @click="readIt(data.row)">
						{{ data.row.status | filterStaus }}
					</span>
				</define-column>
				<define-column label="通知时间" :filter="row => this.$filterTime(row.createTime)" width="200"></define-column>
				<define-column label="消息标题" field="title" width="360"></define-column>
				<define-column label="消息内容" field="content"></define-column>
			</define-table>
		</div>
	</div>
</template>

<script>
import myHeader from 'components/base/header/header';
import { getMsgList, readMsg } from 'api/message'
import { listTableMixin } from 'field/mixins/listMixin'
export default {
	name: 'message',
	components: { myHeader },
	mixins: [listTableMixin],
	data() {
		return {
			list: [],
			fetchParam: {
				search: '',
				id: JSON.parse(localStorage.getItem('user')).id,
				properties: ['status'],
				direction: 'ASC'
			}
		}
	},
	methods: {
		fetchData() {
			getMsgList(Object.assign(this.paginator, this.fetchParam)).then(res => {
				this.list = res.content;
				this.paginator.totalElements = res.totalElements;
				this.paginator.totalPages = res.totalPages;
				this.$store.commit('setUnreadCount', res.content.filter(item => !item.status).length);
			})
		},
		readIt(data) {
			readMsg({ids: [data.id]}).then(res => {
				this.$message.success('标记已读');
				this.fetchData();
			})
		}
	},
	filters: {
		filterStaus(val) {
			return val?'已读':'未读';
		}
	},
	watch: {
		'fetchParam.search': {
			handler(val) {
				this.fetchData();
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.message-container {
	font-size: 16px;
	.top {
		padding: 10px 0;
		border-bottom: 1px solid #ececec;
	}
	.sign {
		cursor: pointer;
		user-select: none;
	}
	.unread {
		color: red;
	}
}
</style>