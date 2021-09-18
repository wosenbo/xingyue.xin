<template>
	<view class="">
		<view>
			<u-steps :list="course['steps']" mode="number" :current="current - 1"></u-steps>
		</view>
		<view class="notice-item" v-for="(item,index) in course['steps']" v-if="index == current-1">
			<view class="content">
				<text class="title">{{item.title}}</text>
				<view class="img-wrapper">
					<u-image width="100%" height="100%" mode="aspectFit" :src="item.url"></u-image>
				</view>
				<text class="introduce">
					
				</text>
			</view>
		</view>
		<template>
			<view class="course-pagination">
				<uni-pagination :total="total" @change="change" />
			</view>
		</template>
		<flotage floticon="question-circle-fill" @parCallback="showOption"></flotage>
		<question :isShow="isShow"></question>
	</view>
</template>

<script>
	import {courseConts} from '@/utils/courses.js'
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	export default {
		data() {
			return {
				course: {},
				courseConts: courseConts,
				isShow: false,
				//分页属性
				current: 1,
				total: 0,
				pageSize: 10
			}
		},
		components: {
			uniPagination
		},
		onLoad(options) {
			if (options) {
				let name = options.name
				this.course = this.courseConts[name]
				this.total = this.course.steps.length * 10
			}
		},
		methods: {
			//弹出帮助窗口
			showOption() {
				if (this.isShow) {
					this.isShow = false
					setTimeout(() => {
						this.isShow = true
					}, 200)
				} else {
					this.isShow = true
				}
			},
			//分页器
			change(e) {
				this.current = e.current;
				if (this.current == this.total / 10) {
					setTimeout(() => {
						this.$api.msg("恭喜您,本章教程看完了哦！");
					}, 1000)
				}
			}
		}
	}
</script>
<style>
	@import "@/static/css/courses.scss";
</style>
