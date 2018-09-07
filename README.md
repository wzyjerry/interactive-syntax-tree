# interactive-syntax-tree

交互语法树

项目部署在[GitPage](https://wzyjerry.github.io/interactive-syntax-tree/dist/#/), 版本号0.1.0 [完成拖拽]

---
## 定义

一棵语法树可以用来描述句子的产生规则，配合句子模拟器可以生成若干模拟句子。

语法树是一棵有序树，即交换语法树的各个子树可能导致语义变化。

语法树节点分为以下两类：控制节点（非叶节点）与内容节点（叶节点）。

---
控制节点按类型可分为3类：
> 1. 选择节点（type === "pickone"，节点颜色：红），模拟器从子节点中选择一个节点生成内容。
> 2. 顺序节点（type === "order"，节点颜色：蓝），模拟器按顺序产生每个子节点内容，顺序连接。
> 3. 可换节点（type === "exchangeable"，节点颜色：黄），模拟器按顺序产生每个子节点内容，Shuffle这些内容后连接。

控制节点JSON定义如下：
> * "type": <"pickone", "order", "exchangeable">
> * "name": （可选）生成代码时该节点的变量名称。请使用符合Python命名规则的字符串命名。如果该键不存在则会使用链式函数直接生成节点。
> * **注意：当控制节点为语法树的根节点时，强制要求设定 ***name*** 键**
> * "children": 子节点集合。
> * "dropout": （可选）模拟器生成内容时以多大概率剪枝。[0, 1)，默认值为0.
> * "weight": （当且仅当type==="pickone"时有效，可选）以多大权重生成对应分支的内容。默认值为1.0.

---
内容节点可分为2类（节点颜色：绿）：
> 1. 来自文件（from_file === true），模拟器从指定文件获取内容，取每行split后的第一个单词，模拟器从这些单词中选取一个作为生成的内容。
> 2. 指定内容（from_file === false），模拟器从指定的内容中随机选取一个作为生成的内容。

内容节点JSON定义如下：
> * "type": "content"
> * "from_file": <true|false>
> * "filename": （当且仅当from_file === true时存在），加载的文件名。
> * "content": （当且仅当from_file === false时存在），内容节点的内容，字符串数组。
> * "entity": （可选）对应实体类型。如果该键不存在则默认为"O"类型（Other）。
> * "name": （可选）生成代码时该节点的变量名称。请使用符合Python命名规则的字符串命名。如果该键不存在则会使用链式函数直接生成节点。
> * **注意：当from_file === true时，强制要求设定 ***name*** 键**
> * "dropout": （可选）模拟器生成内容时以多大概率剪枝。[0, 1)，默认值为0.
> * "cut": （可选）模拟器生成内容时该内容缺字的概率。[0, 1)，默认值为0.
> * "word_cut": （当且仅当cut>0时存在），对于每个字符，有多大概率删除该字符。[0, 1)，默认值为0.

---
一棵模拟器树包含一个根节点和若干子节点

根节点的JSON定义如下：
> * "name": 模拟器树的名称
> * "children": 子节点集合

每个子节点的JSON定义如下：
> * "name": 语法树的根节点名称
> * "intent": 对应语法树生成句子的意图
> * "weight": （可选）以多大权重生成对应语法的句子。默认值为1.0.

---
## 示例

一个生成询问会议的语法树的JSON示例：

``` json
{
    "type": "order",
    "name": "ask_venue_root",
    "children": [
        {
            "type": "order",
            "name": "search_node",
            "children": [
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
                },
                {
                    "type": "content",
                    "from_file": false,
                    "dropout": 0.3,
                    "content": [
                        "一些",
                        "一组",
                        "一批",
                        "几个"
                    ]
                }
            ]
        },
        {
            "type": "pickone",
            "name": "ex_keyword_node",
            "children": [
                {
                    "type": "order",
                    "children": [
                        {
                            "type": "content",
                            "from_file": false,
                            "content": [
                                "有关",
                                "关于"
                            ]
                        },
                        {
                            "type": "content",
                            "from_file": true,
                            "filename": "aminer_keywords_zh.txt",
                            "entity": "KEY",
                            "name": "keyword_node"
                        },
                        {
                            "type": "content",
                            "from_file": false,
                            "content": [
                                "方面",
                                "方向",
                                "领域"
                            ]
                        },
                        {
                            "type": "content",
                            "from_file": false,
                            "content": [
                                "的"
                            ]
                        }
                    ]
                },
                {
                    "type": "order",
                    "children": [
                        {
                            "type": "content",
                            "from_file": false,
                            "content": [
                                "和",
                                "与"
                            ]
                        },
                        {
                            "type": "content",
                            "from_file": true,
                            "filename": "aminer_keywords_zh.txt",
                            "entity": "KEY",
                            "name": "keyword_node"
                        },
                        {
                            "type": "content",
                            "from_file": false,
                            "content": [
                                "相关",
                                "有关"
                            ]
                        },
                        {
                            "type": "content",
                            "from_file": false,
                            "content": [
                                "的"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "content",
            "from_file": false,
            "content": [
                "期刊",
                "会议"
            ]
        }
    ]
}
```

---
一个生成AMiner提问数据的模拟器树JSON示例：
``` JSON
{
    "name": "s",
    "children": [
        {
            "name": "ask_venue_root",
            "intent": "搜会议",
            "weight": 0.25
        },
        {
            "name": "ask_expert_root",
            "intent": "搜学者",
            "weight": 0.15
        },
        {
            "name": "ask_paper_root",
            "intent": "搜文章",
            "weight": 0.5
        },
        {
            "name": "token_root",
            "intent": "纯Token",
            "weight": 0.1
        }
    ]
}
```

---
# 需求（*少的为主要功能）
1. （*）以树图形式展示JSON内容（完成）
2. （*）将树图结果保存为JSON文件(完成)
3. （*）可展开/折叠单个节点（完成）
4. （**）可整体拖动（完成）
5. （**）可缩放显示（完成）
6. （**）可拖动节点改变顺序（完成）
7. （**）支持语法树森林（提供检查）
8. （***）可编辑节点内容
9. （***）可深层拷贝子树
10. （***）从JSON文件生成对应的模拟器代码

11. (***)每个Intent对应一棵独立的tree，用list显示。