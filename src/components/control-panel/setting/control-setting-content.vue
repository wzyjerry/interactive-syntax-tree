<template>
  <el-collapse
    :value="['common', 'content']">
    <!-- 通用设置 -->
    <el-collapse-item
      name="common"
      title="Common Settings">
      <!-- 节点类型 -->
      <el-form-item label="Type">
        <el-tag type="success">{{ selectedNode.data.type }}</el-tag>
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
    <!-- 内容设置 -->
    <el-collapse-item
      name="content"
      title="Content Settings">
      <!-- 来自文件 -->
      <el-form-item label="FromFile">
        <el-switch v-model="selectedNode.data.from_file"/>
      </el-form-item>
      <!-- 来自文件：文件名 -->
      <el-form-item
        v-if="selectedNode.data.from_file"
        label="Filename">
        <el-input
          v-model="selectedNode.data.filename"
          placeholder="Filename"
          clearable/>
      </el-form-item>
      <!-- 不来自文件：内容 -->
      <el-form-item
        v-else
        label="Content">
        <tag-editor :tags="selectedNode.data.content" />
      </el-form-item>
      <!-- 实体类型 -->
      <el-form-item
        v-if="selectedNode.data.entity"
        label="Entity">
        <el-input
          v-model="selectedNode.data.entity"
          placeholder="Entity"
          clearable/>
      </el-form-item>
      <!-- 缺字概率 -->
      <el-form-item label="Cut">
        <el-slider
          v-model="selectedNode.data.cut"
          :min="0"
          :max="1"
          :step="0.01"
          show-input/>
      </el-form-item>
      <!-- 缺字概率>0：单字缺字概率 -->
      <el-form-item
        v-if="selectedNode.data.cut && selectedNode.data.cut>0"
        label="WordCut">
        <el-slider
          v-model="selectedNode.data.word_cut"
          :min="0"
          :max="1"
          :step="0.01"
          show-input/>
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
import TagEditor from '@/components/tag-editor/tag-editor';
export default {
  name: 'ControlSettingContent',
  components: {
    TagEditor: TagEditor
  },
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
