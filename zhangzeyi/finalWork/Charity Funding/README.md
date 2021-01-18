# README

## 环境配置

* 安装React，Web3.js，Node.js，npm和truffle
* 安装vscode，并安装solidity插件
* 安装solc编译器
* 安装Ganache本地以太坊客户端

## 运行步骤

1. 打开Ganache，创建workspace搭建私链，导入`./truffle-config.js`

2. 将`Charity Funding`文件夹加入VsCode工作区

3. 在`./truffle-config.js`配置你的私链端口

4. 在根文件夹下打开终端，输入命令:

   `truffle migrate`

5. Ganache界面的Contracts中可以看到你部署的合约地址，将其复制粘贴至以下路径：

   `'./client/src/api/api.js'`

   下的第8行的地址下并保存

6. 在`'./client'`文件夹下打开终端，输入:

    `npm install`

命令安装项目依赖包

7. 在同上的终端中输入命令：

   `npm run start`

   启动项目

8. 项目启动成功后运行在localhost:3000端口

## 运行截图

![participate](.\assets\participate.png)![success](.\assets\success.png)![create](.\assets\create.png)