import { Table, Tag, Space } from 'antd';
import React, { Component } from 'react';
import BasicLayout from './layout';
import {web3, getAllFundings} from './api/api';
import { Link } from 'react-router-dom';

const { Column } = Table;


class FundingTable extends Component{
    constructor(props){
      super(props)
      this.state = {
        fundings:[]
      }
    }
    
    componentDidMount = async () => {
      try {
          const response = await getAllFundings();
          this.setState((prevState) =>{
            return {
              fundings:prevState.fundings.concat(response)
            }
          });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
      }
    };
  

    render(){
        return (
        <BasicLayout>
        <Table dataSource={this.state.fundings}>
            <Column title="FundID" dataIndex="fundid" key="fundid" />
            <Column title="Title" dataIndex="title" key="title" />
            <Column title="Content" dataIndex="content" key="content" />
            <Column title="Goal(ether)" dataIndex="goalMoney" key="goalMoney" />
            <Column
              title="Deadline"
              dataIndex="deadline"
              key="deadline"
            />
            <Column
              title="Detail"
              key="action"
              render={(text, record, index) => (
                <Space size="middle">
                  <Link to={{pathname:'/detail/' + index}}>详情</Link>
                </Space>
              )}
            />
          </Table>
          </BasicLayout>);
    }
}

export default FundingTable;