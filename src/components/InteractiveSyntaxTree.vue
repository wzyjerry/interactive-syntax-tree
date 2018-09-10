<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <!-- 左侧树图 -->
        <el-col
          :xs="11"
          :md="14"
          :lg="17"
          :xl="20">
          <svg
            height="100vh"
            width="100%" />
        </el-col>
        <!-- 右侧控制面板 -->
        <el-col
          :xs="13"
          :md="10"
          :lg="7"
          :xl="4">
          <el-tabs
            v-model="tabs"
            type="border-card"
            @tab-remove="unClick">
            <!-- 菜单 -->
            <el-tab-pane name="menu">
              <span slot="label"><i class="el-icon-menu"/> Menu</span>
              <el-scrollbar>
                <el-collapse
                  class="tab-scroll"
                  accordion
                  value="download">
                  <!-- 创建节点 -->
                  <el-collapse-item
                    name="create"
                    title="Create Node">
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
                            </el-collapse-item>
                            <!-- 存在节点类型：高级设置 -->
                            <el-collapse-item
                              v-if="newNode.type"
                              name="advanced"
                              title="Advanced Settings">
                              <!-- 控制节点：节点权重 -->
                              <el-form-item
                                v-if="newNode.type in {'order':1, 'pickone':2, 'exchangeable':3}"
                                label="Weight">
                                <el-input-number
                                  v-model="newNode.weight"
                                  :precision="2"
                                  :step="0.01"
                                  :min="0"/>
                              </el-form-item>
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
                                  v-if="newNode.entity"
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
                                  @click="createNode">Create<i class="el-icon-success el-icon--right"/></el-button>
                              </el-row>
                            </el-collapse-item>
                          </el-collapse>
                      </el-col></el-row>
                    </el-form>
                  </el-collapse-item>
                  <!-- 上传JSON -->
                  <el-collapse-item
                    name="upload"
                    title="Upload JSON">
                    <el-row
                      type="flex"
                      justify="center">
                      <el-col :span="22">
                        <el-upload
                          ref="upload"
                          :on-change="onUpload"
                          :auto-upload="false"
                          class="upload-demo"
                          drag
                          action="#"
                          multiple>
                          <i class="el-icon-upload"/>
                          <div class="el-upload__text">Drag and drop json files there, or <em>click</em> to upload</div>
                          <div
                            slot="tip"
                            class="el-upload__tip">Tree will be merged to the root<el-button
                              style="margin-left: 10px;"
                              size="small"
                              type="success"
                              @click="load">Load Syntax Tree JSON<i class="el-icon-upload2 el-icon--right"/></el-button></div>
                        </el-upload>
                      </el-col>
                    </el-row>
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
                        @click="save">Download Syntax Tree JSON<i class="el-icon-download el-icon--right"/></el-button>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-scrollbar>
            </el-tab-pane>
            <!-- 选中节点设置 -->
            <el-tab-pane
              v-if="nodeProp && nodeProp !== root"
              closable
              name="setting">
              <span slot="label"><i class="el-icon-setting"/> Setting</span>
              <el-scrollbar>
                <el-form
                  class="tab-scroll"
                  label-width="70px">
                  <!-- 兴趣节点设置页 -->
                  <el-collapse
                    v-if="nodeProp.data.type === 'intent'"
                    :value="'intent'">
                    <el-collapse-item
                      name="intent"
                      title="Intent Settings">
                      <el-form-item label="Type">
                        <el-tag>{{ nodeProp.data.type }}</el-tag>
                      </el-form-item>
                      <el-form-item label="Name">
                        <el-input
                          v-model="nodeProp.data.name"
                          placeholder="Name"
                          clearable/>
                      </el-form-item>
                      <el-form-item label="Intent">
                        <el-input
                          v-model="nodeProp.data.intent"
                          placeholder="Intent"
                          clearable/>
                      </el-form-item>
                      <el-form-item label="Weight">
                        <el-input-number
                          v-model="nodeProp.data.weight"
                          :precision="2"
                          :step="0.01"
                          :min="0"/>
                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>
                  <el-collapse
                    v-else
                    :value="['common', 'advanced']">
                    <!-- 通用设置 -->
                    <el-collapse-item
                      name="common"
                      title="Common Settings">
                      <!-- 控制节点：节点类型 -->
                      <el-form-item
                        v-if="nodeProp.data.type in {'order':1, 'pickone':2, 'exchangeable':3}"
                        label="Type">
                        <el-radio-group
                          v-model="nodeProp.data.type">
                          <el-radio-button label="order"/>
                          <el-radio-button label="pickone"/>
                          <el-radio-button label="exchangeable"/>
                        </el-radio-group>
                      </el-form-item>
                      <!-- 内容节点：节点类型 -->
                      <el-form-item
                        v-if="nodeProp.data.type == 'content'"
                        label="Type">
                        <el-tag>{{ nodeProp.data.type }}</el-tag>
                      </el-form-item>
                      <!-- 节点名称 -->
                      <el-form-item label="Name">
                        <el-input
                          v-model="nodeProp.data.name"
                          placeholder="Name"
                          clearable/>
                      </el-form-item>
                      <!-- 剪枝概率 -->
                      <el-form-item label="Dropout">
                        <el-slider
                          v-model="nodeProp.data.dropout"
                          :min="0"
                          :max="1"
                          :step="0.01"
                          show-input/>
                      </el-form-item>
                    </el-collapse-item>
                    <!-- 高级设置 -->
                    <el-collapse-item
                      name="advanced"
                      title="Advanced Settings">
                      <!-- 控制节点：节点权重 -->
                      <el-form-item
                        v-if="nodeProp.data.type in {'order':1, 'pickone':2, 'exchangeable':3}"
                        label="Weight">
                        <el-input-number
                          v-model="nodeProp.data.weight"
                          :precision="2"
                          :step="0.01"
                          :min="0"/>
                      </el-form-item>
                      <!-- 内容节点 -->
                      <el-row v-if="nodeProp.data.type === 'content'">
                        <!-- 来自文件 -->
                        <el-form-item label="FromFile">
                          <el-switch v-model="nodeProp.data.from_file"/>
                        </el-form-item>
                        <!-- 来自文件：文件名 -->
                        <el-form-item
                          v-if="nodeProp.data.from_file"
                          label="Filename">
                          <el-input
                            v-model="nodeProp.data.filename"
                            placeholder="Filename"
                            clearable/>
                        </el-form-item>
                        <!-- 不来自文件：内容 -->
                        <el-form-item
                          v-else
                          label="Content">
                          <tag-editor :tags="nodeProp.data.content" />
                        </el-form-item>
                        <!-- 实体类型 -->
                        <el-form-item
                          v-if="nodeProp.data.entity"
                          label="Entity">
                          <el-input
                            v-model="nodeProp.data.entity"
                            placeholder="Entity"
                            clearable/>
                        </el-form-item>
                        <!-- 缺字概率 -->
                        <el-form-item label="Cut">
                          <el-slider
                            v-model="nodeProp.data.cut"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            show-input/>
                        </el-form-item>
                        <!-- 缺字概率>0：单字缺字概率 -->
                        <el-form-item
                          v-if="nodeProp.data.cut && nodeProp.data.cut>0"
                          label="WordCut">
                          <el-slider
                            v-model="nodeProp.data.word_cut"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            show-input/>
                        </el-form-item>
                      </el-row>
                    </el-collapse-item>
                    <!-- 复制子树 -->
                    <el-collapse-item
                      name="copy"
                      title="Copy Tree">
                      <el-row
                        type="flex"
                        justify="center">
                        <el-button
                          type="warning"
                          @click="copyTree">Copy<i class="el-icon-info el-icon--right"/></el-button>
                      </el-row>
                    </el-collapse-item>
                    <!-- 删除节点 -->
                    <el-collapse-item
                      name="delete"
                      title="Delete Node">
                      <el-row
                        type="flex"
                        justify="center">
                        <el-button
                          type="danger"
                          @click="deleteNode">Delete<i class="el-icon-warning el-icon--right"/></el-button>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import * as d3 from 'd3';
