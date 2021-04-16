# trans-ast
trans-ast是一个可以将html字符串解析为AST(JS)对象的一个插件,提供Template转AST,AST转DOM的功能   

演示地址: [trans-ast-demo](yalibook.com/vuepress/demo)

## 安装
`npm install --save trans-ast`   
or  
`yarn add trans-ast`

## 使用
Node环境   
`const $AST = require("trans-ast")`    
  
Vue 或 React   
`import $AST from 'trans-ast'`   
## 提供方法
### parseAST(template)

|  参数   | 描述  |
|:---|:---|
| template (必须) | String类型,合法的html字符串 |
|  返回值   | 描述  |
|    AST   | Object类型,解析后的AST对象 |

<br/>

### parseDOM(AST)
|  参数   | 描述  |
|:---|:---|
| AST (必须) | Object类型,由parseAST方法解析后的AST对象 |
|  返回值   | 描述  |
|   ElementNode   | Node节点,AST转换后的DOM |

<br/>

## AST属性说明   
   
|  属性   | 描述  |
|:---|:---|
| attrsMap | Map类型的标签属性,包含自定义属性 |
| attrslist | List类型的标签属性,包含自定义属性 |
| children | 当前元素的子元素 |
| parent | 当前元素的父元素 (已废弃)|
| tag | 标签名称 |
| type | 1:元素 2:文本  |
| expression| 可执行字符串,后续版本会支持直接解析
| text | 文本内容 |
     
     
## vue中全局注册

``` js
// 引入
import $AST from 'trans-ast'
// 注册
vue.prototype.$AST = $AST
// 使用
vm.$AST.parseAST(template)
vm.$AST.parseDOM(AST)
```