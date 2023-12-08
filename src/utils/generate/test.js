var template = require('art-template');
console.log("template.defaults.rules",template.defaults.rules)
template.defaults.rules.splice(1,1)
let data = {
    name:'name323',
    dd : [1,2,3]
}
let source = `dfsdfw
...
{{name }}
{{each dd}}
    {{$index}} {{$value}}
{{/each}}
`

// 将模板源代码编译成函数并立刻执行
let bb = template.render(source, data, {});
console.log("bb",bb)
