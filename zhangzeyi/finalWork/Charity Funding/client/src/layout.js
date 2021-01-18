import React,{ Component } from 'react';
import { Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {web3,getAccount} from './api/api';



const { Header, Footer, Sider, Content } = Layout;

// 引入子菜单组件
const SubMenu = Menu.SubMenu; 

export default class BasicLayout extends Component {
  constructor(props){
    super(props)
    this.state = {
      account:null
    }
  }

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({account:accounts[0]});
    console.log(this.state.account)
  }

  render() {
    return (
      <Layout>
        <Sider width={256} style={{ minHeight: '100vh' }}>
          <div style={{ height: '32px', background: 'rgba(255,255,255,.2)', textAlign: 'center', margin: '16px'}}>
            <span style={{color:'white', fontSize:'20px'}}>众筹DAPP</span>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
            <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2">
            <Link to="/FundingTable">所有众筹</Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span>功能</span>}
            >
                <Menu.Item key="3"><Link to="/create">创建众筹</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/initiator">我创建的众筹</Link></Menu.Item>
                <Menu.Item key="5"><Link to="/myFundings">我参与的众筹</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout >
          <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>当前地址：{this.state.account}</Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Charity Funding DAPP ©2021 Created by ZhangZeyi</Footer>
        </Layout>
      </Layout>
    )
  }
}