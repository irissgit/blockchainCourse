import React from 'react';
import {Button, Form, InputNumber, Modal, Space,Table} from 'antd';
import './web_css.css'
import {contribute, getProjectMessage,voteForUse, timestamp2Time,getContribution,getUse,getVoteResult} from "../communicationWithContracts/communicationWithContracts";
import web3 from "../web3/web3";
var value="";
var projectID=0;
const columns=[
            {
                title:'序号',
                dataIndex:'id',
                key:'id',
                align:'center',
                render:text=>{
                    return Number(text)+1;
                }
            },
            {
                title:'目的',
                dataIndex:'description',
                key:'description',
                align:'center'
            },
            {
                title: '金额',
                dataIndex: 'useMoney',
                key: 'useMoney',
                align:'center'
            },
            {
                title:'状态',
                dataIndex:'state',
                key:'state',
                align:'center',
                render:text => {
                    if(text==='0')
                        return '等待结果';
                    else if(text==='2')
                        return '已通过';
                    else
                        return '未通过';
                }
            },
            {
                title:'我的投票',
                dataIndex:'id',
                key:'id',
                align:'center',
                render:text=>{
                    if(value==='')
                        return '';
                    else{
                        console.log(value);
                        if(value[text].state==='0'){
                            if(value[text].result==='0')
                                return(
                                    <Space direction='horizontal'>
                                        <Button onClick={()=>handle(text,true)}>同意</Button>
                                        <Button onClick={()=>handle(text,false)}>否决</Button>
                                    </Space>
                                );
                            else if(value[text].result==='1')
                                return '同意';
                            else
                                return '否决'
                        }
                        else{
                            console.log(value);
                            if(value[text].result==='0')
                                return '未投票';
                            else if(value[text].result==='1')
                                return '同意';
                            else if(value[text].result==='2')
                                return '否决';
                        }
                    }
                }
            }

        ];

let handle=async (index,result)=>{
    try{
        await voteForUse(projectID,index,result);
        alert('投票成功');
    }catch(error){
        console.log(error);
    }
}

class projectDetails extends React.Component{


    constructor(props) {
        super(props);
        this.state={
            id:this.props.match.params.id,
            time:"",
            message:"",
            complete:"",
            visible:false,
            contributeBtnDisable:false,
            money:"",
            mymoney:"",
            usesList:"",
        }
        projectID=Number(this.state.id)
    }

    async componentDidMount() {
        let message=await getProjectMessage(Number(this.state.id));
        console.log(message);
        let time=timestamp2Time(Number(message.deadline)).substring(5,16);
        let complete=timestamp2Time(Number(message.completetime)).substring(5,16);
        let accounts=await web3.eth.getAccounts();
        let account=accounts[0];
        let money=await getContribution(Number(this.state.id),account);
        let usesList=[];
        let useNum=message.useNum;
        var ele;
        let btnDisable;
        if(message.state==="2")
            btnDisable=true;
        for(var i=0;i<useNum;i++){
            let use=await getUse(Number(this.state.id),i);
            let result=await getVoteResult(Number(this.state.id),account,i);
            ele={
                id:i,
                useMoney:use.useMoney,
                description:use.description,
                state:use.state,
                result:result,
            };
            usesList.push(ele);
        }
        value=usesList;
        console.log(usesList);        
            
        this.setState({
            time:time,
            message:message,
            complete:complete,
            contributeBtnDisable:btnDisable,
            address:account,
            mymoney:money,
            usesList:usesList
        });
    }

    emptyOr=(thing)=>{
        if(this.state.message==="")
            return "";
        else
            return thing;
    }

     showModal=()=>{
         this.setState({
            visible: true,
        });
     }

     handleOk = async () => {
         if(this.state.money===null||this.state.money===0)
             alert("请输入有效金额！");
         let accounts=await web3.eth.getAccounts();
         let account=accounts[0];
         if(this.state.message.creator===account)
             alert("无法投资自己的项目！")
         else{
             if(Number(this.state.money)%1!==0)
                 alert("众筹金额必须为正整数！");
             else{
                 try{
                      await contribute(Number(this.state.id),Number(this.state.money));
                      alert('支持成功！感谢您！');
                      let message=await getProjectMessage(Number(this.state.id));
                      let accounts=await web3.eth.getAccounts();
                      let account=accounts[0];
                      let money=await getContribution(Number(this.state.id),account);
                      this.setState({
                            message:message,
                            mymoney:money
                        })
                 }catch(error){
                      console.log(error);
                 }
             }
         }
        this.setState({ visible: false });
    };

     handleCancel = () => {
        this.setState({ visible: false });
    };

     getmy=()=>{
       return this.state.mymoney.toString();
         
     }

     getdata=(usesList)=>{
         if(usesList==='')
             return [];
         else{
             return usesList;
         }
     }

     gettable=()=>{
         if(this.state.mymoney.toString()==="")
             return "";
         else{
             let mymon=Number(this.getmy());
             if(mymon===0)
                 return "";
             else
                 return (
                     <div>
                         <div className='tableHeader'><h2>使用申请表</h2></div>
                         <div>
                            <Table columns={columns} dataSource={this.getdata(this.state.usesList)}/>
                         </div>
                     </div>
                 )
         }
     }

     result=(res)=>{
         if(res==="0")
            return (
                <div>
                    <span className='detailItem'>{'已筹总额：' + this.emptyOr(this.state.message.nowmoney)+' WEI'}</span>
                    <span className='detailItem'>{'我支持过：' + this.getmy()+' WEI'}</span>
                </div>                
            )
        else if(res==="1")
                return (
                    <span className='detailItem'>众筹失败，再去看看其他项目吧！</span>
                )
        else if(res==="2")
            return (
                <div>
                    <span className='detailItem'>{'众筹成功,剩余金额：'+this.emptyOr(this.state.message.nowmoney)+' WEI'}</span>
                    <span className='detailItem'>{'我支持过：' + this.getmy()+' WEI'}</span>
                </div>
            )
     }

     btnOrTable=(state)=>{
         if(state==="2")
            return this.gettable();
     }     

     returnafter=()=>{
         if(this.state.message==="")
             return "";
        else
        return(
            <div>
                <div className='details'>
                    <span className='detailItem'>{'目标金额：' + this.emptyOr(this.state.message.goal)+' WEI'}</span>
                    {this.result(this.state.message.state)}
                    <span className='detailItem'>{'截至日期：' + this.state.time}</span>
                </div>
                {this.btnOrTable(this.state.message.state)}
                <div class='tableHeader'><Button disabled={this.state.contributeBtnDisable} type='primary' size='large' onClick={this.showModal}>支持该项目</Button></div>
            </div>
        )
        
     };

    render() {

        return (
            <div>
                <div class="lay">
                    <h2>{'项目标题：'+this.emptyOr(this.state.message.title)}</h2>
                </div>
                <div className="lay">
                    <h2>{'项目简介：' + this.emptyOr(this.state.message.description)}</h2>
                    {this.returnafter()}
                </div>
                <Modal
                    visible={this.state.visible}
                        title="支持项目"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary"  htmlType="submit" onClick={this.handleOk}>
                            确定
                        </Button>,
                        ]}>
                        <Form>
                            <Form.Item name="支持金额" label="支持金额/WEI" rules={[{ required: true}]}>
                                <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        money:value,
                                    });
                                }}/>
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        );
    }
}
export default projectDetails;
