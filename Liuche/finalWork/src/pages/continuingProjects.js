import React from 'react';
import './web_css.css'
import {Card,List} from 'antd';
import {Link} from 'react-router-dom';
import {getProjectMessage, getProjectNum, isMyProject, timestamp2Time} from "../communicationWithContracts/communicationWithContracts";
const{Meta}=Card;
class continuingProjects extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            allprojects:[],
            path:"",
        }
    }

    getpath=async (id)=>{
        let ismy=await isMyProject(Number(id));
        if(ismy===true)
            return '/myfunding/'+id;
        else
            return '/funding/'+id;
    };

    async componentDidMount() {
        let projectNum=await getProjectNum();
        console.log(projectNum);
        var projects=[];
        var allpath=[];
        for(var i=0;i<projectNum;i++){
            let message=await getProjectMessage(i);
            let time=timestamp2Time(Number(message.deadline)).substring(5,16);
            if(Number(message.state)===0){
                 let path=await this.getpath(i.toString());
                 var ele={
                    title:message.title,
                    money:message.goal,
                    time:time,
                     id:message.id,
                     state:message.state,
                     holdingMoney:message.holdingMoney,
                };
                projects.push(ele);
                allpath.push(path);
            }
            else
                allpath.push('');
        }
        console.log(allpath);
        this.setState({
            allprojects:projects,
            path:allpath,
        })
    }

    differentState=(state,now)=>{
        if(state==='0')
            return <p>{'已经筹集: '+now+' WEI'}</p>
        else if(state==='1')
            return <p>众筹失败</p>
        else
            return <p>众筹成功</p>
    }

    getdescription=(time,money,state,now)=>{
        return(
            <div>
                <p>{'截至时间: '+time}</p>
                <p>{'目标金额: '+money+' WEI'}</p>
                {this.differentState(state,now)}
            </div>
        )
    }



    jump2Path=(id)=>{
        console.log(id);
        if(this.state.path==="")
            return "";
        else{
            return this.state.path[Number(id)]
        }
    }

    render() {
        return(
            <div class="lay">
                {/* <h1>正在众筹</h1> */}
                <List
                    grid={{gutter: 16, column: 5}}
                    dataSource={this.state.allprojects}
                    pagination={{
                    pageSize: 8,
                    }}
                    renderItem={item => (
                        <List.Item>
                            <Link  to={{pathname:this.jump2Path(item.id.toString())}}>
                                <Card title={item.title}  style={{ width: 200 }}>
                                    <Meta  description={this.getdescription(item.time,item.money,item.state,item.holdingMoney)} />                            
                                </Card>
                            </Link>
                        </List.Item>  
                    )}
                />
            </div>
        )
    }
}

export default continuingProjects;