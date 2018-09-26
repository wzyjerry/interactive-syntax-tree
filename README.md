# interactive-syntax-tree

交互语法树

项目部署在[GitPage](https://wzyjerry.github.io/interactive-syntax-tree/dist/#/), 版本号1.0.0

---
## 定义

一棵语法树可以用来描述句子的产生规则，配合句子模拟器可以生成若干模拟句子

语法树是一棵有序树，即交换语法树的各个子树可能导致语义变化

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
        * "type": < "order" | "pickone" | "exchangeable" >
            - order：顺序节点，模拟器按顺序产生每个子节点内容，顺序连接
            - pickone：选择节点，模拟器从子节点中选择一个节点生成内容
            - exchangeable：可换节点，模拟器按顺序产生每个子节点内容，shuffle这些内容后连接
        * "name": （可选）节点的显示名称
        * "dropout": （可选）模拟器生成内容时以多大概率剪枝。[0, 1]，默认值为0
        * "weight": （当父节点type为pickone或intent时有效，可选）以多大权重生成对应分支的内容。默认值为1.0
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
        ```
4. 语法树包含内容节点
    + 说明：内容节点包含实际产生的内容，可由文件或标签定义
    + 定义：
        * "type": "content"
        * "from_file": < true | false >
            - true：来自文件，模拟器从指定文件获取内容，取每行split后的第一个单词，模拟器从这些单词中选取一个作为生成的内容
            - false：来自标签，模拟器从指定的标签列表中随机选取一个作为生成的内容
        * "filename": （当且仅当from_file为true时存在），加载的文件名
        * "content": （当且仅当from_file为false时存在），内容节点的内容，字符串数组
        * "entity": （可选）对应实体类型。如果该键不存在则默认为"O"类型（Other）
        * "name": （可选）节点的显示名称
        * "weight": （当父节点type为pickone或intent时有效，可选）以多大权重生成对应分支的内容。默认值为1.0
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
10. （***）从JSON文件生成模拟语料（完成）
11. (***)每个Intent对应一棵独立的tree（完成）
12. (***)Debug（完成）

---
# 使用说明
通过交互操作生成规则语法树，下载语法树json文件，利用[句子模拟器](https://github.com/wzyjerry/sentence-simulator)生成模拟句子
1. 初始界面分为左侧树界面与右侧控制界面，树界面初始包含两个节点：灰色root根节点与棕色holder超根节点。根节点用来挂载所有的兴趣节点与超根节点（作为特殊的兴趣节点），超根节点用来挂载所有未明确定义兴趣的节点
2. 创建兴趣节点：要开始创建一棵新的规则语法树，首先应该创建一个紫色兴趣节点。兴趣节点用来标明所生成句子的兴趣。按照如下步骤创建一个紫色兴趣节点：
    1. 点击灰色根节点
    2. 在右侧Setting面板中找到Intent Settings - Append Intent
    3. 设置兴趣名称
    4. 设置生成属于该兴趣句子的权重
    5. 点击Append完成兴趣节点的创建
    > 新创建的兴趣节点会添加到兴趣列表的尾端，可通过Intent List改变兴趣节点顺序
3. 创建控制节点：句子模拟器模拟生成句子时依据控制节点来改变模拟行为。语法树包含三种控制节点：蓝色顺序选择节点、红色选择节点和黄色可换节点
    >- order：顺序节点，模拟器按顺序产生每个子节点内容，顺序连接
    >- pickone：选择节点，模拟器从子节点中选择一个节点生成内容
    >- exchangeable：可换节点，模拟器按顺序产生每个子节点内容，shuffle这些内容后连接

    按照如下步骤创建一个控制节点：
    1. 在右侧Menu面板中找到Create Node
    2. 在Common Settings - Type中设定控制节点类型
    3. （可选）给控制节点命名
    4. （可选）调整dropout，标明你希望该控制节点以多大概率被剪枝，默认值为0.
    5. （可选）设置weight，该值仅当父节点类型为intent或pickone时有效，标明你希望以多大权重来生成该分支下的内容，默认值为1（有效时）
    6. 点击Create完成控制节点的创建
    > 新创建的控制节点会挂载到棕色超根节点的尾端
4. 创建内容节点：句子模拟器根据绿色内容节点来生成句子的内容。绿色内容节点是语法树的叶节点。按照如下步骤创建一个绿色内容节点：
    1. 在右侧Menu面板中找到Create Node
    2. 在Common Settings - Type中设置节点类型为content
    3. （可选）给控制节点命名
    4. （可选）调整dropout，标明你希望该控制节点以多大概率被剪枝，默认值为0
    5. （可选）设置weight，该值仅当父节点类型为intent或pickone时有效，标明你希望以多大权重来生成该分支下的内容，默认值为1（有效时）
    6. 选择内容来源：是否来自文件
        1. 设置为来自文件时，应给出内容的文件名。文件包含若干行，每行包含一个内容和内容出现的词频
            > 最后一个分隔符后的内容被认为是内容出现的词频
        2. 设置为不来自文件时，可以通过点击New Tag并输入内容来添加一个tag，或点击tag上的x符号来删除某个tag
    7. （可选）设置cut，标明你希望生成的内容以何种概率缺字，默认值为0
        * 当cut > 0时，设置WordCut，标明你希望以何种概率删除内容中的每个字符，默认值为0
    8. 点击Create完成控制节点的创建
    > 新创建的内容节点会挂载到棕色超根节点的尾端
5. 拖动节点来改变树结构：新创建的节点会被挂载到棕色超根节点下，可以使用拖动来改变树结构。
    1. 拖动要改变的节点
    2. 该节点会被临时收起，该节点与父节点的连线也会临时删除
    3. 所有可以挂载该节点的节点会显示交互圈
    4. 拖动节点到交互圈上会显示红色连接线
    5. 结束拖动
        1. 不存在红色连接线时，恢复原结构，且居中被拖动节点，并缩放至2倍大小
        2. 存在红色连接线时，将拖动节点挂载至对应节点上，子节点顺序按结束拖动时子节点相对父节点夹角决定
    >* 只有控制节点和叶节点可被拖动
    >* 只有兴趣节点和控制节点可挂载节点
6. 查看 - 修改节点属性：可以通过点击节点来查看和修改节点属性
    1. 点击要查看 - 修改的节点
    2. 选中的节点会在节点上显示点标记，并居中放大至2倍
    3. 在右侧Setting面板中查看与修改节点的属性
    > 只能在同类节点中切换节点类别。具体来说，只有控制节点可以在三种类型间切换
7. 语法树操作
    1. 滚轮缩放
    2. 双击切换展开/折叠状态
    3. 点击拖动
8. 导出树文件
    1. 在右侧Menu面板中找到Download JSON
    2. 点击Download Syntax Tree JSON
    > 该文件可用于[句子模拟器](https://github.com/wzyjerry/sentence-simulator)
9. 导入树文件
    1. 在右侧Menu面板中找到Upload JSON
    2. 点击或拖动json文件到上传面板完成导入
    > 仅保证导入由模拟器生成的调试树和由导出树导出文件时的行为
10. 调试树
    1. 要展示生成路径，首先需要由[句子模拟器](https://github.com/wzyjerry/sentence-simulator)生成一棵调试树和一个句子的调试输出
    2. 通过导入树导入调试树
    3. 在右侧Menu面板中找到Debug，打开Debug Mode开关
    4. 点击或拖动json文件到上传面板完成句子导入
    5. 点击新出现面板中的节点，会在上方树面板展示句子生成路径
    > 该功能行为还未最终确定