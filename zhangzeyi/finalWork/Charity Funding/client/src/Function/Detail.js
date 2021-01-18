import React,{ Component } from "react";
import BasicLayout from '../layout';
import { Descriptions, Badge } from 'antd';
import {getSingleFunding} from '../api/api';
import { Input, Space } from 'antd';
import {contribute,getBalance} from '../api/api'

const{Search}=Input;

class DetailPage extends Component{
    constructor(props){
        super(props)
        this.state = {
          funding:{}
        }
      }
      
    componentDidMount = async () => {
    try {
        const response = await getSingleFunding(this.props.match.params.fundid);
        this.setState({funding:response});
    } catch (error) {
        alert(
        error
        );
    }
    };
    


    render(){
        return (
            <BasicLayout>
                <Descriptions title="Funding Detail" bordered>
                    <Descriptions.Item label="Title">{this.state.funding.title}</Descriptions.Item>
                    <Descriptions.Item label="Deadline" span={2}>{this.state.funding.deadline}</Descriptions.Item>
                    <Descriptions.Item label="Initiator" span={2}>{this.state.funding.initiator}</Descriptions.Item>
                    <Descriptions.Item label="Goal Money">{this.state.funding.goalMoney} ether</Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                        <Badge status="processing" text="Running" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Raise Money" span={2}>{this.state.funding.raisedMoney} ether</Descriptions.Item>
                    <Descriptions.Item label="Used Money">{this.state.funding.usedMoney} ether</Descriptions.Item>
                    <Descriptions.Item label="Content">
                    {this.state.funding.content}
                    </Descriptions.Item>
                </Descriptions>
                <div>
                    <Space>
                        <Search
                        placeholder="contribute money"
                        allowClear
                        enterButton="Contribute"
                        size="large"
                        onSearch={async (value) =>{
                            try{
                                console.log(value)
                                await contribute(this.props.match.params.fundid,value)
                                await getBalance()
                                alert('参与成功！')
                            }
                            catch(error)
                            {
                                alert(error)
                            }}}
                        />
                </Space>
                </div>
            </BasicLayout>
        );
    }
}




export default DetailPage;
