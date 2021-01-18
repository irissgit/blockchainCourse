<template>
      <div>
        <a-card>
          <p>创建人地址:{{info[0]}}</p>
          <p>名称:{{info[1]}}</p>
          <p>描述:{{info[2]}}</p>
          <p>目标金额:{{info[3]}}</p>
          <p>发布时间:{{getDate(info[4])}}</p>
          <p>截止日期:{{getDate(info[5])}}</p>
        </a-card>
        <br/>
      </div>
</template>

<script>
import {getDetailByAddr,getAllFundingAddr} from "../ethernet/FundingApi";
import moment from 'moment'

export default {
  props:{
    info:{
      default:0
    }
  },
  data() {
    return {
      msg: 0,
      addr: 0,
      funding:[],
      loading: true,
    };
  },
  mounted:function() {
    console.log(this.info);
  },
    methods:{
    async getData(){
      await getAllFundingAddr().then(re =>{
        this.addr = re;
      });
    },
    async getDetail(){
      this.funding = await Promise.all(this.addr.map(async(item)=>{
        return await getDetailByAddr(item)
      }))
      console.log(this.funding);
    },
      getDate(date){
        return moment.unix(date/1000).format("YYYY-MM-DD")
      }
  },

};

</script>
