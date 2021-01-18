// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 ;

contract AllCrowdFunding {
  //众筹发起者
  FundingLeaders Fund_Leaders;
  //众筹参与者
  FundingParticipants Fund_Participants;
  //所有的众筹地址
  address[] allCrowdFundings;

  constructor() public{
    //合约创建时新建众筹发起者列表
    Fund_Leaders = new FundingLeaders();
    //合约创建时新建众筹参与者列表
    Fund_Participants = new FundingParticipants();
  }

  function NewCrowdFunding (string memory _FundingName,string memory _FundingDescription,uint _AmountMoney,uint _EndTime,uint _StartTime)public{
    //新建一个众筹项目
    SingleFunding NewFunding = new SingleFunding(msg.sender,_FundingName,_FundingDescription,_AmountMoney,_EndTime,_StartTime, address(Fund_Participants));
    //将该项目地址加入地址列表
    allCrowdFundings.push(address(NewFunding));
    //将众筹发起者加入发起者列表
    Fund_Leaders.AddToFunding(msg.sender,address(NewFunding));
  }

  //返回所有的众筹项目
  function getFundings() public view returns (address[] memory) {
    return allCrowdFundings;
  }

  //返回该账户发起的众筹项目
  function getLeader()public view returns (address[] memory) {
    return Fund_Leaders.GetAllFunding(msg.sender);
  }

  //返回该账户参与的众筹项目
  function getParticipate()public view returns (address[] memory) {
    return Fund_Participants.GetAllFunding(msg.sender);
  }

}

