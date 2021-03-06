const parseHTML = require('./parseHTML')
/**
 * 
 * @param {*} template 要解析的模板字符串
 * @returns 
 */
 function parse(template) {
    //最终返回出去的AST对象
    let root 
    // 当前元素的父级元素
    let currentParent
    // 生成AST的临时栈
    let stack = []
    parseHTML(template,{
        //匹配开始标签
        start:(tag,attrs,unary)=>{
            // 创建AST元素
            // type,tag,parent,children,attrlist
            let element = { 
                // 自定义type:1 元素节点,2 纯文本
                type:1,
                tag,
                attrslist:attrs,
                attrsMap:makeAttrsMap(attrs),
                // parent:currentParent,
                children:[]
            }
            // TODO 属性处理
            // 第一次进入开始标签说明是根节点
            if(!root){
                root = element
            }
            if(currentParent){
                // 如果有父级元素,那么设置当前元素添加到父级元素的children里
                // 然后设置当前元素的parent属性就是当前的父级元素
                currentParent.children.push(element)
                // element.parent = currentParent
            }
            if(!unary){
                currentParent = element
                stack.push(element)
            }
        },
        //匹配结束标签
        end:()=>{
            // 栈删除匹配的元素
            stack.length-=1
            // 设置当前父级元素
            currentParent = stack[stack.length-1]
        },
        //匹配文本内容
        chars:(text)=>{
            if(!currentParent) return
            const children = currentParent.children
            if(text.trim()){
                // TODO 需要把text文本转换成可以执行的表达式
                let expression = ''
                children.push({
                    type:2,
                    text,
                    expression
                })
            }
        }
    })
    
    return root
}
 function render(AST) {
    const element = document.createElement(AST.tag)
    AST.attrslist.forEach(attr => {
        element.setAttribute(attr.name, attr.value)
    });
    handleChildrenElement(AST.children, element)
    return element
}
function handleChildrenElement(AST, root) {
    if(AST instanceof Array){
        AST.forEach(item => {
            if (item.type === 1) {
                const element = document.createElement(item.tag)
                item.attrslist.forEach(attr => {
                    if(attr.name.indexOf('tag-model') != -1){
                        attr.value = attr.value.replace(/&nbsp;/g,' ')
                        attr.value = attr.value.replace(/&gt;/g,'>')
                        attr.value = attr.value.replace(/&lt;/g,'<')
                        attr.value = attr.value.replace(/&quot;/g,'"')
                        attr.value = attr.value.replace(/&quot;/g,'"')
                        attr.value = attr.value.replace(/&apos;/g,`'`)
                        item[attr.name] = attr.value
                    }
                    element.setAttribute(attr.name, attr.value)
                });
                // 添加到父级
                root.appendChild(element)
                item.children &&item.children.length>0&& handleChildrenElement(item.children, element)
            } else if (item.type === 2 ) {
                root.innerHTML += item.text
            }
        });
    }
}
/**
 * 把数组形式的属性转换为键值对
 * @param {*} attrs 属性
 */
function makeAttrsMap(attrs) {
    const map = {}
    for(let i= 0,l=attrs.length;i<l;i++){
        map[attrs[i].name] = attrs[i].value
    }
    return map
}

module.exports =  {parseAST:parse,parseDOM:render}