(function(e){function t(t){for(var o,l,i=t[0],s=t[1],d=t[2],u=0,p=[];u<i.length;u++)l=i[u],a[l]&&p.push(a[l][0]),a[l]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);c&&c(t);while(p.length)p.shift()();return r.push.apply(r,d||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,i=1;i<n.length;i++){var s=n[i];0!==a[s]&&(o=!1)}o&&(r.splice(t--,1),e=l(l.s=n[0]))}return e}var o={},a={app:0},r=[];function l(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=o,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)l.d(n,o,function(t){return e[t]}.bind(null,o));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="/interactive-syntax-tree/dist/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],s=i.push.bind(i);i.push=t,i=i.slice();for(var d=0;d<i.length;d++)t(i[d]);var c=s;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},2375:function(e){e.exports={type:"root",children:[{type:"order",name:"ask_venue_root",children:[{type:"order",name:"search_node",children:[{type:"content",from_file:!1,dropout:.2,content:["给我","想找","想要","想要找","查","查询","检索","显示","展示","查找"]},{type:"content",from_file:!1,dropout:.3,content:["一些","一组","一批","几个"]}]},{type:"pickone",name:"ex_keyword_node",children:[{type:"order",children:[{type:"content",from_file:!1,content:["有关","关于"]},{type:"content",from_file:!0,filename:"aminer_keywords_zh.txt",entity:"KEY",name:"keyword_node"},{type:"content",from_file:!1,content:["方面","方向","领域"]},{type:"content",from_file:!1,content:["的"]}]},{type:"order",children:[{type:"content",from_file:!1,content:["和","与"]},{type:"content",from_file:!0,filename:"aminer_keywords_zh.txt",entity:"KEY",name:"keyword_node"},{type:"content",from_file:!1,content:["相关","有关"]},{type:"content",from_file:!1,content:["的"]}]}]},{type:"content",from_file:!1,content:["期刊","会议"]}]}]}},"25a8":function(e,t,n){"use strict";var o=n("befc"),a=n.n(o);a.a},"56d7":function(e,t,n){"use strict";n.r(t);var o=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},r=[],l=n("2877"),i={},s=Object(l["a"])(i,a,r,!1,null,null,null);s.options.__file="App.vue";var d=s.exports,c=n("8c4f"),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("interactive-syntax-tree")],1)},p=[],h=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-container",[n("el-main",[n("el-row",{attrs:{gutter:20}},[n("el-col",{attrs:{span:18}},[n("svg",{attrs:{height:"100vh",width:"100%"}})]),n("el-col",{attrs:{span:6}},[n("el-tabs",{attrs:{type:"border-card"},on:{"tab-remove":e.unClick},model:{value:e.tabs,callback:function(t){e.tabs=t},expression:"tabs"}},[n("el-tab-pane",{attrs:{name:"menu"}},[n("span",{attrs:{slot:"label"},slot:"label"},[n("i",{staticClass:"el-icon-menu"}),e._v(" Menu")]),n("el-collapse",{attrs:{accordion:"",value:"download"}},[n("el-collapse-item",{attrs:{name:"create",title:"Create Node"}},[n("el-form",{attrs:{"label-width":"80px"}},[n("el-row",{attrs:{type:"flex",justify:"end"}},[n("el-col",{attrs:{span:23}},[n("el-collapse",{attrs:{value:["common","advanced","create"]}},[n("el-collapse-item",{attrs:{name:"common",title:"Common Settings"}},[n("el-form-item",{attrs:{label:"Type"}},[n("el-select",{attrs:{placeholder:"Type"},model:{value:e.newNode.type,callback:function(t){e.$set(e.newNode,"type",t)},expression:"newNode.type"}},[n("el-option",{attrs:{value:"order"}}),n("el-option",{attrs:{value:"pickone"}}),n("el-option",{attrs:{value:"exchangeable"}}),n("el-option",{attrs:{value:"content"}})],1)],1),n("el-form-item",{attrs:{label:"Name"}},[n("el-input",{attrs:{placeholder:"Name",clearable:""},model:{value:e.newNode.name,callback:function(t){e.$set(e.newNode,"name",t)},expression:"newNode.name"}})],1),n("el-form-item",{attrs:{label:"Dropout"}},[n("el-slider",{attrs:{min:0,max:1,step:.01,"show-input":""},model:{value:e.newNode.dropout,callback:function(t){e.$set(e.newNode,"dropout",t)},expression:"newNode.dropout"}})],1)],1),e.newNode.type?n("el-collapse-item",{attrs:{name:"advanced",title:"Advanced Settings"}},[e.newNode.type in{order:1,pickone:2,exchangeable:3}?n("el-form-item",{attrs:{label:"Weight"}},[n("el-input-number",{attrs:{precision:2,step:.01,min:0},model:{value:e.newNode.weight,callback:function(t){e.$set(e.newNode,"weight",t)},expression:"newNode.weight"}})],1):e._e(),"content"===e.newNode.type?n("el-row",[n("el-form-item",{attrs:{label:"FromFile"}},[n("el-switch",{model:{value:e.newNode.from_file,callback:function(t){e.$set(e.newNode,"from_file",t)},expression:"newNode.from_file"}})],1),e.newNode.from_file?n("el-form-item",{attrs:{label:"Filename"}},[n("el-input",{attrs:{placeholder:"Filename",clearable:""},model:{value:e.newNode.filename,callback:function(t){e.$set(e.newNode,"filename",t)},expression:"newNode.filename"}})],1):n("el-form-item",{attrs:{label:"Content"}},[n("tag-editor",{attrs:{tags:e.newNode.content}})],1),e.newNode.entity?n("el-form-item",{attrs:{label:"Entity"}},[n("el-input",{attrs:{placeholder:"Entity",clearable:""},model:{value:e.newNode.entity,callback:function(t){e.$set(e.newNode,"entity",t)},expression:"newNode.entity"}})],1):e._e(),n("el-form-item",{attrs:{label:"Cut"}},[n("el-slider",{attrs:{min:0,max:1,step:.01,"show-input":""},model:{value:e.newNode.cut,callback:function(t){e.$set(e.newNode,"cut",t)},expression:"newNode.cut"}})],1),e.newNode.cut&&e.newNode.cut>0?n("el-form-item",{attrs:{label:"WordCut"}},[n("el-slider",{attrs:{min:0,max:1,step:.01,"show-input":""},model:{value:e.newNode.word_cut,callback:function(t){e.$set(e.newNode,"word_cut",t)},expression:"newNode.word_cut"}})],1):e._e()],1):e._e()],1):e._e(),e.newNode.type?n("el-collapse-item",{attrs:{name:"create",title:"Create Node"}},[n("el-row",{attrs:{type:"flex",justify:"center"}},[n("el-button",{attrs:{type:"success"},on:{click:e.createNode}},[e._v("Create"),n("i",{staticClass:"el-icon-success el-icon--right"})])],1)],1):e._e()],1)],1)],1)],1)],1),n("el-collapse-item",{attrs:{name:"upload",title:"Upload JSON"}},[n("el-row",{attrs:{type:"flex",justify:"center"}},[n("el-col",{attrs:{span:22}},[n("el-upload",{ref:"upload",staticClass:"upload-demo",attrs:{"on-change":e.onUpload,"auto-upload":!1,drag:"",action:"#",multiple:""}},[n("i",{staticClass:"el-icon-upload"}),n("div",{staticClass:"el-upload__text"},[e._v("Drag and drop json files there, or "),n("em",[e._v("click")]),e._v(" to upload")]),n("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("Tree will be merged to the root"),n("el-button",{staticStyle:{"margin-left":"10px"},attrs:{size:"small",type:"success"},on:{click:e.load}},[e._v("Load Syntax Tree JSON"),n("i",{staticClass:"el-icon-upload2 el-icon--right"})])],1)])],1)],1)],1),n("el-collapse-item",{attrs:{name:"download",title:"Download JSON"}},[n("el-row",{attrs:{type:"flex",justify:"center"}},[n("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("Download Syntax Tree JSON"),n("i",{staticClass:"el-icon-download el-icon--right"})])],1)],1)],1)],1),e.nodeProp&&e.nodeProp!==e.root?n("el-tab-pane",{attrs:{closable:"",name:"setting"}},[n("span",{attrs:{slot:"label"},slot:"label"},[n("i",{staticClass:"el-icon-setting"}),e._v(" Setting")]),n("el-form",{attrs:{"label-width":"80px"}},[n("el-collapse",{attrs:{value:["common","advanced"]}},[n("el-collapse-item",{attrs:{name:"common",title:"Common Settings"}},[e.nodeProp.data.type in{order:1,pickone:2,exchangeable:3}?n("el-form-item",{attrs:{label:"Type"}},[n("el-radio-group",{attrs:{size:"small"},model:{value:e.nodeProp.data.type,callback:function(t){e.$set(e.nodeProp.data,"type",t)},expression:"nodeProp.data.type"}},[n("el-radio-button",{attrs:{label:"order"}}),n("el-radio-button",{attrs:{label:"pickone"}}),n("el-radio-button",{attrs:{label:"exchangeable"}})],1)],1):e._e(),"content"==e.nodeProp.data.type?n("el-form-item",{attrs:{label:"Type"}},[n("el-tag",[e._v(e._s(e.nodeProp.data.type))])],1):e._e(),n("el-form-item",{attrs:{label:"Name"}},[n("el-input",{attrs:{placeholder:"Name",clearable:""},model:{value:e.nodeProp.data.name,callback:function(t){e.$set(e.nodeProp.data,"name",t)},expression:"nodeProp.data.name"}})],1),n("el-form-item",{attrs:{label:"Dropout"}},[n("el-slider",{attrs:{min:0,max:1,step:.01,"show-input":""},model:{value:e.nodeProp.data.dropout,callback:function(t){e.$set(e.nodeProp.data,"dropout",t)},expression:"nodeProp.data.dropout"}})],1)],1),n("el-collapse-item",{attrs:{name:"advanced",title:"Advanced Settings"}},[e.nodeProp.data.type in{order:1,pickone:2,exchangeable:3}?n("el-form-item",{attrs:{label:"Weight"}},[n("el-input-number",{attrs:{precision:2,step:.01,min:0},model:{value:e.nodeProp.data.weight,callback:function(t){e.$set(e.nodeProp.data,"weight",t)},expression:"nodeProp.data.weight"}})],1):e._e(),"content"===e.nodeProp.data.type?n("el-row",[n("el-form-item",{attrs:{label:"FromFile"}},[n("el-switch",{model:{value:e.nodeProp.data.from_file,callback:function(t){e.$set(e.nodeProp.data,"from_file",t)},expression:"nodeProp.data.from_file"}})],1),e.nodeProp.data.from_file?n("el-form-item",{attrs:{label:"Filename"}},[n("el-input",{attrs:{placeholder:"Filename",clearable:""},model:{value:e.nodeProp.data.filename,callback:function(t){e.$set(e.nodeProp.data,"filename",t)},expression:"nodeProp.data.filename"}})],1):n("el-form-item",{attrs:{label:"Content"}},[n("tag-editor",{attrs:{tags:e.nodeProp.data.content}})],1),e.nodeProp.data.entity?n("el-form-item",{attrs:{label:"Entity"}},[n("el-input",{attrs:{placeholder:"Entity",clearable:""},model:{value:e.nodeProp.data.entity,callback:function(t){e.$set(e.nodeProp.data,"entity",t)},expression:"nodeProp.data.entity"}})],1):e._e(),n("el-form-item",{attrs:{label:"Cut"}},[n("el-slider",{attrs:{min:0,max:1,step:.01,"show-input":""},model:{value:e.nodeProp.data.cut,callback:function(t){e.$set(e.nodeProp.data,"cut",t)},expression:"nodeProp.data.cut"}})],1),e.nodeProp.data.cut&&e.nodeProp.data.cut>0?n("el-form-item",{attrs:{label:"WordCut"}},[n("el-slider",{attrs:{min:0,max:1,step:.01,"show-input":""},model:{value:e.nodeProp.data.word_cut,callback:function(t){e.$set(e.nodeProp.data,"word_cut",t)},expression:"nodeProp.data.word_cut"}})],1):e._e()],1):e._e()],1),n("el-collapse-item",{attrs:{name:"copy",title:"Copy Tree"}},[n("el-row",{attrs:{type:"flex",justify:"center"}},[n("el-button",{attrs:{type:"warning"},on:{click:e.copyTree}},[e._v("Copy"),n("i",{staticClass:"el-icon-info el-icon--right"})])],1)],1),n("el-collapse-item",{attrs:{name:"delete",title:"Delete Node"}},[n("el-row",{attrs:{type:"flex",justify:"center"}},[n("el-button",{attrs:{type:"danger"},on:{click:e.deleteNode}},[e._v("Delete"),n("i",{staticClass:"el-icon-warning el-icon--right"})])],1)],1)],1)],1)],1):e._e()],1)],1)],1)],1)],1)},f=[],m=n("5698"),g=n("1157"),y=n.n(g);const b=n("2375");var v={name:"InteractiveSyntaxTree",data:function(){return{data:null,root:null,index:0,dragListener:null,dragStarted:null,dragNodes:null,draggingNode:null,selectedNode:null,panBoundary:50,panTimer:null,baseSvg:null,svgGroup:null,zoomListener:null,linkGenerator:null,duration:750,newNode:{content:[]},nodeProp:null,tabs:"menu",uploadFiles:null}},watch:{nodeProp:{handler:function(e){this.update(this.root),null!==e&&(this.centerNode(e),e===this.root?this.tabs="menu":this.tabs="setting")},deep:!0}},mounted:function(){const e=this;this.zoomListener=m["k"]().scaleExtent([.5,4]).on("zoom",this.zoom),this.baseSvg=m["h"]("svg").attr("class","overlay").call(this.zoomListener).on("dblclick.zoom",null),this.linkGenerator=m["d"]().x(function(e){return e.y}).y(function(e){return e.x}),this.dragListener=m["a"]().on("start",function(t){t!==e.root&&(e.dragStarted=!0,e.dragNodes=t.descendants(),m["b"].sourceEvent.stopPropagation())}).on("drag",function(t){if(t===e.root)return;e.dragStarted&&e.dragStart(t,this);const n=m["g"](y()("svg").get(0));let o=null,a=null;n[0]<e.panBoundary?(o="left",a=e.panBoundary-n[0]):n[0]>y()("svg").width()-e.panBoundary?(o="right",a=n[0]-y()("svg").width()+e.panBoundary):n[1]<e.panBoundary?(o="up",a=e.panBoundary-n[1]):n[1]>y()("svg").height()-e.panBoundary?(o="down",a=n[1]-y()("svg").height()+e.panBoundary):clearTimeout(e.panTimer),null!==o&&(a=m["f"]([1e3,a]),e.pan(o,a/10)),t.x0+=m["b"].dy,t.y0+=m["b"].dx;const r=m["h"](this);r.attr("transform",`translate(${t.y0}, ${t.x0})`),e.updateTempConnector()}).on("end",function(t){if(t!==e.root&&null!==e.draggingNode){if(e.selectedNode){const t=e.draggingNode.parent.children.indexOf(e.draggingNode);t>-1&&(e.draggingNode.parent.children.splice(t,1),e.draggingNode.parent.children.length||delete e.draggingNode.parent.children),e.selectedNode.children?e.selectedNode.children.push(e.draggingNode):e.selectedNode._children?e.selectedNode._children.push(e.draggingNode):(e.selectedNode.children=[],e.selectedNode.children.push(e.draggingNode)),e.draggingNode.parent=e.selectedNode,e.updateHierarchy(),e.expand(e.selectedNode),e.sortTree()}clearTimeout(e.panTimer),e.dragEnd(e.draggingNode.parent,this)}}),this.svgGroup=this.baseSvg.append("g"),this.data=b,this.hierarchy(),this.update(this.root),this.centerNode(this.root)},methods:{onUpload:function(e,t){this.uploadFiles=t},load:function(){if(this.uploadFiles){const e=this,t=function(t){try{const n=JSON.parse(t.target.result);"root"!==n.type?e.addTree(n):n.children.forEach(function(t){e.addTree(t)})}catch(e){return}};for(let n=0;n<this.uploadFiles.length;n++){const e=this.uploadFiles[n];if(e){const n=new FileReader;n.onload=t,n.readAsText(e.raw)}}this.$refs.upload.clearFiles()}},addTree:function(e){const t=m["c"](e);t.parent=this.root,this.expand(this.root),this.root.children||(this.root.children=[]),this.root.children.push(t),this.updateHierarchy(),this.$set(this,"nodeProp",t)},copyTree:function(){this.addTree(this.generateJSON(this.nodeProp))},deleteNode:function(){const e=this.nodeProp.parent,t=e.children.indexOf(this.nodeProp);t>-1&&(e.children.splice(t,1),e.children.length||delete e.children),this.$set(this,"nodeProp",null),this.centerNode(e),this.tabs="menu"},unClick:function(){this.$set(this,"nodeProp",null),this.tabs="menu"},createNode:function(){if(this.newNode.type&&this.newNode.type in{order:1,pickone:2,exchangeable:3,content:4}){const e=m["c"](this.newNode);e.parent=this.root,e.depth=1,e.height=0,this.root.children||(this.root.children=[]),this.root.children.push(e),this.$set(this,"nodeProp",e),this.newNode={content:[]}}},updateHierarchy:function(){const e=function(t,n){t.depth=n;const o=t.children||t._children;return o&&o.length?t.height=m["e"](o.map(function(t){return e(t,n+1)}))+1:t.height=0,t.height};e(this.root,0)},sortTree:function(){this.root.sort(function(e,t){const n=e.x0-e.parent.x0,o=Math.abs(e.y0-e.parent.y0),a=t.x0-t.parent.x0,r=Math.abs(t.y0-t.parent.y0);return n/o-a/r})},pan:function(e,t){clearTimeout(this.panTimer);const n=this;let o=0,a=0;switch(e){case"left":o=+t;break;case"right":o=-t;break;case"up":a=+t;break;case"down":a=-t;break;default:break}this.zoomListener.translateBy(this.baseSvg.transition().duration(50),o,a),this.panTimer=setTimeout(function(){n.pan(e,t)},50)},updateTempConnector:function(){let e=[];null!==this.draggingNode&&null!==this.selectedNode&&(e=[{source:{x:this.selectedNode.x0,y:this.selectedNode.y0},target:{x:this.draggingNode.x0,y:this.draggingNode.y0}}]);const t=this.svgGroup.selectAll(".tempLink").data(e);t.enter().append("path").attr("class","tempLink").attr("d",this.linkGenerator).attr("pointer-events","none"),t.attr("d",this.linkGenerator),t.exit().remove()},hierarchy:function(){this.root=m["c"](this.data),this.root.x0=0,this.root.y0=y()(this.baseSvg.node()).width()/2},expand:function(e){e._children&&(e.children=e._children,delete e._children)},dragStart:function(e,t){const n=this;if(this.draggingNode=e,m["h"](t).select(".ghostCircle").attr("pointer-events","none"),m["i"](".ghostCircle").attr("class","ghostCircle show"),t.classList.add("activeDrag"),this.svgGroup.selectAll("g.node").sort(function(e){return e.id!==n.draggingNode.id?1:-1}),this.dragNodes.length>1){const t=e.links();this.svgGroup.selectAll("path.link").data(t,function(e){return e.target.id}).remove(),this.svgGroup.selectAll("g.node").data(this.dragNodes.slice(1),function(e){return e.id}).remove()}this.svgGroup.selectAll("path.link").filter(function(e){return e.target.id===n.draggingNode.id}).remove(),this.dragStarted=null},dragEnd:function(e,t){this.selectedNode=null,m["i"](".ghostCircle").attr("class","ghostCircle"),t.classList.remove("activeDrag"),m["h"](t).select(".ghostCircle").attr("pointer-events",""),this.updateTempConnector(),null!==this.draggingNode&&(this.update(e),this.centerNode(this.draggingNode),this.draggingNode=null)},click:function(e){m["b"].defaultPrevented||this.$set(this,"nodeProp",e)},dblClick:function(e){m["b"].defaultPrevented||(e.children||e._children)&&(e.children?(e._children=e.children,delete e.children):(e.children=e._children,delete e._children),this.update(e),this.centerNode(e))},ghostOver:function(e){this.selectedNode=e,this.updateTempConnector()},ghostOut:function(){this.selectedNode=null,this.updateTempConnector()},updateData:function(){this.data=this.generateJSON(this.root),this.hierarchy()},update:function(e){const t=this,n=t.root.descendants(),o=t.root.links(),a=[];n.forEach(function(e){a.push((e.data.name||e.data.type).length)});const r=m["e"](a),l=m["j"]().nodeSize([25,8*r]);this.root=l(this.root),this.svgGroup.selectAll("g.node .selectCircle").remove();const i=this.svgGroup.selectAll("g.node").data(n,function(e){return e.id||(e.id=++t.index)}),s=i.enter().append("g").call(this.dragListener).attr("transform",function(){return`translate(${e.y0}, ${e.x0})`}).on("click",this.click).on("dblclick",this.dblClick);s.append("circle").attr("r",0),s.append("text").style("fill-opacity",0),s.filter(function(e){return"content"!==e.data.type}).append("circle").attr("class","ghostCircle").attr("r",40).attr("pointer-events","mouseover").on("mouseover",this.ghostOver).on("mouseout",this.ghostOut);let d=s.merge(i).attr("class",function(e){return`node ${e.data.type}${e._children?" collapsed":""}`});d.filter(function(e){return e===t.nodeProp}).append("circle").attr("class","selectCircle").attr("r",.75),d.select("text").text(function(e){return e.data.name||e.data.type}).attr("x",function(e){return e.children||e._children?-8:8}).attr("dy",function(e){return e.children||e._children?-3.5:8.5}).attr("class",function(e){return e.children||e._children?"internal":"leaf"}),d=d.transition().duration(this.duration).attr("transform",function(e){return`translate(${e.y}, ${e.x})`}),d.select("circle").attr("r",5),d.select("text").style("fill-opacity",1);const c=i.exit().transition().duration(this.duration).attr("transform",function(){return`translate(${e.y}, ${e.x})`}).remove();c.select("circle").attr("r",0),c.select("text").style("fill-opacity",0);const u=this.svgGroup.selectAll("path.link").data(o,function(e){return e.target.id}),p=u.enter().insert("path","g").attr("class","link").attr("d",function(){const n={x:e.x0,y:e.y0};return t.linkGenerator({source:n,target:n})});p.merge(u).transition().duration(this.duration).attr("d",this.linkGenerator),u.exit().transition().duration(this.duration).attr("d",function(){const n={x:e.x,y:e.y};return t.linkGenerator({source:n,target:n})}).remove(),n.forEach(function(e){e.x0=e.x,e.y0=e.y})},centerNode:function(e){this.baseSvg.transition().duration(this.duration).call(this.zoomListener.translateTo,e.y0,e.x0).transition().call(this.zoomListener.scaleTo,2)},zoom:function(){this.svgGroup.attr("transform",m["b"].transform)},generateJSON:function(e){const t=this,n={};Object.assign(n,e.data);for(const a in n)null!==n[a]&&void 0!==n[a]&&""!==n[a]||delete n[a];const o=e.children||e._children;return o&&(n.children=[],o.forEach(function(e){n.children.push(t.generateJSON(e))})),n},save:function(){const e=this.generateJSON(this.root),t=document.createElement("a");t.download="syntaxTree.json",t.href=URL.createObjectURL(new Blob([JSON.stringify(e)])),document.body.appendChild(t),t.click(),document.body.removeChild(t)}}},w=v,N=(n("25a8"),Object(l["a"])(w,h,f,!1,null,null,null));N.options.__file="InteractiveSyntaxTree.vue";var x=N.exports,_={name:"Home",components:{InteractiveSyntaxTree:x}},k=_,P=Object(l["a"])(k,u,p,!1,null,null,null);P.options.__file="Home.vue";var C=P.exports;o["default"].use(c["a"]);var T=new c["a"]({routes:[{path:"/",name:"home",component:C}]}),$=n("5c96"),S=n.n($);n("0fae");o["default"].use(S.a);var O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-row",[e._l(e.tags,function(t){return n("el-tag",{key:t,attrs:{"disable-transitions":!1,closable:""},on:{close:function(n){e.handleClose(t)}}},[e._v("\n    "+e._s(t)+"\n  ")])}),e.inputVisible?n("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:e.handleInputConfirm},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.handleInputConfirm(t):null}},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}}):n("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:e.showInput}},[e._v("+ New Tag")])],2)},j=[],E={name:"TagEditor",props:{tags:{type:Array,default:[]}},data:function(){return{inputVisible:!1,inputValue:""}},methods:{handleClose:function(e){this.tags.splice(this.tags.indexOf(e),1)},showInput:function(){this.inputVisible=!0,this.$nextTick(()=>{this.$refs.saveTagInput.$refs.input.focus()})},handleInputConfirm:function(){const e=this.inputValue;e&&this.tags.push(e),this.inputVisible=!1,this.inputValue=""}}},G=E,z=(n("ae54"),Object(l["a"])(G,O,j,!1,null,null,null));z.options.__file="TagEditor.vue";var L=z.exports;o["default"].component(L.name,L);o["default"].config.productionTip=!1,new o["default"]({router:T,render:e=>e(d)}).$mount("#app")},ae54:function(e,t,n){"use strict";var o=n("f050"),a=n.n(o);a.a},befc:function(e,t,n){},f050:function(e,t,n){}});
//# sourceMappingURL=app.2f1261ad.js.map