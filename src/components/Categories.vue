<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCategories">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="CategoriesList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"> </i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el‐icon‐edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el‐icon‐delete" @click="delCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="AddDialogFormVisible" width="50%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader expandTrigger="hover" v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible">
      <el-form :model="editCateForm" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      CategoriesList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: null,
      columns: [
        { label: '分类名称', prop: 'cat_name', width: '200px' },
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt', width: '250px' }
      ],
      AddDialogFormVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedKeys: [],
      editCateDialogVisible: false,
      editCateForm: {
        cat_name: ''
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.CategoriesList = res.data.result
      this.total = res.data.total
    },
    handleCurrentChange (v) {
      this.queryInfo.pagenum = v
      this.getCategoriesList()
    },
    handleSizeChange (v) {
      this.queryInfo.pagesize = v
      this.getCategoriesList()
    },
    showAddCategories () {
      this.AddDialogFormVisible = true
      this.getParentCateList()
    },
    async getParentCateList () {
      // 获取父级分类数据列表
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表数据失败')
      this.parentCateList = res.data
    },
    addCateDialogClosed () {
      // 当关闭添加分类对话框时，重置表单
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    parentCateChange () {
      // 级联菜单中选择项发生变化时触发
      console.log(this.selectedKeys)
      // 如果用户选择了父级分类
      if (this.selectedKeys.length > 0) {
        // 则将数组中的最后一项设置为父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // level也要跟着发生变化
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCategories () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCategoriesList()
        this.AddDialogFormVisible = false
      })
    },
    async delCate (id) {
      const confirmInfo = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCategoriesList()
    },
    async editCate (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取信息失败')
      this.editCateForm = res.data
      this.editCateDialogVisible = true
      // console.log(res)
    },
    async editCateInfo () {
      const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name })
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.getCategoriesList()
      this.editCateDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.zk-table {
  margin-top: 10px;
}
</style>
