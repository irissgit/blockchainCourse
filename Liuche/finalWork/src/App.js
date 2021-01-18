import React from 'react'
import TopBar from "./pages/TopBar";
import allProjects from "./pages/allProjects";
import continuingProjects from "./pages/continuingProjects";
import myContributedProjects from "./pages/myContributedProjects";
import myProjects from "./pages/myProjects";
import projectDetails from './pages/projectDetails';
import myProjectDatails from "./pages/myProjectDatails";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

var storage=window.localStorage;

class App extends React.Component {

  render() {
    storage.setItem("TopbarKey","0");
    return (
      <div className="container">
        <BrowserRouter>
          <TopBar/>
          <Switch>
            <Route exact path = "/" component = {allProjects}/>
            <Route exact path = "/continuingProjects" component = {continuingProjects}/>
            <Route exact path = "/myContributedProjects" component = {myContributedProjects}/>
            <Route exact path = "/myProjects" component = {myProjects}/>
            <Route exact path = "/funding/:id" component={projectDetails}/>
            <Route exact path = "/myfunding/:id" component={myProjectDatails}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;