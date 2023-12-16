<template>
  <p class="demo-title">按钮类型</p>
  <demo-block class="demo-container">
    <g-button type="primary">主要按钮</g-button>
    <g-button type="success">成功按钮</g-button>
    <g-button type="default">默认按钮</g-button>
    <g-button type="danger">主要按钮</g-button>
    <g-button type="warning">成功按钮</g-button>
  </demo-block>
  <p class="demo-title">朴素按钮</p>
  <demo-block class="demo-container">
    <g-button plain type="primary" text="朴素按钮" />
    <g-button plain type="success" text="朴素按钮" />
  </demo-block>
</template>

<script setup>
import gButton from '../index'
</script>
<style lang="less" scoped>
.demo-button {
  padding: 20px;
  .g-button {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
</style>