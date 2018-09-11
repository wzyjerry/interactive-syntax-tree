<template>
  <svg
    :width="width"
    :height="height"/>
</template>
<script>
import * as d3 from 'd3';
import states from './states';
import zoomListener from './listener/zoom';
import { default as click, clickCallBack, unclick } from './listener/click';
import update from './utils/update';
import expand from './utils/expand';
import generateJSON from './utils/generateJSON';

export default {
  name: 'D3Tree',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100vh'
    }
  },
  data: function() {
    return {
      selectedNode: undefined,
      selectedData: undefined
    };
  },
  watch: {
    selectedData: {
      deep: true,
      handler: function(val) {
        if (val !== undefined) {
          click(this.selectedNode);
          this.$emit('showSetting');
        }
      }
    }
  },
  mounted: function() {
    states.baseSvg = d3.select('svg')
      .attr('id', 'd3-tree-overlay');
    states.svgGroup = states.baseSvg.append('g');
    states.baseSvg.call(zoomListener)
      .on('dblclick.zoom', null);
    clickCallBack(this.onClick);
    this.load(states.root);
  },
  methods: {
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
    generate: function() {
      return generateJSON(states.root);
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
    }
  }
};
</script>

<style lang="stylus">
#d3-tree-overlay
  background-color #EEE
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
