
<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="项目名称">
      <a-input
        v-decorator="['FundingName', { rules: [{ required: true, message: '请输入项目名称' }] }]"
      />
    </a-form-item>
    <a-form-item label="项目描述">
      <a-input
        v-decorator="['FundingDescription', { rules: [{ required: true, message: '请输入项目描述' }] }]"
      />
    </a-form-item>
    <a-form-item label="目标金额">
      <a-input
        v-decorator="['AmountMoney',
        { rules: [{ required: true, message: '请输入众筹目标金额' }]}]"
      />
    </a-form-item>

      <a-form-item label="截止日期">
        <a-date-picker v-decorator="['DeadLine', { rules: [{ required: true, message: '请输入截止日期' }]}]" />
      </a-form-item>


    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>

  </a-form>
</template>

<script>
import {NewCrowdFunding} from "../ethernet/FundingApi";

export default {
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
        console.log(values.FundingName,values.FundingDescription,values.AmountMoney,(new Date()).valueOf(),values.DeadLine.valueOf());
        NewCrowdFunding(values.FundingName,values.FundingDescription,values.AmountMoney,(new Date()).valueOf(),values.DeadLine.valueOf())
        .then(()=>{
          alert("众筹发布成功");
        }).catch((err)=>{
          console.log(err.message);
        });
      });
    },
  }
};
</script>
