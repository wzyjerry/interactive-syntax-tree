<template>
  <el-row
    type="flex"
    justify="center">
    <el-col :span="22">
      <el-upload
        ref="upload"
        :on-change="load"
        :auto-upload="false"
        class="upload-demo"
        drag
        action="#"
        multiple>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">Drag and drop json files there, or <em>click</em> to upload</div>
      </el-upload>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ControlMenuUpload',
  methods: {
    load: function(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this.$emit('upload', data);
        }
        catch (err) {
          return;
        }
      };
      reader.readAsText(file.raw);
      this.$refs.upload.clearFiles();
    }
  }
};
</script>
