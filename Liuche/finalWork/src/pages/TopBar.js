import React from 'react';
import {Button,Menu,Modal, Form, Input,InputNumber} from 'antd';
import {Link,} from 'react-router-dom';
import MenuItem from 'antd/lib/menu/MenuItem';
import { MoneyCollectOutlined,DollarCircleOutlined, HomeOutlined,BulbOutlined } from '@ant-design/icons';
import picture from './logo.jpg'
import './web_css.css'
import {getProjectNum, createProject} from "../communicationWithContracts/communicationWithContracts";

const { TextArea } = Input;
var storage = window.localStorage;

class TopBar extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            current: storage.getItem("TopbarKey"),
            visible:false,
            title:"",
            description:"",
            day:3,
            money:0,
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

     handleOk = async () => {
         if(this.state.title===""||this.state.description===""||this.state.day===null||this.state.money===null||this.state.money===0)
             alert("所有信息都是必填的！");
         else{
             if(Number(this.state.money)%1!==0)
                 alert("众筹金额必须为正整数！");
             else if(Number(this.state.day)%1!==0)
                 alert("众筹时间必须为正整数！");
             else{
                 try{
                      await createProject(this.state.title,this.state.description,Number(this.state.money),Number(this.state.day));
                      let balance=await getProjectNum();
                      console.log(balance);
                      alert('发布成功！');
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

    GetName=(e)=>{
        this.setState({
            title:e.target.value,
        })
    };

    Getcontent=(e)=>{
        this.setState({
            description:e.target.value,
        })
    };


    handleClick = e => {
        this.setState({
          current: e.key,
        });
        storage.setItem("TopbarKey",e.key);
    };

    render() {
        return(
            <div class = "navigatorBar">
                <img class = "pic" src = {picture} alt="logo"/>
                <div class = "slogan"> 有了众筹，缺钱不愁 </div>
                <div style = {{alignSelf:'flex-end'}}>
                    <Menu theme="dark" onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                        <MenuItem key = "0" icon={<MoneyCollectOutlined/>}>
                          <Link to = "/"> 所有众筹 </Link>
                        </MenuItem>
                        <MenuItem key = "1" icon={<BulbOutlined />}>
                          <Link to = "/continuingProjects"> 正在众筹 </Link>
                        </MenuItem>
                        <MenuItem key = "2" icon={<HomeOutlined />}>
                          <Link to = "/myProjects">我发起的</Link>
                        </MenuItem>
                        <MenuItem key = "3" icon={<DollarCircleOutlined />}>
                          <Link to = "/myContributedProjects"> 我支持的 </Link>
                        </MenuItem>
                    </Menu>
                </div>
                <div style = {{marginLeft: "auto"}}>
                    <Button type="primary" size='default' onClick={this.showModal}>发起众筹</Button>
                </div>
                 <Modal
                        visible={this.state.visible}
                        title="发起众筹"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary"  htmlType="submit" onClick={this.handleOk}>
                            发布
                        </Button>,
                        ]}>
                        <Form>
                            <Form.Item name="项目概述" label="项目标题" rules={[{ required: true}]}>
                                <Input placeholder="请输入项目标题" onChange = {(e)=>this.GetName(e)}/>
                            </Form.Item>
                            <Form.Item name="项目介绍" label="项目简介" rules={[{ required: true}]}>
                                <TextArea rows={4} placeholder="请输入项目简介" onChange = {(e)=>this.Getcontent(e)}/>
                            </Form.Item>
                            <Form.Item name="众筹金额" label="众筹金额(单位:wei)" rules={[{ required: true}]}>
                                <InputNumber min={1}   onChange={value=>{
                                    this.setState({
                                        money:value,
                                    });
                                }}/>
                            </Form.Item>
                            <Form.Item name="众筹时间" label="众筹时间(单位:天)" rules={[{ required: true}]}>
                                <InputNumber min={1}  /*defaultValue={3}*/ onChange={value=>{
                                    this.setState({
                                        day:value,
                                    });
                                }} />
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        );
    }
}

export default TopBar;