import $ from 'jquery';

/* TODO: 数据,之后由界面导入 */
const venue_data = require('@/assets/data/venue.json');
export default {
  name: 'InteractiveSyntaxTree',
  data: function() {
    return {
      /* 数据 */
      // 布局数据
      root: {
        'type': 'root',
        'children': [{
          'type': 'holder'
        }]
      },
      // 节点编号
      index: 0,

      /* 节点拖拽 */
      // 节点拖拽侦听
      dragListener: null,
      // 节点拖拽状态
      dragStarted: null,
      // 拖拽节点集合，包含节点的先根序列
      dragNodes: null,
      // 拖拽的节点
      draggingNode: null,
      // 目标节点
      selectedNode: null,

      /* 镜头移动 */
      // 镜头移动边界
      panBoundary: 50,
      // 镜头移动计时器设置
      panTimer: null,

      /* 画布组件 */
      // SVG画布
      baseSvg: null,
      // 交互树组件集合
      svgGroup: null,
      // 画布缩放侦听
      zoomListener: null,
      // 边产生器
      linkGenerator: null,

      /* 动画 */
      // 动画时长
      duration: 750,

      /* 节点属性 */
      // 要添加的节点
      newNode: { content: [] },
      // 当前选中的节点
      nodeProp: null,
      // 当前选项卡
      tabs: 'menu',
      // 上传文件列表
      uploadFiles: null
    };
  },
  computed: {
    holder: function() {
      return this.root.children[0];
    }
  },
  watch: {
    nodeProp: {
      handler: function(val) {
        this.update(this.root);
        if (val !== null) {
          this.centerNode(val);
          if (val === this.root) {
            this.tabs = 'menu';
          }
          else {
            this.tabs = 'setting';
          }
        }
      },
      deep: true
    }
  },
  mounted: function() {
    const vue = this;
    this.zoomListener = d3.zoom()
      .scaleExtent([0.5, 4])
      .on('zoom', this.zoom);
    this.baseSvg = d3.select('svg')
      .attr('class', 'overlay')
      .call(this.zoomListener)
      .on('dblclick.zoom', null);
    this.linkGenerator = d3.linkHorizontal()
      .x(function(d) {
        return d.y;
      })
      .y(function(d) {
        return d.x;
      });
    this.dragListener = d3.drag()
      // 标记拖拽开始
      .on('start', function(d) {
        vue.dragStarted = true;
        vue.dragNodes = d.descendants();
        // 阻止事件传播 https://stackoverflow.com/questions/10095979/d3-click-and-drag-event-nesting
        d3.event.sourceEvent.stopPropagation();
      })
      // 拖拽中，处理镜头移动
      .on('drag', function(d) {
        if (vue.dragStarted) {
          vue.dragStart(d, this);
        }
        // 获取相对画布的鼠标坐标
        const relCoords = d3.mouse($('svg').get(0));
        let direction = null;
        let panSpeed = null;
        if (relCoords[0] < vue.panBoundary) {
          direction = 'left';
          panSpeed = vue.panBoundary - relCoords[0];
        }
        else if (relCoords[0] > $('svg').width() - vue.panBoundary) {
          direction = 'right';
          panSpeed = relCoords[0] - $('svg').width() + vue.panBoundary;
        }
        else if (relCoords[1] < vue.panBoundary) {
          direction = 'up';
          panSpeed = vue.panBoundary - relCoords[1];
        }
        else if (relCoords[1] > $('svg').height() - vue.panBoundary) {
          direction = 'down';
          panSpeed = relCoords[1] - $('svg').height() + vue.panBoundary;
        }
        else {
          clearTimeout(vue.panTimer);
        }
        if (direction !== null) {
          panSpeed = d3.min([1000, panSpeed]);
          vue.pan(direction, panSpeed / 10);
        }
        d.x0 += d3.event.dy;
        d.y0 += d3.event.dx;
        const node = d3.select(this);
        node.attr('transform', `translate(${d.y0}, ${d.x0})`);
        vue.updateTempConnector();
      })
      // 拖拽结束
      .on('end', function() {
        if (vue.draggingNode === null) {
          return;
        }
        if (vue.selectedNode) {
          // 将节点从父节点上摘除，挂载到新节点上
          const index = vue.draggingNode.parent.children.indexOf(vue.draggingNode);
          if (index > -1) {
            vue.draggingNode.parent.children.splice(index, 1);
            if (!vue.draggingNode.parent.children.length) {
              delete vue.draggingNode.parent.children;
            }
          }
          if (vue.selectedNode.children) {
            vue.selectedNode.children.push(vue.draggingNode);
          }
          else if (vue.selectedNode._children) {
            vue.selectedNode._children.push(vue.draggingNode);
          }
          else {
            vue.selectedNode.children = [];
            vue.selectedNode.children.push(vue.draggingNode);
          }
          vue.draggingNode.parent = vue.selectedNode;
          // 更新Node信息
          vue.updateHierarchy();
          vue.expand(vue.selectedNode);
          vue.sortTree();
        }
        clearTimeout(vue.panTimer);
        vue.dragEnd(vue.draggingNode.parent, this);
      });
    this.svgGroup = this.baseSvg.append('g');
    this.root = d3.hierarchy(this.root);
    // 设置根节点初始坐标
    this.root.x0 = 0;
    this.root.y0 = $(this.baseSvg.node()).width() / 2;
    this.upload(this, venue_data);
    this.$set(this, 'nodeProp', this.root);
  },
  methods: {
    // 更新json
    upload: function(vue, data) {
      if (data.type === 'root' && data.children) {
        data.children.forEach(function(child) {
          if (child.type === 'holder') {
            if (child.children) {
              child.children.forEach(function(root) {
                vue.addTree(root);
              });
            }
          }
          else if (child.type === 'intent') {
            child.children.forEach(function(root) {
              vue.addTree(root, child);
            });
          }
        });
      }
    },
    // 更新文件列表
    onUpload: function(file, fileList) {
      this.uploadFiles = fileList;
    },
    // 上传文件
    load: function() {
      if (this.uploadFiles) {
        const loadFile = function(e) {
          try {
            const document = JSON.parse(e.target.result);
            this.upload(this, document);
          }
          catch (err) {
            return;
          }
        };
        for (let i = 0; i < this.uploadFiles.length; i++) {
          const file = this.uploadFiles[i];
          if (file) {
            const reader = new FileReader();
            reader.onload = loadFile;
            reader.readAsText(file.raw);
          }
        }
        this.$refs.upload.clearFiles();
      }
    },
    // 挂载新树到指定intent
    addTree: function(data, intent) {
      let node = null;
      this.expand(this.root);
      let parent = null;
      this.root.children.forEach(function (child) {
        if (intent && child.data.intent === intent.intent) {
          parent = child;
        }
      });
      if (intent) {
        if (parent === null) {
          const intent_data = {
            'type': 'intent',
            'name': intent.name,
            'weight': intent.weight,
            'children': [data]
          };
          node = d3.hierarchy(intent_data);
          parent = this.root;
        }
      }
      else {
        parent = this.holder;
        node = d3.hierarchy(data);
      }
      this.expand(parent);
      node.parent = parent;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
      this.updateHierarchy();
      this.$set(this, 'nodeProp', node);
    },
    // 复制子树
    copyTree: function() {
      this.addTree(this.generateJSON(this.nodeProp));
    },
    // 删除节点
    deleteNode: function() {
      const parent = this.nodeProp.parent;
      const index = parent.children.indexOf(this.nodeProp);
      if (index > -1) {
        parent.children.splice(index, 1);
        if (!parent.children.length) {
          delete parent.children;
        }
      }
      this.$set(this, 'nodeProp', null);
      this.centerNode(parent);
      this.tabs = 'menu';
    },
    // 取消选中
    unClick: function() {
      this.$set(this, 'nodeProp', null);
      this.tabs = 'menu';
    },
    // 添加节点
    createNode: function() {
      // 节点类型检查
      if (this.newNode.type && this.newNode.type in {
        'order': 1,
        'pickone': 2,
        'exchangeable': 3,
        'content': 4
      }) {
        this.addTree(this.newNode);
        this.newNode = { content: [] };
      }
    },
    updateHierarchy: function() {
      const update = function(d, depth) {
        d.depth = depth;
        const children = d.children || d._children;
        if (children && children.length) {
          d.height = d3.max(children.map(function(child) {
            return update(child, depth + 1);
          })) + 1;
        }
        else {
          d.height = 0;
        }
        return d.height;
      };
      update(this.root, 0);
    },
    // 排序树，按节点相对父节点的极坐标夹角排序
    sortTree: function() {
      this.root.sort(function(a, b) {
        const ax = a.x0 - a.parent.x0;
        const ay = Math.abs(a.y0 - a.parent.y0);
        const bx = b.x0 - b.parent.x0;
        const by = Math.abs(b.y0 - b.parent.y0);
        return (ax / ay) - (bx / by);
      });
    },
    // 镜头移动：当拖动元素到达边界区时
    pan: function(direction, panSpeed) {
      clearTimeout(this.panTimer);
      const vue = this;
      let dx = 0,
        dy = 0;
      switch (direction) {
      case 'left':
        dx = +panSpeed;
        break;
      case 'right':
        dx = -panSpeed;
        break;
      case 'up':
        dy = +panSpeed;
        break;
      case 'down':
        dy = -panSpeed;
        break;
      default:
        break;
      }
      this.zoomListener.translateBy(this.baseSvg.transition().duration(50), dx, dy);
      this.panTimer = setTimeout(function() {
        vue.pan(direction, panSpeed);
      }, 50);
    },
    // 添加选中节点到拖拽节点的临时连线
    updateTempConnector: function() {
      let data = [];
      if (this.draggingNode !== null && this.selectedNode !== null) {
        data = [{
          source: {
            'x': this.selectedNode.x0,
            'y': this.selectedNode.y0
          },
          target: {
            'x': this.draggingNode.x0,
            'y': this.draggingNode.y0
          }
        }];
      }
      const link = this.svgGroup.selectAll('.tempLink').data(data);
      // Enter
      link.enter()
        .append('path')
        .attr('class', 'tempLink')
        .attr('d', this.linkGenerator)
        .attr('pointer-events', 'none');
      // Update
      link.attr('d', this.linkGenerator);
      // Exit
      link.exit()
        .remove();
    },
    // 展开节点
    expand: function(d) {
      if (d._children) {
        d.children = d._children;
        delete d._children;
      }
    },
    // 初始化拖动事件
    dragStart: function(d, domNode) {
      const vue = this;
      this.draggingNode = d;
      // 阻止拖拽节点的交互圈鼠标事件
      d3.select(domNode).select('.ghostCircle')
        .attr('pointer-events', 'none');
      // 添加交互圈show class
      d3.selectAll('.ghostCircle')
        .attr('class', 'ghostCircle show');
      // 添加拖拽节点的activeDrag class
      domNode.classList.add('activeDrag');
      // 将不是选中节点的节点下放
      this.svgGroup.selectAll('g.node')
        .sort(function(a) {
          if (a.id !== vue.draggingNode.id) {
            return 1;
          }
          return -1;
        });
      // 如果选中节点有子节点，删除边和节点
      if (this.dragNodes.length > 1) {
        // 删除边
        const links = d.links();
        this.svgGroup.selectAll('path.link')
          .data(links, function(link) {
            return link.target.id;
          })
          .remove();
        // 删除点
        this.svgGroup.selectAll('g.node')
          .data(this.dragNodes.slice(1), function(node) {
            return node.id;
          })
          .remove();
      }
      // 删除到父节点的连线
      this.svgGroup.selectAll('path.link')
        .filter(function(link) {
          if (link.target.id === vue.draggingNode.id) {
            return true;
          }
          return false;
        })
        .remove();
      this.dragStarted = null;
    },
    dragEnd: function(d, domNode) {
      this.selectedNode = null;
      // 去除交互圈show class
      d3.selectAll('.ghostCircle')
        .attr('class', 'ghostCircle');
      // 去除选中节点的activeDrag class
      domNode.classList.remove('activeDrag');
      // 恢复鼠标事件
      d3.select(domNode).select('.ghostCircle')
        .attr('pointer-events', '');
      this.updateTempConnector();
      if (this.draggingNode !== null) {
        this.update(d);
        this.centerNode(this.draggingNode);
        this.draggingNode = null;
      }
    },
    click: function(d) {
      if (d3.event.defaultPrevented) {
        return;
      }
      this.$set(this, 'nodeProp', d);
    },
    dblClick: function(d) {
      if (d3.event.defaultPrevented) {
        return;
      }
      if (d.children || d._children) {
        if (d.children) {
          d._children = d.children;
          delete d.children;
        }
        else {
          d.children = d._children;
          delete d._children;
        }
        this.update(d);
        this.centerNode(d);
      }
    },
    // 移动到交互圈内
    ghostOver: function(node) {
      this.selectedNode = node;
      this.updateTempConnector();
    },
    // 移动出交互圈
    ghostOut: function() {
      this.selectedNode = null;
      this.updateTempConnector();
    },
    // 更新树显示
    update: function(source) {
      // 保存外部this
      const vue = this;
      // 获取节点数组和边数组
      const nodes = vue.root.descendants();
      const links = vue.root.links();
      // 计算最大标签长度
      const labelLength = [];
      nodes.forEach(function(d) {
        labelLength.push((d.data.name || d.data.type).length);
      });
      const maxLabelLength = d3.max(labelLength);
      // 配置树布局产生器，节点高度根据最大标签长度计算，宽度固定为25像素
      const tree = d3.tree()
        .nodeSize([25, maxLabelLength * 8]);
      // 布局
      this.root = tree(this.root);
      // 删除选中点
      this.svgGroup.selectAll('g.node .selectCircle').remove();
      /* 绘制节点 */
      const node = this.svgGroup.selectAll('g.node')
        .data(nodes, function(d) {
          return d.id || (d.id = ++vue.index);
        });
      // Enter
      const nodeEnter = node.enter()
        .append('g')
        .call(vue.dragListener)
        .attr('transform', function() {
          return `translate(${source.y0}, ${source.x0})`;
        })
        .on('click', this.click)
        .on('dblclick', this.dblClick);
      // 绘制初始节点
      nodeEnter.append('circle')
        .attr('r', 0);
      // 绘制初始文字
      nodeEnter.append('text')
        .style('fill-opacity', 0);
      // 绘制交互圈
      nodeEnter.filter(function(d) {
        return d.data.type !== 'content' && d.data.type !== 'root';
      })
        .append('circle')
        .attr('class', 'ghostCircle')
        .attr('r', 40)
        .attr('pointer-events', 'mouseover')
        .on('mouseover', this.ghostOver)
        .on('mouseout', this.ghostOut);
      // Update
      let nodeUpdate = nodeEnter.merge(node)
        .attr('class', function(d) {
          return `node ${d.data.type}${d._children ? ' collapsed' : ''}`;
        });
      // 绘制选中点
      nodeUpdate.filter(function(d) {
        return d === vue.nodeProp;
      }).append('circle')
        .attr('class', 'selectCircle')
        .attr('r', 0.75);
      // 删除部分点的拖动事件
      nodeUpdate.filter(function(d) {
        return d.data.type in {
          'root': 1,
          'holder': 2,
          'intent': 3
        };
      }).on('.drag', null);
      // 立即更新文字位置
      nodeUpdate.select('text')
        .text(function(d) {
          return d.data.name || d.data.type;
        })
        .attr('x', function(d) {
          return d.children || d._children ? -8 : 8;
        })
        .attr('dy', function(d) {
          return d.children || d._children ? -3.5 : 8.5;
        })
        .attr('class', function(d) {
          return d.children || d._children ? 'internal' : 'leaf';
        });
      nodeUpdate = nodeUpdate.transition()
        .duration(this.duration)
        .attr('transform', function(d) {
          return `translate(${d.y}, ${d.x})`;
        });
      // 调整节点大小
      nodeUpdate.select('circle')
        .attr('r', 5);
      // 调整文字透明度
      nodeUpdate.select('text')
        .style('fill-opacity', 1);
      // Exit
      const nodeExit = node.exit()
        .transition()
        .duration(this.duration)
        .attr('transform', function() {
          return `translate(${source.y}, ${source.x})`;
        })
        .remove();
      // 缩小节点
      nodeExit.select('circle')
        .attr('r', 0);
      // 隐藏文字
      nodeExit.select('text')
        .style('fill-opacity', 0);

      /* 绘制边 */
      const link = this.svgGroup.selectAll('path.link')
        .data(links, function(d) {
          return d.target.id;
        });
      // Enter
      const linkEnter = link.enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function() {
          const pos = {
            'x': source.x0,
            'y': source.y0
          };
          return vue.linkGenerator({
            'source': pos,
            'target': pos
          });
        });
      // Update
      linkEnter.merge(link)
        .transition()
        .duration(this.duration)
        .attr('d', this.linkGenerator);
      // Exit
      link.exit()
        .transition()
        .duration(this.duration)
        .attr('d', function() {
          const pos = {
            'x': source.x,
            'y': source.y
          };
          return vue.linkGenerator({
            'source': pos,
            'target': pos
          });
        })
        .remove();
      // 保存当前坐标
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    // 将节点居中显示
    centerNode: function(node) {
      this.baseSvg.transition()
        .duration(this.duration)
        .call(this.zoomListener.translateTo, node.y0, node.x0)
        .transition()
        .call(this.zoomListener.scaleTo, 2);
    },
    // 缩放平移变换事件
    zoom: function() {
      this.svgGroup.attr('transform', d3.event.transform);
    },
    // 根据当前布局数据生成对应的JSON Object
    generateJSON: function(d) {
      const vue = this;
      const result = {};
      Object.assign(result, d.data);
      for (const key in result) {
        if (result[key] === null || result[key] === undefined || result[key] === '') {
          delete result[key];
        }
      }
      const children = d.children || d._children;
      if (children) {
        result.children = [];
        children.forEach(function(child) {
          result.children.push(vue.generateJSON(child));
        });
      }
      return result;
    },
    save: function() {
      const data = this.generateJSON(this.root);
      const temp = document.createElement('a');
      temp.download = 'syntaxTree.json';
      temp.href = URL.createObjectURL(new Blob([JSON.stringify(data)]));
      document.body.appendChild(temp);
      temp.click();
      document.body.removeChild(temp);
    }
  }
};

