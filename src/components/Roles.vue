<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item in scope.row.children" :key="item.id">
              <el-col :span="5">
                <el-tag closable @close="delRights(item.id, scope.row)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item1 in item.children" :key="item1.id">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="delRights(item1.id, scope.row)">{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning" @close="delRights(item2.id, scope.row)" v-for="item2 in item1.children" :key="item2.id">{{ item2.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRights(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRights(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRights(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addCateForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addCateForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" @close="setRightDialogClose">
      <el-tree :data="rightsList" show-checkbox default-expand-all node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="defKeys" :props="defaultProps" ref="treeRef"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="修改角色" :visible.sync="editCateDialogVisible">
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="editCateForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editCateForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: null,
      dialogVisible: false,
      rightsList: null,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: '',
      editCateDialogVisible: false,
      addCateDialogVisible: false,
      editCateForm: {},
      editCateFormRules: {
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      addCateForm: {
        roleName: '',
        roleDesc: ''
      },
      addCateFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.rolesList = res.data
      // console.log(res)
    },
    async delRights (id, item) {
      const confirmInfo = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${item.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success(res.meta.msg)
      item.children = res.data
    },
    async setRights (row) {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      this.rightsList = res.data
      this.roleId = row.id
      this.getLeafKeys(row, this.defKeys)
      this.getRolesList()
      // console.log(this.defKeys)
      // console.log(this.$refs.treeRef.getCheckedKeys())
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClose () {
      this.defKeys = []
    },
    async allotRights () {
      this.dialogVisible = false
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      // console.log(idStr)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      // console.log(res)
    },
    async deleteRights (id) {
      const confirmInfo = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    async editRights (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取信息失败')
      console.log(res)
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    editRoleInfo () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editCateForm.roleId, this.editCateForm)
        if (res.meta.status !== 200) return this.$message.error('修改角色信息失败')
        this.$message.success('修改角色信息成功')
        this.editCateDialogVisible = false
        this.getRolesList()
      })
    },
    addRole () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('创建角色失败')
        this.$message.success('创建角色成功')
        this.getRolesList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 0 0 5px 5px;
}
</style>
