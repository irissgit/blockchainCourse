import { Table, Tag, Space, Button } from 'antd';
import React, { Component } from 'react';
import BasicLayout from '../layout';
import {getProposals,agreeProposal} from '../api/api';
import { Link } from 'react-router-dom';

const { Column } = Table;


class ProposalDetailPage extends Component{
    constructor(props){
      super(props)
      this.state = {
        proposals:[]
      }
    }
    
    componentDidMount = async () => {
      try {
          const fundid = this.props.match.params.fundid
          const response = await getProposals(fundid);
          this.setState((prevState) =>{
            return {
              proposals:prevState.proposals.concat(response)
            }
          });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          error
        );
      }
    };

     agree = async (proposalid) =>{
        try{
            agreeProposal(this.props.match.params.fundid,proposalid,true)
            alert('同意成功')
        }
        catch(error){
            alert(error)
        }
    }

    disagree = async (proposalid) =>{
        try{
            agreeProposal(this.props.match.params.fundid,proposalid,false)
            alert('拒绝成功')
        }
        catch(error){
            alert(error)
        }
    }
 
    render(){
        return (
        <BasicLayout>
        <Table dataSource={this.state.proposals}>
            <Column title="ProposalID" dataIndex="proposalid" key="proposalid" />
            <Column title="Content" dataIndex="content" key="content" />
            <Column title="Amount" dataIndex="amount" key="amount" />
            <Column
              title="Agree?"
              key="action"
              render={(text, record, index) => (
                <Space size="middle">
                  <Button onClick={()=>this.agree(record.proposalid)}>同意</Button>
                  <Button onClick={()=>this.disagree(record.proposalid)}>拒绝</Button>
                </Space>
              )}
            />
          </Table>
          </BasicLayout>);
    }
}

export default ProposalDetailPage;
