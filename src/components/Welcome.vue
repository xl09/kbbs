<template>
  <div class="screen-container">
    <header class="screen-header">
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <span class="datetime time">{{ nowDate }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <trend ref="trend"></trend>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('trend')"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <seller ref="seller"></seller>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('seller')"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <maps ref="map"></maps>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('map')"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <rank ref="rank"></rank>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('rank')"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <hot ref="hot"></hot>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('hot')"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <stock ref="stock"></stock>
          <div class="resize">
            <span :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('stock')"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Trend from '@/components/Trend'
import Seller from '@/components/Seller'
import Maps from '@/components/Map'
import Rank from '@/components/Rank'
import Hot from '@/components/Hot'
import Stock from '@/components/Stock'

export default {
  data () {
    return {
      nowDate: '',
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  mounted () {
    this.currentTime()
  },
  beforeDestroy: function () {
    if (this.formatDate) {
      clearInterval(this.formatDate)
    }
  },
  components: {
    Trend,
    Seller,
    Maps,
    Rank,
    Hot,
    Stock
  },
  methods: {
    currentTime () {
      setInterval(this.formatDate, 500)
    },
    formatDate () {
      const date = new Date()
      const year = date.getFullYear() // 年
      const month = date.getMonth() + 1 // 月
      const day = date.getDate() // 日
      // const week = date.getDay() // 星期
      let hour = date.getHours() // 时
      hour = hour < 10 ? '0' + hour : hour
      let minute = date.getMinutes() // 分
      minute = minute < 10 ? '0' + minute : minute
      let second = date.getSeconds() // 秒
      second = second < 10 ? '0' + second : second
      this.nowDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    changeSize (chartName) {
      const targetValue = !this.fullScreenStatus[chartName]
      Object.keys(this.fullScreenStatus).forEach(item => {
        this.fullScreenStatus[item] = false
      })
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        // console.log(chartName)
        this.$refs[chartName].screenAdapter()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
  margin: 0;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;

  .screen-left {
    height: 100%;
    width: 27.6%;

    #left-top {
      position: relative;
      height: 53%;
    }

    #left-bottom {
      position: relative;
      height: 31%;
      margin-top: 25px;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      position: relative;
      width: 100%;
      height: 56%;
    }

    #middle-bottom {
      position: relative;
      margin-top: 25px;
      width: 100%;
      height: 28%;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      position: relative;
      height: 46%;
    }

    #right-bottom {
      position: relative;
      height: 38%;
      margin-top: 25px;
    }
  }
}

.resize {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
</style>
