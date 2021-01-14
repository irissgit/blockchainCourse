import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import BasicLayout from './layout';
import FundingTable from './FundingTable';
import CreatePage from './Function/create';
import InitiatorPage from './Function/initiator';
import MyFundingsPage from './Function/myFundings';
import CreateProposalPage from './Function/createproposal';
import DetailPage from './Function/Detail';
import ProposalDetailPage from './Function/proposaldetail';
import 'antd/dist/antd.css';

class App extends Component {
  state = { storageValue: Array(), web3: null, accounts: null, contract: null, show:null };

  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path='/' component={BasicLayout}/>
          <Route path='/FundingTable' component={FundingTable}/>
          <Route path='/create' component={CreatePage}/>
          <Route path='/initiator' component={InitiatorPage}/>
          <Route path='/myFundings' component={MyFundingsPage}/>
          <Route path='/detail/:fundid' component={DetailPage}/>
          <Route path='/createproposal/:fundid' component={CreateProposalPage}/>
          <Route path='/proposaldetail/:fundid' component={ProposalDetailPage}/>
        </div>
      </HashRouter>
    );
  }
}

export default App;
