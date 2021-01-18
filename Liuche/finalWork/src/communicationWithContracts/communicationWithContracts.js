import web3 from "../web3/web3";
import {CROWDFUNDING_ADDRESS, CROWDFUNDING, PROJECT} from '../contracts_config.js'

let crowdFund = new web3.eth.Contract(CROWDFUNDING, CROWDFUNDING_ADDRESS);


let getProjectNum=async ()=>{
    let res=await crowdFund.methods.projectNum().call();
    console.log(res);
    return res;
};

let createProject=async(title,des,money,days)=>{
    let account = await web3.eth.getAccounts();
    return await crowdFund.methods.createProject(title,des,money,days).send({
        from:account[0],
        gas:3000000,
    })
};

let getAllProjects=async ()=>{
    return await crowdFund.methods.getAllProjects().call();
};

let contribute=async (i,money)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    console.log(account);
    return await project.methods.contribute().send({
        from:account,
        value:Number(money),
        gas:3000000,
    })
};

let getContribution=async (i,address)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    return await project.methods.contributions(address).call();
}

let getUse=async (i,index)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    console.log(1);
    return await project.methods.uses(index).call();
};

let createUse=async(i,purpose,cost)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    let initiator=await project.methods.initiator().call();
    if(account!==initiator)
        alert("您无权使用此项目金额");
    else
        return await project.methods.createUse(purpose,cost).send({
            from:account,
            gas:3000000,
        });
};

let voteForUse=async (i,index,agree)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    console.log(account);
    return await project.methods.voteForUse(index,agree).send({
        from:account,
        gas:3000000,
    })
};

let getVoteResult=async (proid,address,id)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[proid]);
    let res=await project.methods.getVoteResult(address,id).call();
    console.log(address);
    console.log(res);
    return res;
}

let getProjectMessage=async (i)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    let initiator=await project.methods.initiator().call();
    let goal=await project.methods.goal().call();
    let description = await project.methods.description().call();
    let deadline=await project.methods.deadline().call();
    var timestamp = Math.round(new Date() / 1000);
    let completetime=await project.methods.completeTime().call();
    let totalMoney=await project.methods.goal().call();
    let holdingMoney=await project.methods.holdingMoney().call();
    let state=await project.methods.state().call();
    let useNum=await project.methods.useNum().call();
    let funderNum=await project.methods.funderNum().call();
    let title=await project.methods.title().call();
    return {
        initiator: initiator,
        goal: goal,
        description: description,
        deadline:deadline,
        now:timestamp,
        completetime:completetime,
        totalMoney:totalMoney,
        holdingMoney:holdingMoney,
        state:state,
        useNum:useNum,
        funderNum:funderNum,
        title:title,
        id:i,
    };
};

let isMyProject=async (i)=>{
    let allProjects=await crowdFund.methods.getAllProjects().call();
    let project=await new web3.eth.Contract(PROJECT, allProjects[i]);
    let initiator=await project.methods.initiator().call();
    let accounts=await web3.eth.getAccounts();
    return initiator === accounts[0];
};

let isMyContribution=async (i)=>{
    let accounts=await web3.eth.getAccounts();
    let account=accounts[0];
    let money=await getContribution(i,account);
    return Number(money) !== 0;
}

let timestamp2Time=(timestamp)=> {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
    var h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
    var m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
    var s = (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
    return Y + M + D + h + m + s;
}



export {getProjectNum,createProject,getAllProjects,contribute,getProjectMessage,createUse,getUse,voteForUse,timestamp2Time,isMyProject,isMyContribution,getContribution,getVoteResult};