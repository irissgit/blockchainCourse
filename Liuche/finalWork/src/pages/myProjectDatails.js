import React from 'react';
import {Button, Form, Input, InputNumber, Modal, Table} from 'antd';
import './web_css.css'
import { getProjectMessage, timestamp2Time, getContribution, createUse, getUse,} from "../communicationWithContracts/communicationWithContracts";
import web3 from "../web3/web3";

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
                        return '正在等待批准';
                    else if(text==='2')
                        return '已经批准';
                    else
                        return '未被批准';
                }
            },

        ];

class myProjectDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            id:this.props.match.params.id,
            time:"",
            message:"",
            complete:"",
            visible:false,
            money:"",
            mymoney:"",
            aim:"",
            cost:"",
            usesList:"",
        }
        projectID=Number(this.state.id)
    }

    // goBackPage = () => {
    //   history.goBack();  //返回上一页这段代码
    // };

    getdata=(usesList)=>{
         if(usesList==='')
             return [];
         else{
             return usesList;
         }
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
        for(var i=0;i<useNum;i++){
            let use=await getUse(Number(this.state.id),i);
            ele={
                id:i,
                useMoney:use.useMoney,
                description:use.description,
                state:use.state,
            };
            usesList.push(ele);
        }
        console.log(usesList);
        this.setState({
            time:time,
            message:message,
            complete:complete,
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

     clickOk = async () => {
         if(this.state.cost===null||this.state.cost===0||this.state.cost==="")
             alert("请输入有效金额！");
         else if(this.state.aim==="")
             alert("请输入您的使用目的");
         else{
             if(Number(this.state.money)%1!==0)
                 alert("金额必须为正整数！");
             else if(Number(this.state.cost)>this.state.message.holdingMoney)
                 alert("申请金额不能超过项目剩余资金！");
             else {
                 try {
                     await createUse(Number(this.state.id), this.state.aim, Number(this.state.cost));
                     alert('申请成功!');
                 }catch(error){
                      console.log(error);
                 }
             }
         }
        this.setState({ visible: false });
    };

     clickCancel = () => {
        this.setState({ visible: false });
    };

     gettable=()=>{
         return (
             <div>
                 <div className='tableHeader'><h2>众筹金额使用申请表</h2></div>
                 <div>
                     <Table columns={columns} dataSource={this.getdata(this.state.usesList)}/>
                 </div>
             </div>
         )
     }

     result=(res)=>{
         if(res==="0")
            return '已筹总额：' + this.emptyOr(this.state.message.holdingMoney)+' WEI';
         else if(res==="1")
            return "众筹失败，再去看看其他项目吧！";
        else if(res==="2")
            return '众筹成功,目前剩余众筹金额为：' + this.emptyOr(this.state.message.holdingMoney)+' WEI';
     }
     
     canUse=(state)=>{
         if(state==="2")
            return(
                <div>
                    <Button tyepe='primary' size='large' onClick={()=>this.showModal()}>申请使用</Button>
                    {this.gettable()}
                </div>                
            )
     }

     returnafter=()=>{
         if(this.state.message==="")
             return "";
         else
         return(
            <div>
                <div className='details'>
                    <span className='detailItem'>{'目标金额：' + this.emptyOr(this.state.message.goal)+' WEI'}</span>
                    <span className='detailItem'>{this.result(this.state.message.state)}</span>
                    <span className='detailItem'>{'截至日期：' + this.state.time}</span>
                </div>
                {this.canUse(this.state.message.state)}
            </div>
        )
     };

     getAim=(e)=>{
         this.setState({
             aim:e.target.value,
         })
     }

    render() {
        return (
            <div>
                {/* <div class="btn">
                     <Button size="large"  onClick={this.goBackPage}>返回</Button>
                </div> */}
                <div class="lay">
                    <h2>{'项目标题：'+this.emptyOr(this.state.message.title)}</h2>
                </div>
                <div className="lay">
                    <h2>{'项目简介：' + this.emptyOr(this.state.message.description)}</h2>
                    {this.returnafter()}
                </div>
                <Modal
                    visible={this.state.visible}
                        title="申请使用"
                        onOk={this.clickOk}
                        onCancel={this.clickCancel}
                        footer={[
                        <Button key="back" onClick={this.clickCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary"  htmlType="submit" onClick={this.clickOk}>
                            确定
                        </Button>,
                        ]}>
                        <Form>
                            <Form.Item name="使用目的" label="使用目的" rules={[{ required: true}]}>
                                <Input placeholder="使用目的" onChange = {(e)=>this.getAim(e)}/>
                            </Form.Item>
                            <Form.Item name="使用金额" label="使用金额/WEI" rules={[{ required: true}]}>
                                <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        cost:value,
                                    });
                                }}/>
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        );
    }
}
export default myProjectDetails;