</script>

<style lang="stylus">
*
  margin:0
  padding:0
  vertical-align: bottom
.tab-scroll
  max-height: calc(100vh - 74px)
  padding-right: 10px
.el-scrollbar__bar.is-horizontal
  display: none
.overlay
  background-color: #EEE
circle
  stroke-width: 1.5px
.root
  circle
    fill: #DCDFE6
    stroke: #C0C4CC
.holder
  circle
    fill: #E8D596
    stroke: #D5A179
.intent
  circle
    fill: #DCB5FF
    stroke: #BE77FF
.order
  circle
    fill: #D9EDF7;
    stroke: #5BC0DE
.pickone
  circle
    fill: #F2DEDE;
    stroke: #D9534F
.exchangeable
  circle
    fill: #FCF8E3;
    stroke: #F0AD4E
.content
  circle
    fill: #DFF0D8
    stroke: #5CB85C
.collapsed
  circle
    fill: #FFF
.node
  cursor: pointer
  text
    font: 10px sans-serif
    &.internal
      text-anchor: end
    &.leaf
      text-anchor: start
.link
  fill: none
  stroke: #555
  stroke-width: 1.5px
  stroke-opacity: 0.4
.tempLink
  fill: none
  stroke: red
  stroke-width: 3px
  stroke-opacity: 0.5
.ghostCircle
  &.show
    opacity: 0.2
    display: block
  display: none
.activeDrag
  .ghostCircle
    display: none
#app
  .el-main
    padding: 0 20px
</style>
