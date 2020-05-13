<template>
	<div class="message-container">
		<my-header title="消息中心"></my-header>
		<div class="top">
			<define-input label="消息标题"></define-input>
		</div>
		<div class="body">
			<define-table :data="list" :pageInfo="fetchParams.pageInfo" @changePage="changePage">
				<define-column label="操作" width="100" v-slot="{ data }">
					<span :class="['sign',{unread: !data.row.status}]" @click="readIt(data.row)">
						{{ data.row.status?'已读':'未读' }}
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
import { bosMixin } from 'field/mixins/listMixin'
import { jsqlPage } from 'api/basic'
export default {
	name: 'message',
	components: { myHeader },
	mixins: [bosMixin],
	data() {
		return {
			list: [],
			fetchParams: {
				jpql: "select m from Message m where m.userId = ?1 order by m.status asc, m.createTime desc ",
				pageInfo: {
					direction: "DESC",
					page: 1,
					size: 10,
					totalPages: 1
				},
				returnType: "ARRAY",
				params: [
					JSON.parse(localStorage.getItem('user')).id
				]
			}
		}
	},
	methods: {
		fetchData() {
			jsqlPage(this.fetchParams).then(res => {
				this.list = this._.flatten(res.content);
				this.fetchParams.pageInfo.totalPages = res.totalPages;
			})
		},
		readIt(data) {
			readMsg({ids: [data.id]}).then(res => {
				this.$message.success('标记已读');
				this.fetchData();
			})
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