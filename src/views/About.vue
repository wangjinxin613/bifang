<template>
  <div class="about searchView">
    <h1>This is a test page</h1>
    <div style="display: flex">
      <div class="box1" @mouseleave="mouseleave" v-if="show1"></div>
      <div class="box2" @mouseenter="mouseenter" v-if="show2"></div>
    </div>
  </div>
</template>

<script lang="js">
export default{
  data() {
    return {
      show1: true,
      show2: true,
      flag:false
    }
  },
  methods:{
    mouseleave() {
      console.log(9999);
      this.show2 = false;
      this.flag=true;
    },
    mouseenter() {
      console.log(8888);
      if(this.flag==false){
        this.show2=true;
      }
      
    }
  }
}
</script>

<style lang="less">
.box1{
  width:200px;
  background: red;
  height: 200px;
}
.box2{
  width:200px;
  background: blue;
  height: 200px;
}
</style>