<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['4']">
        <a-menu-item v-on:click="btnClick(0)"key="1">
          <a-icon type="team" />
          <span class="nav-text">所有众筹</span>
        </a-menu-item>
        <a-menu-item v-on:click="btnClick(1)"key="2">
          <a-icon type="video-camera" />
          <span class="nav-text">我发起的</span>
        </a-menu-item>
        <a-menu-item v-on:click="btnClick(2)"key="3">
          <a-icon type="upload" />
          <span class="nav-text">我参与的</span>
        </a-menu-item>
        <a-menu-item v-on:click="btnClick(3)"key="4">
          <a-icon type="usergroup-add" />
          <span class="nav-text">发起众筹</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />

      <a-layout-content v-if="msg===0":style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
          <div v-for="(fund,i) in funding">
            <Card v-bind:info="fund"></Card>
          </div>
        </div>
      </a-layout-content>

      <a-layout-content v-if="msg===1":style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
          <div v-for="(fund,i) in funding">
          <Card v-bind:info="fund"></Card>
            </div>
        </div>
      </a-layout-content>

      <a-layout-content v-if="msg===3":style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
          <NewFunding></NewFunding>
        </div>
      </a-layout-content>

      <a-layout-footer :style="{ textAlign: 'center' }">
        2020年秋冬学期区块链大程
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>

<script>
import Card from '@/components/Card'
import NewFunding from "./NewFunding";
import {getDetailByAddr,getAllFundingAddr} from "../ethernet/FundingApi";

export default {
  components: {Card,NewFunding},
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome',
      addr: 0,
      funding:[],
      loading: true,
    }
  },
  mounted:function() {
    this.getData();//需要触发的函数
    //this.getDetail();
  },
  methods:{
    btnClick: function(x){
      this.msg = x ;
      this.getDetail();
    },
    async getData(){
      await getAllFundingAddr().then(re =>{
        this.addr = re;
      });
    },
    async getDetail(){
      this.funding = await Promise.all(this.addr.map(async(item)=>{
        return await getDetailByAddr(item)
      }))
    },
  }
}

</script>

