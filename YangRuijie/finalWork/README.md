## DAPP众筹平台（不完整）

首次运行

1. 输入vue ui
2. 安装vue需要的插件（用vscode开发）
3. 在任务中选择serve开始运行

之后

1. 直接 npm run serve 或者 yarn start即可



很多地方不完善，遇到了很多的问题目前无法解决

首先是按照01_compile.js的代码，输入 node 01_compile.js会出现错误

```c
[err_assertion]: invalid callback object specified.
```

在谷歌上搜索后，有人解释是solc版本不匹配sol合约，修改后仍旧报同样的错误。因为网上的都是0.4.25左右的版本开发，所以最后选择了0.5.0版本的solc，但是出现了新的错误

```
V8: /var/www/html/testeth/node_modules/solc/soljson.js:3 Invalid asm.js: Invalid member of stdlib
```

![image-20210115001051013](C:\Users\73288\AppData\Roaming\Typora\typora-user-images\image-20210115001051013.png)

在StackOverflow上有人提出上面的解决方法，尝试后仍旧不行。最后用的truffle deploy才完成编译，但是仍旧出现了问题，由于我最初编写的智能合约，构造的函数需要输入初始值，而这个值来自编译结果，但不知道为什么我的02_deploy.js无法从funding.json文件中获取相关的数据。

```
SyntaxError: Unexpected token ' in JSON at position 1
```

出现了上面这个比较场景的错误，应该是JSON.parse()函数调用的问题，但是修改后变成了position 0 处报错。最后舍弃了构造函数，重新写了一个简易版本的，但是只能有个最简单的交互功能。

![image-20210115002107221](C:\Users\73288\AppData\Roaming\Typora\typora-user-images\image-20210115002107221.png)

用truffle后，可以完成第一个不需要初始值的编译部署，但是之后的一个合约就无法编译了...

最初版本中，尝试在remix上进行在线部属，可以自己输入初始值，但是尝试几次输入后，从报错变成了没报错也没部属成功的 create funding...状态

![image-20210115002027711](C:\Users\73288\AppData\Roaming\Typora\typora-user-images\image-20210115002027711.png)

然后目前这个不完善的版本，最好可以用0.5.0左右的版本进行编译，不然需要根据版本修改一些问题。



杨锐洁

3180105810

2021/1/15




