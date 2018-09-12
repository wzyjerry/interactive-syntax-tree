# interactive-syntax-tree

交互语法树

项目部署在[GitPage](https://wzyjerry.github.io/interactive-syntax-tree/dist/#/), 版本号0.6.0 [内容节点添加权重]

---
## 定义

一棵语法树可以用来描述句子的产生规则，配合句子模拟器可以生成若干模拟句子。

语法树是一棵有序树，即交换语法树的各个子树可能导致语义变化。

0. 语法树包含1个根节点
    + 说明：根节点用来标识一棵语法树
    + 定义：
        * "type": "root"
        * "children": 兴趣节点集合
    + 节点颜色：灰色
    + 约束：根节点子节点集合中包含1个超根节点和0个或多个子节点，每个子节点代表一种提问兴趣
    + 样例：
        ``` json
        {
          "type": "root",
          "children": [
            {
              "type": "holder",
              "children": []
            }, {
              "type": "intent",
              "intent": "搜会议",
              "weight": 0.25,
              "children": []
            }
          ]
        }
        ```
1. 语法树包含1个超根节点
    + 说明：超根节点用于挂载所有未标明兴趣的节点，作为复制子树和新建节点的挂载点
    + 定义：
        * "type": "holder"
        * "children": 未标明兴趣的节点集合
    + 节点颜色：棕色
    + 约束：一棵语法树包含且只包含1个超根节点，超根节点的父节点是根节点
    + 样例：
        ``` json
        {
          "type": "holder",
          "children": []
        }
        ```
2. 语法树包含0个或多个兴趣节点
    + 说明：兴趣节点用于标明生成规则对应的兴趣
    + 定义：
        * "type": "intent"
        * "intent": 对应语法树生成句子的意图
        * "weight": 以多大权重生成对应语法的句子。默认值为1.0
        * "children": 规则节点的集合
    + 节点颜色：紫色
    + 约束：一棵语法树包含的意图互不相同
    + 样例：
        ``` json
        {
          "type": "intent",
          "intent": "搜会议",
          "weight": 0.25,
          "children": []
        }
        ```
3. 语法树包含控制节点
    + 说明：控制节点用于控制模拟器行为
    + 定义：
        * "type": < "pickone" | "order: | "exchangeable" >
            - pickone：选择节点，模拟器从子节点中选择一个节点生成内容
            - order：顺序节点，模拟器按顺序产生每个子节点内容，顺序连接。
            - exchangeable：可换节点，模拟器按顺序产生每个子节点内容，shuffle这些内容后连接。
        * "name": （可选）节点的显示名称
        * "dropout": （可选）模拟器生成内容时以多大概率剪枝。[0, 1]，默认值为0
        * "weight": （当且仅当父节点type为pickone时有效，可选）以多大权重生成对应分支的内容。默认值为1.0
        * "children": 子节点集合
    + 节点颜色：
        * pickone：选择节点，红色
        * order：顺序节点，蓝色
        * exchangeable：可换节点，黄色
    + 约束：控制节点一般不为叶节点
    + 样例：
        ``` json
        {
          "type": "pickone",
          "name": "选取一条规则",
          "dropout": 0.5,
          "children": [{
            "type": "order",
            "name": "规则1",
            "weight": 0.5,
            "children": []
          }, {
            "type": "exchangeable",
            "name": "规则2",
            "weight": 1.5,
            "children": []
          }]
        }
4. 语法树包含内容节点
    + 说明：内容节点包含实际产生的内容，可由文件或标签定义
    + 定义：
        * "type": "content"
        * "from_file": < true | false >
            - true：来自文件，模拟器从指定文件获取内容，取每行split后的第一个单词，模拟器从这些单词中选取一个作为生成的内容
            - false：来自标签，模拟器从指定的标签列表中随机选取一个作为生成的内容
        * "filename": （当且仅当from_file为true时存在），加载的文件名。
        * "content": （当且仅当from_file为false时存在），内容节点的内容，字符串数组。
        * "entity": （可选）对应实体类型。如果该键不存在则默认为"O"类型（Other）
        * "name": （可选）节点的显示名称
        * "weight": （当且仅当父节点type为pickone时有效，可选）以多大权重生成对应分支的内容。默认值为1.0
        * "dropout": （可选）模拟器生成内容时以多大概率剪枝。[0, 1]，默认值为0
        * "cut": （可选）模拟器生成内容时该内容缺字的概率。[0, 1]，默认值为0
        * "word_cut": （当且仅当cut > 0时存在），对于每个字符，有多大概率删除该字符。[0, 1]，默认值为0
    + 节点颜色：绿色
    + 样例：
        ``` json
        {
          "type": "content",
          "from_file": false,
          "dropout": 0.2,
          "content": [
            "给我",
            "想找",
            "想要",
            "想要找",
            "查",
            "查询",
            "检索",
            "显示",
            "展示",
            "查找"
          ]
        }
        ```
---
## 样例

一个生成询问会议的语法树的JSON示例：

``` json
{
  "type": "root",
  "children": [{
    "type": "holder",
    "children": []
  }, {
    "type": "intent",
    "intent": "venue",
    "weight": 0.2,
    "children": [{
      "type": "order",
      "name": "ask_venue_root",
      "children": [{
        "type": "order",
        "name": "search_node",
        "children": [{
          "type": "content",
          "from_file": false,
          "dropout": 0.2,
          "content": [
            "给我",
            "想找",
            "想要",
            "想要找",
            "查",
            "查询",
            "检索",
            "显示",
            "展示",
            "查找"
          ]
        }, {
          "type": "content",
          "from_file": false,
          "dropout": 0.3,
          "content": [
            "一些",
            "一组",
            "一批",
            "几个"
          ]
        }]
      }, {
        "type": "pickone",
        "name": "ex_keyword_node",
        "children": [{
          "type": "order",
          "children": [{
            "type": "content",
            "from_file": false,
            "content": [
              "有关",
              "关于"
            ]
          }, {
            "type": "content",
            "from_file": true,
            "filename": "aminer_keywords_zh.txt",
            "entity": "KEY",
            "name": "keyword_node"
          }, {
            "type": "content",
            "from_file": false,
            "content": [
              "方面",
              "方向",
              "领域"
            ]
          }, {
            "type": "content",
            "from_file": false,
            "content": [ "的" ]
          }]
        }, {
          "type": "order",
          "children": [{
            "type": "content",
            "from_file": false,
            "content": [
              "和",
              "与"
            ]
          }, {
            "type": "content",
            "from_file": true,
            "filename": "aminer_keywords_zh.txt",
            "entity": "KEY",
            "name": "keyword_node"
          }, {
            "type": "content",
            "from_file": false,
            "content": [
                "相关",
                "有关"
            ]
          }, {
            "type": "content",
            "from_file": false,
            "content": [ "的" ]
          }]
        }]
      }, {
        "type": "content",
        "from_file": false,
        "content": [
          "期刊",
          "会议"
        ]
      }]
    }]
  }]
}
```
# 需求（*少的为主要功能）
1. （*）以树图形式展示JSON内容（完成）
2. （*）导入JSON文件（完成）
2. （*）将树图结果保存为JSON文件(完成)
3. （*）可展开/折叠单个节点（完成）
4. （**）可整体拖动（完成）
5. （**）可缩放显示（完成）
6. （**）可拖动节点改变顺序（完成）
7. （**）支持语法树森林（提供检查）
8. （***）可编辑节点内容（完成）
9. （***）可拷贝子树（完成）
10. （***）从JSON文件生成模拟语料
11. (***)每个Intent对应一棵独立的tree