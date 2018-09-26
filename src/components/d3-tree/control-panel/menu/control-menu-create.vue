<template>
  <el-form
    label-width="70px">
    <el-row
      type="flex"
      justify="end">
      <el-col :span="23">
        <el-collapse :value="['common', 'advanced', 'create']">
          <!-- 通用设置 -->
          <el-collapse-item
            name="common"
            title="Common Settings">
            <!-- 节点类型 -->
            <el-form-item label="Type">
              <el-select
                v-model="newNode.type"
                placeholder="Type">
                <el-option value="order"/>
                <el-option value="pickone"/>
                <el-option value="exchangeable"/>
                <el-option value="content"/>
              </el-select>
            </el-form-item>
            <!-- 节点名称 -->
            <el-form-item label="Name">
              <el-input
                v-model="newNode.name"
                placeholder="Name"
                clearable/>
            </el-form-item>
            <!-- 剪枝概率 -->
            <el-form-item label="Dropout">
              <el-slider
                v-model="newNode.dropout"
                :min="0"
                :max="1"
                :step="0.01"
                show-input/>
            </el-form-item>
            <!-- 节点权重 -->
            <el-form-item label="Weight">
              <el-input-number
                v-model="newNode.weight"
                :precision="2"
                :step="0.01"
                :min="0"/>
            </el-form-item>
          </el-collapse-item>
          <!-- 存在节点类型：高级设置 -->
          <el-collapse-item
            v-if="newNode.type"
            name="advanced"
            title="Advanced Settings">
            <!-- 内容节点 -->
            <el-row v-if="newNode.type === 'content'">
              <!-- 来自文件 -->
              <el-form-item label="FromFile">
                <el-switch v-model="newNode.from_file"/>
              </el-form-item>
              <!-- 来自文件：文件名 -->
              <el-form-item
                v-if="newNode.from_file"
                label="Filename">
                <el-input
                  v-model="newNode.filename"
                  placeholder="Filename"
                  clearable/>
              </el-form-item>
              <!-- 不来自文件：内容 -->
              <el-form-item
                v-else
                label="Content">
                <tag-editor :tags="newNode.content" />
              </el-form-item>
              <!-- 实体类型 -->
              <el-form-item
                label="Entity">
                <el-input
                  v-model="newNode.entity"
                  placeholder="Entity"
                  clearable/>
              </el-form-item>
              <!-- 缺字概率 -->
              <el-form-item label="Cut">
                <el-slider
                  v-model="newNode.cut"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  show-input/>
              </el-form-item>
              <!-- 缺字概率>0：单字缺字概率 -->
              <el-form-item
                v-if="newNode.cut && newNode.cut>0"
                label="WordCut">
                <el-slider
                  v-model="newNode.word_cut"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  show-input/>
              </el-form-item>
            </el-row>
          </el-collapse-item>
          <!-- 添加节点 -->
          <el-collapse-item
            v-if="newNode.type"
            name="create"
            title="Create Node">
            <el-row
              type="flex"
              justify="center">
              <el-button
                type="success"
                @click="create">Create<i class="el-icon-success el-icon--right"/></el-button>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import TagEditor from '@/components/tag-editor/tag-editor';
export default {
  name: 'ControlMenuCreate',
  components: {
    TagEditor: TagEditor
  },
  data: function() {
    return {
      newNode: {
        content: []
      }
    };
  },
  methods: {
    create: function() {
      this.$emit('create', this.newNode);
      this.newNode = {
        content: []
      };
    }
  }
};
</script>
