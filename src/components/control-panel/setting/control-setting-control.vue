<template>
  <el-collapse
    :value="['common', 'advanced']">
    <!-- 通用设置 -->
    <el-collapse-item
      name="common"
      title="Common Settings">
      <!-- 节点类型 -->
      <el-form-item
        label="Type">
        <el-radio-group
          v-model="selectedNode.data.type">
          <el-radio-button
            class="order"
            label="order"/>
          <el-radio-button
            class="pickone"
            label="pickone"/>
          <el-radio-button
            class="exchangeable"
            label="exchangeable"/>
        </el-radio-group>
      </el-form-item>
      <!-- 子节点数量 -->
      <el-form-item label="Childrens">
        <el-tag type="info">{{ childrenLength }}</el-tag>
      </el-form-item>
      <!-- 节点名称 -->
      <el-form-item label="Name">
        <el-input
          v-model="selectedNode.data.name"
          placeholder="Name"
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
    </el-collapse-item>
    <!-- 高级设置 -->
    <el-collapse-item
      name="advanced"
      title="Advanced Settings">
      <!-- 节点权重 -->
      <el-form-item
        label="Weight">
        <el-input-number
          v-model="selectedNode.data.weight"
          :precision="2"
          :step="0.01"
          :min="0"/>
      </el-form-item>
    </el-collapse-item>
    <!-- 复制子树 -->
    <el-collapse-item
      name="copy"
      title="Copy Tree">
      <el-row
        type="flex"
        justify="center">
        <el-button
          type="warning"
          @click="copyTree">Copy<i class="el-icon-info el-icon--right"/></el-button>
      </el-row>
    </el-collapse-item>
    <!-- 删除节点 -->
    <el-collapse-item
      name="delete"
      title="Delete Node">
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
  name: 'ControlSettingControl',
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
    copyTree: function() {
      this.$emit('copyTree');
    },
    deleteNode: function() {
      this.$emit('deleteNode');
    }
  }
};
</script>

<style lang="stylus">
.order.is-active
  span.el-radio-button__inner
    background-color #3A8EE6
    border-color #3A8EE6
    box-shadow -1px 0 0 0 #3A8EE6
.pickone.is-active
  span.el-radio-button__inner
    background-color #F56C6C
    border-color #F56C6C
    box-shadow -1px 0 0 0 #F56C6C
.exchangeable.is-active
  span.el-radio-button__inner
    background-color #E6A23C
    border-color #E6A23C
    box-shadow -1px 0 0 0 #E6A23C
</style>
