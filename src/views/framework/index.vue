<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag style="margin-right:20px">应用名：</el-tag>
      <el-input v-model="listQuery.appname" placeholder="Appname" style="width: 200px; margin-right:20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" >
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.aid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" prop="appname" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.appname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务域" prop="app_domain" width="130px">
        <template slot-scope="{row}">
          <span >{{ row.app_domain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统负责人" prop="app_Owner" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.app_Owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可随时重启" prop="restart_any" width="110px" align="center">
        <template slot-scope="{row}">
          <span><el-tag>{{ row.restart_any }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="可快速扩容" prop="rapid_expansion" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="viewexDesc(row.appname)"><el-tag>{{ row.rapid_expansion }}</el-tag></span>
          <!-- <span class="link-type" @click="handleUpdate(row)"><el-tag>{{ row.rapid_expansion }}</el-tag></span> -->
        </template>
      </el-table-column>
      <el-table-column label="可快速缩容" prop="rapid_reduction" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="viewreDesc(row.appname)"><el-tag>{{ row.rapid_reduction }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="特殊项描述" prop="content" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作列表" align="center" min-width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="120px" style="width: 500px; margin-left:50px;" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用名">
              <span class="grid-content bg-purple"><el-tag>{{ rrinfo.appname }}</el-tag></span>
              <!-- <el-input v-model="rrinfo.appname" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可随时下流量">
              <span class="grid-content bg-purple"><el-tag>{{ rrinfo.down_off }}</el-tag></span>
              <!-- <el-date-picker v-model="rrinfo.down_off" type="datetime" placeholder="Please pick a date" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支持检查负载">
              <span class="grid-content bg-purple"><el-tag>{{ rrinfo.check_load }}</el-tag></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可随时停止服务">
              <span class="grid-content bg-purple"><el-tag>{{ rrinfo.stop_service }}</el-tag></span>
              <!-- <el-input v-model="rrinfo.stop_service" /> -->
            </el-form-item>
          </el-col>
        </el-row>
       <el-row>
          <el-col :span="24">
            <el-form-item label="支持日志备份">
              <span class="grid-content bg-purple"><el-tag>{{ rrinfo.logback }}</el-tag></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible">
      <el-form ref="chDesc" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
      <!-- <el-table :model="temp" ref="chDesc" :data="rrinfo" border fit highlight-current-row style="width: 100%"> -->
        <el-form-item label="应用名">
          <span><el-tag>{{ temp.appname }}</el-tag></span>
        </el-form-item>
        <el-form-item label="业务域">
          <el-input v-model="temp.app_domain" />
        </el-form-item>
        <el-form-item label="系统负责人">
          <el-input v-model="temp.app_Owner" />
        </el-form-item>
        <el-form-item label="可随时重启">
          <el-input v-model="temp.restart_any" />
        </el-form-item>
        <el-form-item label="可快速扩容">
          <el-input v-model="temp.rapid_expansion" />
        </el-form-item>
        <el-form-item label="可快速缩容">
          <el-input v-model="temp.rapid_reduction" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCtVisible">
      <el-form ref="ctDesc" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
      <!-- <el-table :model="temp" ref="chDesc" :data="rrinfo" border fit highlight-current-row style="width: 100%"> -->
        <el-form-item label="应用名">
          <el-input v-model="temp.appname" />
        </el-form-item>
        <el-form-item label="业务域">
          <el-input v-model="temp.app_domain" />
        </el-form-item>
        <el-form-item label="系统负责人">
          <el-input v-model="temp.app_Owner" />
        </el-form-item>
        <el-form-item label="可随时重启">
          <el-input v-model="temp.restart_any" />
        </el-form-item>
        <el-form-item label="可快速扩容">
          <el-input v-model="temp.rapid_expansion" />
        </el-form-item>
        <el-form-item label="可快速缩容">
          <el-input v-model="temp.rapid_reduction" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createrespecInfo, updaterespecInfo, findrespecInfo, deleterespecInfo } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        flag: 0,
        appname: "",
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      appkey:'',
      temp: {
        aid: undefined,
        appname: undefined,
        app_Owner: '',
        restart_any: '',
        rapid_reduction: '',
        rapid_expansion: '',
        content:''
      },
      rrinfo: {
        appname: '',
        down_off: '',
        check_load: '',
        stop_service: '',
        logback:'',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        show: 'Show Info'
      },
      dialogPvVisible: false,
      dialogCtVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = response.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.flag = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        appname: undefined,
        app_Owner: '',
        restart_any: '',
        rapid_reduction: '',
        rapid_expansion: '',
        content:''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogCtVisible = true
      this.$nextTick(() => {
        this.$refs['ctDesc'].clearValidate()
      })
    },
    createData() {
      this.temp.aid = this.total+1
      this.$refs['ctDesc'].validate((valid) => {
        if (valid) {
          createrespecInfo(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogCtVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['chDesc'].clearValidate()
      })
    },
    viewreDesc(name) {
      this.rrinfo.appname = name
      this.dialogStatus = 'show'
      findrespecInfo(this.rrinfo).then(response => {
        this.dialogFormVisible = true
        this.rrinfo.down_off = response.data.down_off
        this.rrinfo.check_load = response.data.check_load
        this.rrinfo.stop_service = response.data.stop_service
        this.rrinfo.logback = response.data.logback
      //   this.$nextTick(() => {
      //   this.$refs['exDesc'].clearValidate()
      // })
      })
    },
    viewexDesc(name) {
      this.rrinfo.appname = name
      this.dialogStatus = 'show'
      findrespecInfo(this.rrinfo).then(response => {
        this.dialogFormVisible = true
        this.rrinfo.down_off = response.data.down_off
        this.rrinfo.check_load = response.data.check_load
        this.rrinfo.stop_service = response.data.stop_service
        this.rrinfo.logback = response.data.logback
      })
    },
    updateData() {
      this.$refs['chDesc'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updaterespecInfo(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.aid)
            this.list.splice(index, 1, this.temp)
            this.dialogPvVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleterespecInfo(row).then(() => {
        this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  },
}
</script>