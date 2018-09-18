<template>
  <svg
    id="sentence-tree-overlay"
    :width="width"
    :height="height"/>
</template>
<script>
import * as d3 from 'd3';
import states from './states';
import update from './utils/update';

export default {
  name: 'SentenceTree',
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
  mounted: function() {
    states.baseSvg = d3.select('#sentence-tree-overlay');
    states.svgGroup = states.baseSvg.append('g');
    this.load(states.data);
  },
  methods: {
    load: function(data) {
      states.data = data;
      if (data.children !== undefined) {
        states.root = d3.hierarchy(states.data.children[0].children[0]);
        // 设置根节点初始坐标
        states.root.x0 = states.baseSvg.node().clientWidth / 2;
        states.root.y0 = -(4 / 5 * states.baseSvg.node().clientHeight);
        update(states.root, this);
      }
    },
    sentenceClick: function(d) {
      if (states.selectedNode === d.data.index) {
        states.selectedNode = undefined;
      }
      else {
        states.selectedNode = d.data.index;
      }
      this.$emit('sentenceClick', states.data, states.selectedNode);
      update(states.root, this);
    },
  }
};
</script>

<style lang="stylus">
#sentence-tree-overlay
  background-color #EEE
.node
  text.text
    text-anchor middle
.link.selected
  stroke red
</style>
