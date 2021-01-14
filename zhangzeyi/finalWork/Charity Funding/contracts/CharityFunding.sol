pragma solidity >=0.4.21 <0.7.0;

contract CharityFunding{
    struct Funder{
        address payable add;
        uint cost;
    }
    
    struct Funding{
        address payable initiator;
        string title;//标题
        string content;//内容 
        uint goalMoney;
        uint raisedMoney;
        uint usedMoney;
        uint deadline;
        bool isSuccess;
        uint fundersLength;
        uint proposalsLength;
        mapping(uint => Funder) funders;
        mapping(uint => Proposal) proposals;
    }
    
    struct Proposal{
        string content;//where would be used
        uint amount;
        uint agreeAmount;
        uint disAmount;
        uint goal;//how many people agrees, this can be used
        mapping(uint => uint) states;//0 is undefined, 1 is agree, 2 is disagree
        bool isAgreed;
    }
    
    uint public allFundingsLength;
    mapping(uint => Funding) public allFundings;
    
    
    function createFunding(address payable _initiator, string memory _title, string memory _content, uint _goalMoney, uint _remainingtime) public returns(uint) {
        uint num = allFundingsLength;
        allFundingsLength+=1;
        Funding storage funding = allFundings[num];
        funding.initiator = _initiator;
        funding.title = _title;
        funding.content = _content;
        funding.goalMoney = _goalMoney;
        funding.raisedMoney = 0;
        funding.usedMoney = 0;
        funding.deadline = _remainingtime;
        return num;
    }
    
    function contribute(uint _fundId) public payable {
        require(msg.value>0);
        require(now<=allFundings[_fundId].deadline);
        Funding storage funding = allFundings[_fundId];
        uint funderNum = funding.fundersLength + 1;
        funding.fundersLength += 1;
        Funder storage funder = funding.funders[funderNum];
        funder.add = msg.sender;
        funder.cost = msg.value;
        funding.raisedMoney += msg.value;
        if(funding.raisedMoney >= funding.goalMoney)funding.isSuccess=true;
    }
    
    function createProposal(uint _fundId, string memory _content, uint _amount) public {
        Funding storage funding = allFundings[_fundId];
        require(funding.initiator == msg.sender);
        uint proNum = funding.proposalsLength + 1;
        funding.proposalsLength+=1;
        Proposal storage proposal = funding.proposals[proNum];
        proposal.content = _content;
        proposal.amount = _amount;
        proposal.goal = funding.raisedMoney / 2; 
    }
    
    function agreeProposal(uint _fundId, uint _proposalId, bool _isAgree) public funderOfFunding(_fundId){
        Funding storage funding = allFundings[_fundId];
        require(_proposalId>=1 && _fundId<=funding.proposalsLength);
        Proposal storage proposal = funding.proposals[_proposalId];
        for(uint i = 1; i<=funding.fundersLength;i++){
            Funder memory funder = funding.funders[i];
            if(funder.add==msg.sender){
                if(_isAgree == true){
                    proposal.states[i]=1;
                    proposal.agreeAmount += funder.cost;
                }
                else{
                    proposal.states[i]=2;
                    proposal.disAmount += funder.cost;
                }
            }
        }
        if(proposal.agreeAmount >= proposal.goal){
            proposal.isAgreed = true;
            funding.initiator.transfer(proposal.amount);
            funding.usedMoney += proposal.amount;
        }
        else if(proposal.disAmount >=proposal.goal){
            proposal.isAgreed = false;
        }
    }
    
    function getProposal(uint _fundId, uint _proposalId) public view returns(string memory, uint, uint, uint, uint, bool) {
        require(_fundId>=0 && _fundId<=allFundingsLength);
        Funding storage funding = allFundings[_fundId];
        require(_proposalId>=1 && _fundId<=funding.proposalsLength);
        Proposal storage proposal = funding.proposals[_proposalId];
        return (proposal.content, proposal.amount, proposal.agreeAmount, proposal.disAmount, proposal.goal, proposal.isAgreed);
    }
    
    //make sure the funder is in this funding
    modifier funderOfFunding(uint _fundId){
        require(_fundId>=0 && _fundId<=allFundingsLength);
        Funding storage funding = allFundings[_fundId];
        bool isIn = false;
        for(uint i = 1; i<=funding.fundersLength;i++){
            Funder memory funder = funding.funders[i];
            if(funder.add==msg.sender)
            isIn = true;
        }
        require(isIn == true);
        _;
    }
    
    function getMyFundings(uint _fundId) public view returns(uint){
        uint money=0;
        Funding storage funding = allFundings[_fundId];
        for(uint j=1;j<=funding.fundersLength;j++){
            Funder memory funder = funding.funders[j];
            if(funder.add==msg.sender)
            money+=funder.cost;
        }
        return money;
    }
    
    function getMyInitFundings(uint _fundId) public view returns(bool){
        return (allFundings[_fundId].initiator == msg.sender ? true:false);
    }
    
    function getProposalsLength(uint _fundId) public view returns(uint){
        return allFundings[_fundId].proposalsLength;
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}