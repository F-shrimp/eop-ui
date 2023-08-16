<template>
    <div class="components-container" >
      <aside>
        1.填写需要申请服务器的应用名和环境（生产或测试）<br>
        2.若为测试环境则不需要填写机房信息<br>
        3.填写区域、服务器配置后申请服务器
      </aside> 
      <el-tag style="margin-right:20px">应用名：</el-tag>
      <el-select v-model="listQuery.appname" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in list" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
  </template>
  <script>
  
  import { fetchList } from '@/api/article'
  
  export default ({
    name: 'expansion',
      data() {
        return {
          list: null,
          listQuery: {
            flag: 2,
            appname: "",
            env: "",
           },
        }
      },
      created() {
        this.getList()
      },
      methods:{
        getList() {
          fetchList(this.listQuery).then(response => {
            console.log(response.data)
            this.list = response.data
            this.total = response.total
            console.log(this.list)
          }).catch(err=>{
            this.$message.error(err.message);
            console.log(err);
          })
        },
      }
    })
  </script>
  
  <style scoped>
    .components-container {
      position: relative;
      height: 400px;
    }
  </style>
  