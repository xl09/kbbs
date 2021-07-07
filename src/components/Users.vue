<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
      <el-button type="primary" @click="AddDialogFormVisible = true">添加用户</el-button>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" active-color="#13ce66"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="UserEdit(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="UserDel(scope.row.id)"></el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRoles(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加新用户" :visible.sync="AddDialogFormVisible" width="50%" @close="clearAddForm">
      <el-form :model="addForm" label-width="15%" :rules="addRules" ref="addFormRef">
        <el-form-item label="姓名" prop="username">
          <el-input autocomplete="off" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input autocomplete="off" type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input autocomplete="off" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserPro">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="EditDialogFormVisible" width="50%">
      <el-form :model="editForm" label-width="15%" :rules="addRules" ref="editFormRef">
        <el-form-item label="姓名">
          <el-input autocomplete="off" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input autocomplete="off" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserPro">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="SetDialogFormVisible" width="50%">
      <el-form :model="userInfo" label-width="15%">
        <el-form-item label="当前的用户">
          <el-input autocomplete="off" v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前的角色">
          <el-input autocomplete="off" v-model="userInfo.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option :label="v.roleName" v-for="v in rolesList" :key="v.id" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog‐footer">
        <el-button @click="SetDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入正确的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      userList: null,
      total: null,
      AddDialogFormVisible: false,
      EditDialogFormVisible: false,
      SetDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      userInfo: {},
      rolesList: [],
      selectedRoleId: '',
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleCurrentChange (v) {
      this.queryInfo.pagenum = v
      this.getUserList()
    },
    handleSizeChange (v) {
      this.queryInfo.pagesize = v
      this.getUserList()
    },
    async userStateChange (row) {
      // console.log(row.mg_state)
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) return
      // console.log(res)
      this.$message.success(res.meta.msg)
    },
    addUserPro () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return this.$message.error('添加失败')
        const { data: res } = await this.$http.post('/users', this.addForm)
        // console.log(res)
        if (res.meta.status === 201) {
          this.$message.success('添加成功')
        }
        this.getUserList()
      })
      this.AddDialogFormVisible = false
    },
    clearAddForm () {
      this.$refs.addFormRef.resetFields()
    },
    async UserDel (id) {
      const confirmInfo = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
    },
    async UserEdit (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      // console.log(res)
      this.editForm = res.data
      this.EditDialogFormVisible = true
      // console.log(id)
    },
    editUserPro () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改失败')
        const id = this.editForm.id
        const { data: res } = await this.$http.put('users/' + id, this.editForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success(res.meta.msg)
        this.getUserList()
        this.EditDialogFormVisible = false
      })
    },
    async setRoles (row) {
      this.SetDialogFormVisible = true
      this.userInfo = row
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      // console.log(row)
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) return this.$message.error('请选择需要分配的角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.SetDialogFormVisible = false
    },
    setRoleDialogClosed () {
      // 当关闭对话框的时候，重置下拉框中的内容
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
  .input-with-select {
    width: 40%;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
