import { AllFundingInstance,SingleFundingInstance,newFundingInstance } from './FundingAbi'
import web3 from "../../utils/InitWeb3";

let getAllFundingAddr = async () =>{
    const result = await AllFundingInstance.methods.getFundings().call();
    return result;
}

let getDetailByAddr = async (addr) => {
  let SingleFund = newFundingInstance()
  SingleFund.options.address = addr
  const result = await SingleFund.methods.FundingInfo().call().catch(err=>{
    console.log(err.message);
  });
  return result;
}

let NewCrowdFunding = (projectName, projectDetail, targetMoney, startTime, endTime) => {
  return new Promise(async () => {
      let accounts = await web3.eth.getAccounts();
      await AllFundingInstance.methods.NewCrowdFunding(projectName,
        projectDetail, targetMoney, startTime, endTime).send({
        from:accounts[0],
      })
  })
}

export {
  NewCrowdFunding,
  getAllFundingAddr,
  getDetailByAddr,

}
