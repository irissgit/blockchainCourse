import CharityFunding from "../contracts/CharityFunding.json";
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

const contract = new web3.eth.Contract(
    CharityFunding.abi,
    "0x32cd120ad87b1b1C27377797D7aaC29c89a2bBdD",
    );


async function getAccount(){
    let accounts = await web3.eth.getAccounts()
    return accounts[0];
}

async function getAllFundingsLength(){
    return await contract.methods.allFundingsLength().call()
}

async function getSingleFunding(fundID){
    let funding = await contract.methods.allFundings(fundID).call()
    funding.deadline = getLocalTime(funding.deadline);
    funding.goalMoney = web3.utils.fromWei(funding.goalMoney,'ether')
    funding.raisedMoney = web3.utils.fromWei(funding.raisedMoney,'ether')
    funding.usedMoney = web3.utils.fromWei(funding.usedMoney,'ether')
    return funding;
}

async function getAllFundings(){
    const length = await getAllFundingsLength()
    let fundings = []
    for(let i = 0;i<length;i++){
        let funding = {}
        funding = await getSingleFunding(i)
        funding['fundid'] = i;
        fundings.push(funding);
    }
    return fundings;
}

async function getMyFundings(){
    let account = await getAccount();
    let length = await getAllFundingsLength();
    let fundings = []
    for(let i=0;i<length;i++){
        let funding = {}
        let cost = await contract.methods.getMyFundings(i).call({
            from:account
        })
        if(cost > 0){
            funding = await getSingleFunding(i)
            funding['cost'] = web3.utils.fromWei(cost,'ether')
            funding['fundid'] = i
            fundings.push(funding);
            }
        }
    return fundings;
}

async function getMyInitFundings(){
    let account = await getAccount();
    let length = await getAllFundingsLength();
    let fundings = []
    for(let i=0;i<length;i++){
        let funding = {}
        let cost = await contract.methods.getMyInitFundings(i).call({
            from:account
        })
        if(cost==true){
            funding = await getSingleFunding(i)
            funding['fundid'] = i
            fundings.push(funding);
            }
        }
    return fundings;
}

async function getProposals(fundid){
    const length = await contract.methods.getProposalsLength(fundid).call()
    let proposals = []
    for(let i = 1;i<=length;i++){
        let temp = await contract.methods.getProposal(fundid,i).call()
        let proposal = {
            content:temp[0],
            amount:web3.utils.fromWei(temp[1],'ether'),
            agreeAmount:web3.utils.fromWei(temp[2],'ether'),
            disAmount:web3.utils.fromWei(temp[3],'ether'),
            goal:web3.utils.fromWei(temp[4],'ether'),
            isAgreed:temp[5]
        }
        proposal['proposalid'] = i;
        proposals.push(proposal);
    }
    return proposals;
}

async function createFunding(title,content,goalMoney,deadline){
    const account = await getAccount();
    const goal = web3.utils.toWei(goalMoney,'ether')
    const fundid = await contract.methods.createFunding(account, title, content, goal, deadline).send({
        from:account
    })
    return fundid;
}

async function agreeProposal(fundid, proposalid, isAgree){
    const account = await getAccount();
    await contract.methods.agreeProposal(fundid, proposalid, isAgree).send({
        from:account
    })
}

async function createProposal(fundid,content,goalMoney){
    const account = await getAccount();
    const goal = web3.utils.toWei(goalMoney,'ether')
    return await contract.methods.createProposal(fundid, content, goal).send({
        from:account
    })
}

async function contribute(fundid,money){
    const account = await getAccount();
    const t = web3.utils.toWei(money,'ether');
    await contract.methods.contribute(fundid).send({
        from:account,
        value:t
    })
}

async function getBalance(){
    let balance = await contract.methods.getBalance().call()
    console.log(balance)
}

function getLocalTime(nS) {     
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');     
 }


export {
    web3,
    contract,
    getAllFundingsLength,
    getSingleFunding,
    getAllFundings,
    getAccount,
    getMyFundings,
    getMyInitFundings,
    contribute,
    getBalance,
    createFunding,
    createProposal,
    getProposals,
    agreeProposal,
}