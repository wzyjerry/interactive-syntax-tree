<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <!-- 左侧树图 -->
        <el-col
          :xs="12"
          :md="14"
          :lg="16"
          :xl="18">
          <d3-tree
            ref="tree"
            :height="height"
            :width="'100%'"
            @onClick="onClick"
            @showSetting="showSetting" />
          <sentence-tree
            v-if="debug"
            ref="sentence"
            :height="'30vh'"
            :width="'100%'"
            @mouseover="mouseover"
            @mouseout="mouseout" />
        </el-col>
        <!-- 右侧控制面板 -->
        <el-col
          :xs="12"
          :md="10"
          :lg="8"
          :xl="6">
          <control-panel
            ref="control"
            :selected-node="selectedNode"
            @toggleDebug="toggleDebug"
            @changeIntent="changeIntent"
            @appendIntent="appendIntent"
            @unclick="unclick"
            @createNode="createNode"
            @upload="upload"
            @uploadSentence="uploadSentence"
            @download="download"
            @copyTree="copyTree"
            @deleteNode="deleteNode" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import D3Tree from './d3-tree/d3-tree';
import SentenceTree from './sentence-tree/sentence-tree';
import ControlPanel from './control-panel/control-panel';

export default {
  name: 'InteractiveSyntaxTree',
  components: {
    D3Tree: D3Tree,
    SentenceTree: SentenceTree,
    ControlPanel: ControlPanel
  },
  data: function() {
    return {
      selectedNode: undefined,
      height: '100vh',
      debug: false
    };
  },
  methods: {
    toggleDebug: function(debug) {
      this.debug = debug;
      if (debug) {
        this.height = '70vh';
      }
      else {
        this.height = '100vh';
      }
    },
    changeIntent: function() {
      this.$refs.tree.update();
    },
    appendIntent: function(intent) {
      this.$refs.tree.appendIntent(intent);
    },
    showSetting: function() {
      this.$refs.control.showSetting();
    },
    onClick: function(selectedNode) {
      this.selectedNode = selectedNode;
    },
    unclick: function() {
      this.$refs.tree.unclick();
    },
    createNode: function(node) {
      this.$refs.tree.create(node);
    },
    upload: function(data) {
      this.$refs.tree.load(data);
    },
    uploadSentence: function(data) {
      this.$refs.sentence.load(data);
    },
    download: function() {
      const data = this.$refs.tree.generate();
      const temp = document.createElement('a');
      temp.download = 'syntaxTree.json';
      temp.href = URL.createObjectURL(new Blob([data]));
      document.body.appendChild(temp);
      temp.click();
      document.body.removeChild(temp);
    },
    copyTree: function() {
      this.$refs.tree.copyTree(this.selectedNode);
    },
    deleteNode: function() {
      this.$refs.tree.deleteNode(this.selectedNode);
    },
    mouseover: function(data, id) {
      this.$refs.tree.mouseover(data, id);
    },
    mouseout: function() {
      this.$refs.tree.mouseout();
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-container
  .el-main
    padding: 0 20px
</style>
