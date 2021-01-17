pragma solidity 0.6.0;

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

contract Crowdfunding{
    using SafeMath for uint256;
    
    uint public projectNum=0;
    Project[] private projects;
    
    function createProject(
        string calldata title,
        string calldata description,
        uint need,
        uint duration
        )external{
            uint ddl = now.add(duration.mul(1 days));
            Project newProject= new Project(msg.sender,title,description,need,ddl);
            projects.push(newProject);
            projectNum++;
        }
        
    function getAllProjects() external view returns(Project[] memory){
        return projects;
    }
}

contract Project{
    using SafeMath for uint256;
    
    enum State{
        funding,
        failed,
        successful
    }
    
    struct Use{
        uint useMoney;
        string description;
        uint amountPassed;
        uint amountRejected;
        State state;
        mapping (address=>uint) voteResult;
    }
    
    address payable public initiator;
    uint public goal;
    uint public completeTime;
    uint public totalMoney;
    uint public holdingMoney;
    uint public deadline;
    string public title;
    string public description;
    State public state=State.funding;
    mapping (address=>uint) public contributions;
    Use[] public uses;
    uint public useNum=0;
    address payable[] public funders;
    uint public funderNum=0;
    
    constructor(
        address payable Initiator,
        string memory projectTitle,
        string memory projectDescription,
        uint Goal,
        uint Deadline
        )public{
            initiator=Initiator;
            title=projectTitle;
            description=projectDescription;
            goal=Goal;
            deadline=Deadline;
            holdingMoney=0;
    }
    function isFailed(uint deadline_)public view returns(bool){
        return now > deadline_;
    }

    function afterFailed()public {
        state=State.failed;
        completeTime=deadline;
        refund();
    }

    
    function contribute()public payable{
        require(state==State.funding);
        require(msg.sender!=initiator);
        require(msg.value>0);
        require(msg.value<=goal-holdingMoney);

        if(isFailed(deadline)){
             afterFailed();
        }
        contributions[msg.sender]=contributions[msg.sender].add(msg.value);
        holdingMoney=holdingMoney.add(msg.value);
        funders.push(msg.sender);
        funderNum++;
        checkIfSuccessorFail();
    }

    function isSuccessful()public view returns(bool){
        return holdingMoney>=goal;
    }

    function afterSuccessful()public {
        state=State.successful;
        completeTime=now;
    }
    
    function checkIfSuccessorFail() public{
        if(isSuccessful()){
            afterSuccessful();
        }
        else if(isFailed(deadline)){
            afterFailed();
        }
    }
    
    function createUse(string memory useDescription,uint cost_)public{
        require(state==State.successful);
        require(cost_<=holdingMoney);
        require(msg.sender==initiator);
        Use memory Areq=Use({
            useMoney:cost_,
            description:useDescription,
            amountPassed:0,
            amountRejected:0,
            state:State.funding
        });
        uses.push(Areq);
        useNum++;
    }
    
    function voteForUse(uint useID,bool vote_Result)public{
        require(msg.sender!=initiator);
        require(useID<useNum);
        require(uses[useID].state==State.funding);
        require(contributions[msg.sender]!=0);
        require(uses[useID].voteResult[msg.sender]==0);
        if(vote_Result==true){
            uses[useID].amountPassed+=contributions[msg.sender];
            uses[useID].voteResult[msg.sender]=1;
        }
        else{
            uses[useID].amountRejected+=contributions[msg.sender];
            uses[useID].voteResult[msg.sender]=2;
        }
        if(uses[useID].amountPassed*2>=goal){
            usePassed(useID);
        }
        else if(uses[useID].amountRejected*2>=goal){
            useRejected(useID);            
        }
    }
    function usePassed(uint useID)public{
        uses[useID].state=State.successful;
        afterUsePassed(useID);
    }
    function useRejected(uint useID)public{
        uses[useID].state=State.failed;
    }
    
    function afterUsePassed(uint useID_)public{
        require(uses[useID_].useMoney<=holdingMoney);
        require(uses[useID_].state==State.successful);
        initiator.transfer(uses[useID_].useMoney);
        holdingMoney-=uses[useID_].useMoney;
    }
    
    function refund() public {
        require(state==State.failed);
        for(uint i=0;i<funderNum;i++){
            funders[i].transfer(contributions[funders[i]]);
        }
    }
    
    function getVoteResult(address payable voterAddress,uint use_ID)public view returns(uint){
        require(use_ID<useNum);
        return uses[use_ID].voteResult[voterAddress];
    }
}