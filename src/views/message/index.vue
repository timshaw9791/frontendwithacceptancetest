<template>
	<div class="message-container">
		<my-header title="消息中心"></my-header>
		<div class="top">
			<define-input label="消息标题"></define-input>
		</div>
		<div class="body">
			<bos-tabs :option="['contrast']" :contrastKey="['main', 'content']" :layoutRatio="['45%', '55%']">
				<define-table :data="list" :pageInfo="fetchParams.pageInfo" @changePage="changePage" height="2.7604rem" slot="main">
					<define-column label="操作" field="opeare" width="60"></define-column>
					<define-column label="消息状态" width="100" v-slot="{ data }">
						<span :class="['sign',{unread: !data.row.status}]" @click="readIt(data.row)">
							{{ data.row.status?'已读':'未读' }}
						</span>
					</define-column>
					<define-column label="通知时间" :filter="row => this.$filterTime(row.createTime)" width="200"></define-column>
					<define-column label="消息标题" field="title"></define-column>
					<!-- <define-column label="消息内容" field="content"></define-column> -->
				</define-table>
				<define-table :data="contentList" :havePage="false" height="2.9948rem" slot="content">
					<define-column label="消息内容" field="content"></define-column>
				</define-table>
			</bos-tabs>
		</div>
	</div>
</template>

<script>
import myHeader from 'components/base/header/header';
import { getMsgList, readMsg } from 'api/message'
import { bosMixin } from 'field/mixins/listMixin'
import { jsqlPage } from 'api/basic'
import bosTabs from '@/componentized/table/bosTabs'
export default {
	name: 'message',
	components: { myHeader, bosTabs },
	mixins: [bosMixin],
	data() {
		return {
			list: [],
			contentList: [],
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