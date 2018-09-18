<template>
  <el-collapse
    class="tab-scroll"
    accordion
    value="download">
    <!-- 创建节点 -->
    <el-collapse-item
      name="create"
      title="Create Node">
      <control-menu-create @create="createNode" />
    </el-collapse-item>
    <!-- 上传JSON -->
    <el-collapse-item
      name="upload"
      title="Upload JSON">
      <control-menu-upload @upload="upload" />
    </el-collapse-item>
    <!-- 下载JSON -->
    <el-collapse-item
      name="download"
      title="Download JSON">
      <el-row
        type="flex"
        justify="center">
        <el-button
          type="primary"
          @click="download">Download Syntax Tree JSON<i class="el-icon-download el-icon--right"/></el-button>
      </el-row>
    </el-collapse-item>
    <!-- Debug Mode -->
    <el-collapse-item
      name="debug"
      title="Debug">
      <el-row
        type="flex"
        justify="end">
        <el-col :span="23">
          <el-form label-position="top">
            <el-form-item
              v-show="!debug"
              label="Debug Mode">
              <el-switch
                v-model="debug"
                @change="toggleDebug" />
            </el-form-item>
            <el-form-item label="Sentence">
              <control-menu-upload @upload="uploadSentence" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import ControlMenuCreate from './control-menu-create';
import ControlMenuUpload from './control-menu-upload';

export default {
  name: 'ControlMenu',
  components: {
    ControlMenuCreate: ControlMenuCreate,
    ControlMenuUpload: ControlMenuUpload
  },
  data: function() {
    return {
      newNode: {},
      debug: false
    };
  },
  methods: {
    toggleDebug: function() {
      this.$emit('toggleDebug', this.debug);
    },
    createNode: function(newNode) {
      this.$emit('createNode', newNode);
    },
    download: function() {
      this.$emit('download');
    },
    upload: function(data) {
      this.$emit('upload', data);
    },
    uploadSentence: function(data) {
      this.$emit('uploadSentence', data);
    }
  }
};
</script>
