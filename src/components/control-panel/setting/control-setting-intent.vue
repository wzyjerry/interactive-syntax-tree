<template>
  <el-collapse
    value="common">
    <!-- 通用设置 -->
    <el-collapse-item
      name="common"
      title="Common Settings">
      <!-- 节点类型 -->
      <el-form-item
        label="Type">
        <el-tag type="danger">{{ selectedNode.data.type }}</el-tag>
      </el-form-item>
      <!-- 子节点数量 -->
      <el-form-item label="Childrens">
        <el-tag type="info">{{ childrenLength }}</el-tag>
      </el-form-item>
      <!-- 兴趣 -->
      <el-form-item label="Intent">
        <el-input
          v-model="selectedNode.data.intent"
          placeholder="Intent"
          clearable/>
      </el-form-item>
      <!-- 剪枝概率 -->
      <el-form-item label="Dropout">
        <el-slider
          v-model="selectedNode.data.dropout"
          :min="0"
          :max="1"
          :step="0.01"
          show-input/>
      </el-form-item>
      <!-- 权重 -->
      <el-form-item label="Weight">
        <el-input-number
          v-model="selectedNode.data.weight"
          :precision="2"
          :step="0.01"
          :min="0"/>
      </el-form-item>
    </el-collapse-item>
    <!-- 删除节点 -->
    <el-collapse-item
      name="delete"
      title="Delete Intent">
      <el-row
        type="flex"
        justify="center">
        <el-button
          type="danger"
          @click="deleteNode">Delete<i class="el-icon-warning el-icon--right"/></el-button>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
export default {
  name: 'ControlSettingIntent',
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
  },
  methods: {
    deleteNode: function() {
      this.$emit('deleteNode');
    }
  }
};
</script>
