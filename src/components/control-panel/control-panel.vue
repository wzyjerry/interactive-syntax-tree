<template>
  <el-tabs
    v-model="tabs"
    type="border-card"
    @tab-remove="unclick">
    <!-- 菜单 -->
    <el-tab-pane name="menu">
      <span slot="label"><i class="el-icon-menu"/> Menu</span>
      <el-scrollbar>
        <control-menu
          class="tab-scroll"
          @createNode="createNode"
          @upload="upload"
          @download="download" />
      </el-scrollbar>
    </el-tab-pane>
    <!-- 设置 -->
    <el-tab-pane
      v-if="selectedNode"
      closable
      name="setting">
      <span slot="label"><i class="el-icon-setting"/> Setting</span>
      <el-scrollbar>
        <control-setting
          :selected-node="selectedNode"
          class="tab-scroll"
          @changeIntent="changeIntent"
          @appendIntent="appendIntent"
          @copyTree="copyTree"
          @deleteNode="deleteNode" />
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ControlMenu from './menu/control-menu';
import ControlSetting from './setting/control-setting';
export default {
  name: 'ControlPanel',
  components: {
    ControlMenu: ControlMenu,
    ControlSetting: ControlSetting
  },
  props: {
    selectedNode: {
      type: Object,
      default: undefined
    }
  },
  data: function() {
    return {
      // 当前的选项卡
      tabs: 'menu'
    };
  },
  methods: {
    changeIntent: function() {
      this.$emit('changeIntent');
    },
    appendIntent: function(intent) {
      this.$emit('appendIntent', intent);
    },
    showSetting: function() {
      this.tabs = 'setting';
    },
    unclick: function() {
      this.tabs = 'menu';
      this.$emit('unclick');
    },
    createNode: function(newNode) {
      this.$emit('createNode', newNode);
    },
    upload: function(data) {
      this.$emit('upload', data);
    },
    download: function() {
      this.$emit('download');
    },
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
.tab-scroll
  max-height: calc(100vh - 74px)
  padding-right: 10px
.el-scrollbar__bar.is-horizontal
  display: none
</style>

