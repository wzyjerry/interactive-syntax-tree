<template>
  <el-collapse
    :value="['common', 'intent']">
    <!-- 通用设置 -->
    <el-collapse-item
      name="common"
      title="Root Status">
      <!-- 节点类型 -->
      <el-form-item
        label="Type">
        <el-tag type="info">{{ selectedNode.data.type }}</el-tag>
      </el-form-item>
      <!-- 子节点数量 -->
      <el-form-item label="Childrens">
        <el-tag type="info">{{ childrenLength }}</el-tag>
      </el-form-item>
    </el-collapse-item>
    <!-- 兴趣列表设置 -->
    <el-collapse-item
      name="intent"
      title="Intent Settings">
      <el-form
        label-width="70px">
        <el-row
          type="flex"
          justify="end">
          <el-col :span="23">
            <el-collapse :value="['list', 'append']">
              <el-collapse-item
                name="list"
                title="Intent List">
                <el-table
                  ref="table"
                  :data="(selectedNode.children || selectedNode._children).slice(1)"
                  :stripe="true"
                  border>
                  <el-table-column
                    prop="data.intent"
                    label="Intent" />
                  <el-table-column
                    prop="data.dropout"
                    label="Dropout" />
                  <el-table-column
                    prop="data.weight"
                    label="Weight" />
                  <el-table-column
                    label="Option"
                    width="100px">
                    <template slot-scope="scope">
                      <el-button
                        :disabled="scope.$index <= 0"
                        size="mini"
                        type="success"
                        icon="el-icon-upload2"
                        circle
                        @click="itemUp(scope.$index)"/>
                      <el-button
                        :disabled="scope.$index >= childrenLength - 2"
                        size="mini"
                        type="success"
                        icon="el-icon-download"
                        circle
                        @click="itemDown(scope.$index)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item
                name="append"
                title="Append Intent">
                <el-form-item label="Intent">
                  <el-input
                    v-model="intent.intent"
                    placeholder="Intent"/>
                </el-form-item>
                <!-- 剪枝概率 -->
                <el-form-item label="Dropout">
                  <el-slider
                    v-model="intent.dropout"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    show-input/>
                </el-form-item>
                <!-- 权重 -->
                <el-form-item label="Weight">
                  <el-input-number
                    v-model="intent.weight"
                    :precision="2"
                    :step="0.01"
                    :min="0"/>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="appendIntent">Append<i class="el-icon-circle-plus-outline el-icon--right"/></el-button>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
export default {
  name: 'ControlSettingRoot',
  props: {
    selectedNode: {
      type: Object,
      default: undefined
    }
  },
  data: function() {
    return {
      intent: {
        type: 'intent',
        weight: 1.0
      }
    };
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
    itemUp: function(index) {
      if (index > 0) {
        const temp = this.selectedNode.children[index];
        this.$set(this.selectedNode.children, index, this.selectedNode.children[index + 1]);
        this.$set(this.selectedNode.children, index + 1, temp);
        this.$emit('changeIntent');
      }
    },
    itemDown: function(index) {
      if (index < this.childrenLength - 2) {
        this.itemUp(index + 1);
      }
    },
    appendIntent: function() {
      this.$emit('appendIntent', this.intent);
      this.intent = {
        type: 'intent'
      };
    }
  }
};
</script>
