import React from 'react';
import {Input,DatePicker,Form,Button,InputNumber} from 'antd';
import 'antd/dist/antd.css';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import BasicLayout from '../layout';
import {createFunding} from '../api/api';
moment.locale('zh-cn');
 
const {TextArea} = Input;

class CreatePage extends React.Component{
    constructor(props){
        super(props);
    }
    // 获取form的数据
    createNewFunding = async (value)=>{
        // 获取form的值
        let formData = this.refs.myForm.getFieldValue();
        let title = formData.title;
        let content = formData.content;
        let goalMoney = formData.goalMoney;
        let deadline;
        if(formData.deadline){
            // 转换日期格式
            deadline = new Date(moment(formData.deadline).format("YYYY-MM-DD HH:mm:ss")).valueOf();
        }
        // 清空form的数据
        try{
            const fundid = await createFunding(title, content, String(goalMoney), deadline)
            alert('创建成功!')
            this.refs.myForm.resetFields();
        }
        catch(error){
            alert(error)
        }
    }
    render(){
        // const { getFieldDecorator } = this.props.form;
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
                            label="众筹标题"
                            style={{width:"25%",marginRight:0}}
                            name = "title"
                        >
                            <Input  placeholder="标题" />
                        </Form.Item>
                        <Form.Item
                            label="内容简介"
                            style={{width:"25%",marginRight:0}}
                            name = "content"
                        >
                            <TextArea rows={4}  placeholder="简介" />
                        </Form.Item>
                        <Form.Item
                            label="目标金额"
                            style={{width:"25%",marginRight:0}}
                            name = "goalMoney"
                        >
                            <InputNumber  placeholder="Ether" />
                        </Form.Item>
                        <Form.Item
                            label= "结束时间"
                            style={{width:"25%",marginRight:0}}
                            name = "deadline"
                            rules= {[
                                {
                                  required: true,
                                  message: '请选择!',
                                }]}
                            >
                            <DatePicker
                             showTime
                             locale={locale}
                             style={{width:195}}
                             placeholder="请选择"
                             format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                        
                        <Form.Item
                            style={{width:"25%",marginRight:0}}
                        >
                            <Button type="primary" htmlType="submit" onClick={this.createNewFunding}>
                                提出申请
                            </Button>
                        </Form.Item>
                </Form>
                 
            </BasicLayout>
        )
    }
}
export default CreatePage;