//保存单个Funding的所有信息
contract SingleFunding {
  address payable public Leader;
  address payable[] public Participants;
  mapping (address => uint) MoneyOfParticipants;

  //记录Funding的基本信息
  struct Funding {
    //众筹的全部金额
    uint AmountMoney;
    //已话费的金额
    uint SpentMoney;
    //起止时间
    uint EndTime;
    uint StartTime;
    //相关信息
    string FundingName;
    string FundingDescription;
    //是否达成目标
    bool isEnough;
  }
  Funding thisfunding;

  //记录投资人的合约
  FundingParticipants Fund_Participants;
  //请求的四种状态
  enum RequestStatus {Voting, Approved, NotApproved, Completed}
  //花费请求
  struct Request {
    //用途
    string purpose;
    //开销
    uint cost;
    //同意
    uint voteApproveCount;
    //不同意
    uint voteDisapproveCount;
    //参与投票人数
    uint votersNum;
    //投票对应地址
    mapping(address => bool) investorVotedMap;
    //该请求的状态
    RequestStatus status;
  }
  //请求的集合
  Request[] requests;

  /*
  参数表：_Leader/_FundingName/_FundingDescription/_AmountMoney/_EndTime/_StartTime
  */
  constructor(address payable _Leader,string memory _FundingName,string memory _FundingDescription,
    uint _AmountMoney,uint _EndTime,uint _StartTime, address _addrParticipants) public{
    //众筹项目的Leader
    Leader = _Leader;
    //项目相关信息
    thisfunding.FundingName = _FundingName;
    thisfunding.FundingDescription = _FundingDescription;
    //目标金额总和
    thisfunding.AmountMoney = _AmountMoney;
    //起止时间
    thisfunding.EndTime = _EndTime;
    thisfunding.StartTime = _StartTime;
    //保存投资人信息的合约
    Fund_Participants = FundingParticipants(_addrParticipants);
  }

  function PayMoney() payable public{
    // 条件1 打包区块的时间戳小于众筹交易截止时间
    require(block.timestamp <= thisfunding.EndTime);
    // 条件2 打入众筹账户的金额大于0
    require(msg.value > 0);
    // 若该投资人尚未进行过投资，则加入列表
    if (MoneyOfParticipants[msg.sender] == 0) {
      //将该众筹计划加入投资人账户中
      Fund_Participants.AddToFunding(msg.sender, address(this));
      //将投资人账户加入该众筹的投资人列表
      Participants.push(msg.sender);
    }
    //将投资人金额进行记录（可能先前进行过投资）
    MoneyOfParticipants[msg.sender] += msg.value;
    //若众筹目标已达到，则设置IsEnough参数
    if (address(this).balance >= thisfunding.AmountMoney) {
      thisfunding.isEnough = true;
    }
  }

  //是否为Leader
  modifier isLeader{
    require(msg.sender == Leader);
    _;
  }
  //只有众筹项目的Leader可以设置Money用途
  function SetMoneyUse(string memory _purpose,uint _cost) isLeader public{
    Request memory req = Request ({
    purpose: _purpose,
    cost: _cost,
    voteApproveCount: 0,
    voteDisapproveCount: 0,
    votersNum: 0,
    status:RequestStatus.Voting
    });
    requests.push(req);
    thisfunding.SpentMoney += _cost;
  }

  //function Get
  //批准⽀付申请
  function voteRequest(uint index, bool isApproved) public {
    require(MoneyOfParticipants[msg.sender] != 0);
    Request storage req = requests[index];
    require(req.investorVotedMap[msg.sender] == false);
    require(req.status == RequestStatus.Voting);
    req.votersNum += 1;
    if (isApproved) {
      req.voteApproveCount += MoneyOfParticipants[msg.sender];
    }
    else {
      req.voteDisapproveCount += MoneyOfParticipants[msg.sender];
    }
    req.investorVotedMap[msg.sender] = true;
    //接受金额与设定金额对比，需超过50%
    if (req.voteApproveCount * 2 > thisfunding.AmountMoney) {
      req.status = RequestStatus.Approved;
    }
    //拒绝金额与设定金额对比，需超过50%
    else if (req.voteDisapproveCount * 2 > thisfunding.AmountMoney) {
      req.status = RequestStatus.NotApproved;
    }
  }

  function executeRequest(uint index) public isLeader{
    //传入请求的index
    Request storage req = requests[index];
    //余额大于开销
    require(address(this).balance >= req.cost);
    //众筹项目已同意
    require(req.status == RequestStatus.Approved);
    //向项目发起人转账
    Leader.transfer(req.cost);
    //该请求完成
    req.status = RequestStatus.Completed;
  }

  //基本信息
  function FundingInfo() public view returns(address,string memory,string memory,uint256,uint256,uint256) {
    return (Leader,thisfunding.FundingName,thisfunding.FundingDescription,thisfunding.AmountMoney,thisfunding.EndTime,thisfunding.StartTime);
  }

  //是否为该项目发起人
  function IsLeader() public view returns(bool) {
    return msg.sender == Leader;
  }
  //是否为该项目投资人
  function IsParticipant() public view returns(bool) {
    return MoneyOfParticipants[msg.sender] != 0;
  }
  //投资人已投入的钱
  function getInvestment() public view returns(uint256) {
    return MoneyOfParticipants[msg.sender];
  }
  //合约余额
  function getBalance()public view returns(uint256){
    return address(this).balance;
  }

  //获取投资人
  function getParticipants()public view returns(address payable[] memory){
    return Participants;
  }

  //获取投资人数量
  function getParticipantsCount()public view returns(uint256) {
    return Participants.length;
  }

  //返回众筹剩余时间
  function getRemainTime()public view returns(uint256) {
    return(thisfunding.EndTime - now)/60/60/24;
  }

  //返回花费申请数量
  function getRequestsCount()public view returns(uint256) {
    return requests.length;
  }

  //返回某⼀个花费申请的具体信息
  function getRequestDetailByIndex(uint256 index)public view returns(string memory,uint256,bool,uint256,uint256,uint256,uint256) {
    //确保访问不越界
    require(requests.length > index);
    Request storage req =requests[index];

    bool isVoted = req.investorVotedMap[msg.sender];
    return (req.purpose, req.cost, isVoted, req.votersNum, req.voteApproveCount, req.voteDisapproveCount, uint256(req.status));
  }

}

//保存投资参与人账户的基本信息
contract FundingParticipants {

  mapping(address => address[]) AddrToFunding;

  function AddToFunding(address _Participants,address _FundingAddr) public{
    AddrToFunding[_Participants].push(_FundingAddr);
  }

  function GetAllFunding(address _Participants) public view returns(address[] memory){
    return AddrToFunding[_Participants];
  }
}

//保存投资发起人的基本信息
contract FundingLeaders {

  mapping(address => address[]) AddrToFunding;

  function AddToFunding(address _Participants,address _FundingAddr) public{
    AddrToFunding[_Participants].push(_FundingAddr);
  }

  function GetAllFunding(address _Participants) public view returns(address[] memory){
    return AddrToFunding[_Participants];
  }
}
