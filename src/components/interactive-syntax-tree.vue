<template>
  <el-container>
    <el-main>
      <d3-tree />
    </el-main>
  </el-container>
</template>

<script>
import D3Tree from './d3-tree/d3-tree';
export default {
  name: 'InteractiveSyntaxTree',
  components: {
    D3Tree: D3Tree
  }
};
</script>

<style lang="stylus" scoped>
.el-container
  .el-main
    padding: 0 20px
</style>
