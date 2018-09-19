<template>
  <el-row :gutter="20">
    <!-- 左侧树图 -->
    <el-col
      :xs="12"
      :md="14"
      :lg="16"
      :xl="18">
      <svg
        id="d3-tree-overlay"
        :width="width"
        :height="height">
        <defs>
          <marker
            id="arrow"
            markerUnits="strokeWidth"
            markerWidth="5"
            markerHeight="5"
            viewBox="0 0 10 10"
            refX="17"
            refY="4.5"
            orient="auto">
            <path
              d="M0,0 L10,5 L0,10 L5,5"
              style="fill: #000;" />
          </marker>
        </defs>
      </svg>
      <sentence-tree
        v-if="debug"
        ref="sentence"
        :height="'30vh'"
        :width="'100%'"
        @sentenceClick="sentenceClick" />
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
        @changeIntent="update"
        @appendIntent="appendIntent"
        @unclick="unclick"
        @createNode="create"
        @upload="load"
        @uploadSentence="uploadSentence"
        @download="download"
        @copyTree="copyTree"
        @deleteNode="deleteNode" />
    </el-col>
  </el-row>
</template>
<script>
import ControlPanel from './control-panel/control-panel';
import SentenceTree from './sentence-tree/sentence-tree';

import * as d3 from 'd3';
import states from './states';
import zoomListener from './listener/zoom';
import { default as click, clickCallBack, unclick } from './listener/click';
import update from './utils/update';
import expand from './utils/expand';
import generateJSON from './utils/generateJSON';
import { default as traceroute, getLink } from './utils/traceroute';

export default {
  name: 'D3Tree',
  components: {
    ControlPanel: ControlPanel,
    SentenceTree: SentenceTree
  },
  data: function() {
    return {
      selectedNode: undefined,
      selectedData: undefined,
      height: '100vh',
      width: '100%',
      debug: false
    };
  },
  watch: {
    selectedData: {
      deep: true,
      handler: function(val) {
        if (val !== undefined) {
          click(this.selectedNode);
          this.$refs.control.showSetting();
        }
      }
    }
  },
  mounted: function() {
    states.baseSvg = d3.select('#d3-tree-overlay');
    states.svgGroup = states.baseSvg.append('g');
    states.baseSvg.call(zoomListener).on('dblclick.zoom', null);
    clickCallBack(this.onClick);
    this.load(states.root);
  },
  methods: {
    toggleDebug: function(debug) {
      this.debug = debug;
      if (this.debug) {
        this.height = '70vh';
      }
      else {
        this.height = '100vh';
      }
    },
    uploadSentence: function(data) {
      this.$refs.sentence.load(data);
    },
    download: function() {
      const data = generateJSON(states.root);
      const temp = document.createElement('a');
      temp.download = 'syntaxTree.json';
      temp.href = URL.createObjectURL(new Blob([data]));
      document.body.appendChild(temp);
      temp.click();
      document.body.removeChild(temp);
    },
    update: function() {
      click(states.root);
    },
    appendIntent: function(intent) {
      const root = states.root;
      expand(root);
      const node = d3.hierarchy(intent);
      node.parent = root;
      root.children.push(node);
      update(root);
      click(node);
    },
    onClick: function(selectedNode) {
      this.selectedNode = selectedNode;
      this.selectedData = selectedNode && selectedNode.data;
      this.$emit('onClick', selectedNode);
    },
    create: function(node) {
      const holder = states.root.children[0];
      expand(holder);
      if (holder.children === undefined) {
        holder.children = [];
      }
      const root = d3.hierarchy(node);
      root.parent = holder;
      holder.children.push(root);
      update(holder);
      click(root);
    },
    load: function(data) {
      states.root = d3.hierarchy(data);
      // 设置根节点初始坐标
      states.root.x0 = 0;
      states.root.y0 = states.baseSvg.node().clientWidth / 2;
      click(states.root);
    },
    unclick: function() {
      unclick();
    },
    copyTree: function(d) {
      this.create(JSON.parse(generateJSON(d)));
    },
    deleteNode: function(d) {
      const parent = d.parent;
      expand(parent);
      const index = parent.children.indexOf(d);
      if (index > -1) {
        parent.children.splice(index, 1);
        if (!parent.children.length) {
          delete parent.children;
        }
      }
      click(parent);
    },
    sentenceClick: function(data, index) {
      states.debugRoot = index;
      states.route = getLink(traceroute(states.root, data, index));
      update(this.route);
    }
  }
};
</script>

<style lang="stylus">
#d3-tree-overlay
  background-color #DDD
circle
  stroke-width 1.5px
.root
  circle
    fill #DCDFE6
    stroke #909399
.holder
  circle
    fill #E7CFA1
    stroke #D38200
.intent
  circle
    fill #DCB5FF
    stroke #BE77FF
.order
  circle
    fill #D9EDF7
    stroke #5BC0DE
.pickone
  circle
    fill #F2DEDE
    stroke #D9534F
.exchangeable
  circle
    fill #FFF3CD
    stroke #F0AD4E
.content
  circle
    fill #DFF0D8
    stroke #5CB85C
.collapsed
  circle
    fill #FFF
.node
  cursor pointer
  text
    font 10px sans-serif
    &.internal
      text-anchor end
    &.leaf
      text-anchor start
.link
  fill none
  stroke #555
  stroke-width 1.5px
  stroke-opacity 0.4
.tipLink
  fill none
  stroke red
  stroke-width 1.5px
  stroke-opacity 1
.tempLink
  fill none
  stroke red
  stroke-width 3px
  stroke-opacity 0.5
.ghostCircle
  &.show
    opacity 0.2
    display block
  display none
.activeDrag
  .ghostCircle
    display none
</style>
