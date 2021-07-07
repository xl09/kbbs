<template>
  <el-container>
    <el-header>
      后台管理系统
      <el-button type="success" @click="loginout" size="small">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">
          <i class="el-icon-s-promotion"></i>
        </div>
        <el-menu
          default-active="welcome"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="item1 in item.children" :key="item1.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item1.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menusList: null,
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  mounted () {
    // this.$http.get('menus').then(({ data }) => {
    //   this.menusList = data.data
    // })
    this.getMenus()
  },
  methods: {
    // toggleCollapse () {
    //   this.isCollapse = !this.isCollapse
    // },
    async getMenus () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 400) {
        return this.$message.error('获取数据失败')
      }
      this.menusList = res.data
    },
    loginout () {
      // window.sessionStorage.removeItem('token')
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  overflow-y: hidden;
  .el-header {
    line-height: 60px;
    color: #fff;
    background: #333;
    .el-button {
      float: right;
      margin-top: 15px;
    }
  }
  .el-aside::-webkit-scrollbar {
    display: none;
  }
  .el-aside {
    background: #333;
    .toggle-button {
      text-align: center;
      // margin: 0 auto;
      // letter-spacing: 10px;
      color: #fff;
      cursor: pointer;
    }
    .el-menu {
      border: none;
      .iconfont {
        margin-right: 20px;
      }
    }
  }
  .el-main {
    background: #edeaf1;
  }
}
</style>
