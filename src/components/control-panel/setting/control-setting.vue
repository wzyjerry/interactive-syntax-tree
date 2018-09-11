<template>
  <el-form
    label-width="70px">
    <control-setting-root
      v-if="selectedNode.data.type === 'root'"
      :selected-node="selectedNode"
      @changeIntent="changeIntent"
      @appendIntent="appendIntent" />
    <control-setting-holder
      v-if="selectedNode.data.type === 'holder'"
      :selected-node="selectedNode" />
    <control-setting-intent
      v-if="selectedNode.data.type === 'intent'"
      :selected-node="selectedNode"
      @deleteNode="deleteNode" />
    <control-setting-control
      v-if="selectedNode.data.type in {'order': 1, 'pickone': 2, 'exchangeable': 3}"
      :selected-node="selectedNode"
      @copyTree="copyTree"
      @deleteNode="deleteNode" />
    <control-setting-content
      v-if="selectedNode.data.type === 'content'"
      :selected-node="selectedNode"
      @copyTree="copyTree"
      @deleteNode="deleteNode" />
  </el-form>
</template>

<script>
import ControlSettingRoot from './control-setting-root';
import ControlSettingHolder from './control-setting-holder';
import ControlSettingIntent from './control-setting-intent';
import ControlSettingControl from './control-setting-control';
import ControlSettingContent from './control-setting-content';

export default {
  name: 'ControlSetting',
  components: {
    ControlSettingRoot: ControlSettingRoot,
    ControlSettingHolder: ControlSettingHolder,
    ControlSettingIntent: ControlSettingIntent,
    ControlSettingControl: ControlSettingControl,
    ControlSettingContent: ControlSettingContent
  },
  props: {
    selectedNode: {
      type: Object,
      default: undefined
    }
  },
  methods: {
    changeIntent: function() {
      this.$emit('changeIntent');
    },
    appendIntent: function(intent) {
      this.$emit('appendIntent', intent);
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


