<template>
	<div class="message-container">
		<my-header title="消息中心" height="45px"></my-header>
		<div class="top">
			<define-input label="消息标题"></define-input>
			<base-button label="一键已读" align="right" margin="0 30px 0 0" @click="allMessageRead"></base-button>
		</div>
		<div class="body">
			<bos-tabs :option="['contrast']" :contrastKey="['main', 'content']" :layoutRatio="['45%', '55%']" :header="false">
				<define-table :data="list" :pageInfo="fetchParams.pageInfo" @changePage="changePage" height="4.0104rem" 
					:highLightCurrent="true" @changeCurrent="changeCurrent" slot="main" ref="leftTable">
					<define-column label="操作" field="opeare" width="60" v-slot="{ data }">
						<i class="iconfont iconxingbiaotianchong star" @click="messageStar(data.row.id,false)" v-if="data.row.newStar"></i>
						<i class="iconfont iconxingbiaoxianxing" @click="messageStar(data.row.id, true)" v-else></i>
					</define-column>
					<define-column label="消息状态" width="100" v-slot="{ data }">
						<span :class="['sign',{unread: !data.row.status}]" @click="readIt(data.row)">
							{{ data.row.status?'已读':'未读' }}
						</span>
					</define-column>
					<define-column label="通知时间" :filter="row => this.$filterTime(row.createTime)" width="200"></define-column>
					<define-column label="消息标题" :filter="row=>fixTitle(row.title)"></define-column>
				</define-table>
				<define-table :data="list[selectIndex].messageItems" :havePage="false" height="4.2448rem" slot="content">
					<define-column label="消息内容" field="content"></define-column>
				</define-table>
			</bos-tabs>
		</div>
	</div>
</template>

<script>
import myHeader from 'components/base/header/header';
import { readMsg, markStar, allRead } from 'api/message'
import { bosMixin } from 'field/mixins/listMixin'
import { jsqlPage, bosEnums } from 'api/basic'
import bosTabs from '@/componentized/table/bosTabs'
export default {
	name: 'message',
	components: { myHeader, bosTabs },
	mixins: [bosMixin],
	data() {
		return {
			list: [{messageItems:[]}],
			selectIndex: 0,
			enumerator: [], // 标题枚举对象
			fetchParams: {
				jpql: "select ms from Message ms where ms.userId = ?1 order by ms.newStar desc, ms.status asc, ms.createTime desc",
				returnType: "ARRAY",
				pageInfo: {
					direction: "DESC",
					page: 1,
					size: 10,
					totalPages: 1
				},
				params: [
					JSON.parse(localStorage.getItem('user')).id
				]
			},
			userId: JSON.parse(localStorage.getItem('user')).id
		}
	},
	methods: {
		fetchData() {
			jsqlPage(this.fetchParams).then(res => {
				this.list = this._.flatten(res.content);
				this.fetchParams.pageInfo.totalPages = res.totalPages;
			})
		},
		fetchEnumerator() {
			bosEnums({category: 'MessageTitleEnum'}).then(res => {
				this.enumerator = res;
			})
		},
		readIt(data) {
			readMsg({ids: [data.id]}).then(res => {
				this.$message.success('标记已读');
				this.fetchData();
			})
		},
		changeCurrent(data) {
			this.selectIndex = data.index
		},
		fixTitle(value) {
			let tmp = this.enumerator.find(item => item.value == value)
			return tmp?tmp.chinese:''
		},
		messageStar(id, status) {
			markStar({id, status, userId: this.userId}).then(res => {
				this.fetchData();
			})
		},
		allMessageRead() {
			allRead({userId: this.userId}).then(res => {
				this.fetchData();
			})
		}
	},
	created() {
		this.fetchEnumerator();
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
	.star {
		color: #f8dc00;
	}
	.iconfont {
		font-size: 14px;
	}
}
</style>