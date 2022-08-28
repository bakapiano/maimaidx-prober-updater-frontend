<template>
  <n-spin :show="loading">
    <n-card class="card" title="导入数据">
      <n-space vertical>
        <n-form
          ref="formRef"
          label-placement="left"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input
              placeholder="查分器账号"
              v-model:value="formValue.username"
            />
          </n-form-item>
          <n-form-item path="password">
            <n-input
              type="password"
              show-password-on="click"
              placeholder="查分器密码"
              v-model:value="formValue.password"
            />
          </n-form-item>
          <n-checkbox value="" @change="rememberChange" :checked="remember">
            记住账号和密码
          </n-checkbox>
        </n-form>
      </n-space>
      <template #action>
        <n-space justify="space-between">
          <n-space>
            <n-button type="success" @click="submit">提交</n-button>
            <n-button v-model:value="remember" @click="clearForm" type="error">
              清空
            </n-button>
          </n-space>
        </n-space>
      </template>
    </n-card>
  </n-spin>
</template>

<script setup>
import { postForm } from "../api/form.js";
import { defineComponent, ref, onMounted } from "vue";
import { useMessage, useDialog } from "naive-ui";

const props = defineProps(["proxyStatus"]);
const message = useMessage();
const dialog = useDialog();

const loading = ref(false);
const formRef = ref(null);
const formValue = ref({
  username: "",
  password: "",
});
const remember = ref(false);
const rules = ref({
  username: {
    required: true,
    message: "请输入查分器账户",
  },
  password: {
    required: true,
    message: "请输入查分器密码",
  },
});

onMounted(() => {
  remember.value = window.localStorage.remember === "true" ? true : false;
  if (window.localStorage.username !== undefined)
    formValue.value.username = window.localStorage.username;
  if (window.localStorage.password !== undefined)
    formValue.value.password = window.localStorage.password;
});

function saveToLocalStorage() {
  if (!remember.value) return;
  window.localStorage.username = formValue.value.username;
  window.localStorage.password = formValue.value.password;
}

function clearLocalStorage() {
  delete window.localStorage.username;
  delete window.localStorage.password;
}

function clearForm() {
  console.log("clear-form");
  clearLocalStorage();
  formValue.value.username = formValue.value.password = "";
}

function rememberChange(value) {
  remember.value = window.localStorage.remember = value;
  value ? saveToLocalStorage() : clearLocalStorage();
  console.log(value, remember.value, window.localStorage.remember);
}

async function post() {
  loading.value = true;
  try {
    const result = await postForm(
      formValue.value.username,
      formValue.value.password
    );
    console.log(result.data);
    saveToLocalStorage();
    window.location.href = result.data;
  } catch (err) {
    console.log(err);
    message.error(err.response.data ? err.response.data : "未知错误");
    clearLocalStorage();
  }
  loading.value = false;
}

function submit() {
  formRef.value?.validate((errors) => {
    console.log(props.proxyStatus);
    if (!errors) {
      if (!props.proxyStatus) {
        dialog.warning({
          title: "Warning",
          content: "代理配置存在问题，可能会导致数据更新不成功，是否继续？",
          negativeText: "取消",
          positiveText: "继续",
          onPositiveClick: () => {
            post();
          },
          autoFocus: false,
        });
      } else post();
    } else {
      console.log(errors);
    }
  });
}
</script>

<style scoped>
</style>
