#### 如何操作：

①终端进入该项目所在目录，truffle compile编译合约文件;

②启动Ganache-cli客户端，QuickStart开启Ethereum;

③在原终端truffle migrate进行部署;

④部署成功后，终端输入npm run serve后运行，根据提示打开网址localhost:8080后即可看到该项目界面：

![image-20210106175257701](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210106175257701.png)

⑤导入Ganache-cli中的账户后，需要先连接网络HTTP://127.0.0.1:7545。然后才能在网页上进行操作。

该项目需要先在后端将众筹产品的众筹目标、产品信息固定，创建的第一个用户为众筹的发起者，参与众筹的用户在项目截止时间前参与众筹，若在项目截至前该项目未达到众筹目标，则可申请撤销该众筹，若项目截止前完成众筹，众筹发起者可以提取资金，即拿走该项目下筹集到的所有资金。

