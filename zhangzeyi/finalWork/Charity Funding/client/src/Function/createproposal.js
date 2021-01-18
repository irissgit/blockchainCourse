import React from 'react';
import {Input,Form,Button,InputNumber} from 'antd';
import 'antd/dist/antd.css';
import 'moment/locale/zh-cn';
import moment from 'moment';
import BasicLayout from '../layout';
import {createProposal} from '../api/api';
moment.locale('zh-cn');
 
const {TextArea} = Input;

class CreateProposalPage extends React.Component{
    constructor(props){
        super(props);
    }
    // 获取form的数据
    createNewProposal = async (value)=>{
        // 获取form的值
        let formData = this.refs.myForm.getFieldValue();
        let content = formData.content;
        let goalMoney = formData.goalMoney;
        let fundid = this.props.match.params.fundid;
        // 清空form的数据
        try{
            await createProposal(fundid, content, String(goalMoney))
            alert('使用请求创建成功!')
            this.refs.myForm.resetFields();
        }
        catch(error){
            alert(error)
        }
    }
    render(){
        return(
            <BasicLayout>
                <Form ref="myForm"
                    {...{
                        labelCol:{
                            xs:{span:24},
                            sm:{span:6},
                        },
                        wrapperCol:{
                            xs:{span:24},
                            sm:{span:18}
                        },
                    }}
                    style = {{paddingBottom:10,margin:20}} labelAlign="right" >
                        <Form.Item
                            label="用途和使用理由"
                            style={{width:"40%",marginRight:0}}
                            name = "content"
                        >
                            <TextArea rows={4}  placeholder="简介" />
                        </Form.Item>
                        <Form.Item
                            label="使用金额"
                            style={{width:"40%",marginRight:0}}
                            name = "goalMoney"
                        >
                            <InputNumber  placeholder="Ether" />
                        </Form.Item>
                        
                        <Form.Item
                            style={{width:"50%",marginRight:0}}
                        >
                            <Button type="primary" htmlType="submit" onClick={this.createNewProposal}>
                                提出申请
                            </Button>
                        </Form.Item>
                </Form>
                 
            </BasicLayout>
        )
    }
}
export default CreateProposalPage;
