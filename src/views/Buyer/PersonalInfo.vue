<template>
	<el-tabs class="form-container">
		<el-tab-pane label="个人信息">
			<div>
				<el-form :model="personalForm" :rules="personalInfoRule" ref="personalForm"
					@keyup.enter.native="personalFormSubmit()" stateCode-icon>
					<el-form-item prop="email">
						<el-input class="info" v-model="personalForm.email" placeholder="邮箱"></el-input>
					</el-form-item>
					<el-form-item prop="phone">
						<el-input class="info" v-model="personalForm.phone" placeholder="手机号"></el-input>
					</el-form-item>
					<el-form-item prop="gender">
						<el-radio-group v-model="personalForm.gender">
							<el-radio value="男" size="large">男</el-radio>
							<el-radio value="女" size="large">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="personalFormSubmit()">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-tab-pane>

		<el-tab-pane label="密码">
			<div>
				<el-form :model="passwordForm" :rules="passwordRule" ref="passwordForm"
					@keyup.enter.native="passwordFormSubmit()" stateCode-icon>
					<el-form-item prop="oldPassword">
						<el-input class="info" v-model="passwordForm.oldPassword" Y placeholder="旧密码"></el-input>
					</el-form-item>
					<el-form-item prop="newPassword">
						<el-input class="info" v-model="passwordForm.newPassword" type="password" Y placeholder="新密码"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input class="info" v-model="passwordForm.confirmedPassword" type="password" Y
							placeholder="确认密码"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="passwordFormSubmit()">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import axios from 'axios';
import { changePassword, changePersonalInfoUrl } from '../../api/apis.js';
import { ElMessage } from 'element-plus';

export default {
	data() {
		return {
			ElMessage,
			changePersonalInfoUrl,
			personalForm: {
				email: '',
				phone: '',
				gender: '',
			},
			passwordForm: {
				newPassword: '',
				confirmedPassword: '',
			},
			personalInfoRule: {
				email: [
					{ required: true, message: '邮箱不能为空', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '手机号不能为空', trigger: 'blur' }
				],
			},
			passwordRule: {
				oldPassword: [
					{ required: true, message: '旧密码不能为空', trigger: 'blur' }
				],
				newPassword: [
					{ required: true, message: '新密码不能为空', trigger: 'blur' }
				],
				confirmedPassword: [
					{ validator: this.confirmedPasswordValiadator, trigger: 'blur' },
				]
			},
		};
	},

	methods: {
		changePassword,
		passwordFormSubmit() {
			this.$refs['passwordForm'].validate((valid) => {
				if (valid) {
					changePassword({
						oldPassword: this.passwordForm.oldPassword,
						newPassword: this.passwordForm.newPassword,
					}).then(res => {
						if (res.stateCode == '200') {
							ElMessage.success('修改密码成功');
							this.$router.push('/');
						} else {
							if (res.stateMsg) {
								ElMessage.error(res.stateMsg);
							} else {
								ElMessage.error('未知错误, Status: ' + res.stateCode);
							}
						}
					})
				}
			});
		},

		personalFormSubmit() {
			axios.post(this.changePersonalInfoUrl, this.personalForm, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(response => {
				const res = response.data;
				if (res.stateCode == '200') {
					ElMessage.success('修改个人信息成功');
					this.$router.push('/');
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			})
		},
		confirmedPasswordValiadator(rule, value, callback) {
			if (value === '') {
				callback(new Error('请再次输入密码'))
			} else if (value !== this.passwordForm.newPassword) {
				callback(new Error("两次输入的密码不同"))
			} else {
				callback()
			}
		}
	},
};
</script>

<style scoped>
.form-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
	background-color: #fff;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	margin-top: 100px;
}

.el-form-item {
	margin-bottom: 20px;
}

.form-actions {
	text-align: center;
}
</style>