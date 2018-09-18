<template>
  <el-collapse
    value="common">
    <!-- 通用设置 -->
    <el-collapse-item
      name="common"
      title="Holder Status">
      <!-- 节点类型 -->
      <el-form-item
        label="Type">
        <el-tag type="warning">{{ selectedNode.data.type }}</el-tag>
      </el-form-item>
      <!-- 子节点数量 -->
      <el-form-item label="Childrens">
        <el-tag type="info">{{ childrenLength }}</el-tag>
      </el-form-item>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
export default {
  name: 'ControlSettingHolder',
  props: {
    selectedNode: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    childrenLength: function() {
      if (this.selectedNode.children === undefined
       && this.selectedNode._children === undefined) {
        return 0;
      }
      return (this.selectedNode.children || this.selectedNode._children).length;
    }
  }
};
</script>
