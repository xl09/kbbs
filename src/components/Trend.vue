<template>
  <div class="com-container">
    <div class="title">
      <span :style="comStyle">{{ '▎' + title }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-if="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)" :style="comStyle">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="dv"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      chartInstance: '',
      allData: '',
      dataType: 'map',
      showChoice: false,
      titleFontSize: 0
    }
  },
  mounted () {
    this.getData()
    this.initCharts()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.dv, 'chalk')
      const initoption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '15%',
          left: 20,
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initoption)
    },
    async getData () {
      const { data: res } = await this.$http.get('http://localhost:8089/api/trend')
      // console.log(res)
      this.allData = res
      this.updataChart()
    },
    updataChart () {
      // 半透明的颜色值
      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']

      const monthArr = this.allData.common.month
      const valueArr = this.allData[this.dataType].data
      // 图表数据, 一个图表中显示5条折线图
      const seriesArr = valueArr.map((item, index) => {
        return {
          type: 'line', // 折线图
          smooth: true,
          name: item.name,
          data: item.data,
          stack: this.dataType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const dataOption = {
        xAxis: {
          data: monthArr
        },
        legend: {
          data: valueArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    handleSelect (key) {
      this.dataType = key
      this.updataChart()
      this.showChoice = false
    },
    screenAdapter () {
      this.titleFontSize = (this.$refs.dv.offsetWidth / 100) * 2
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize * 2,
          itemHeight: this.titleFontSize * 2,
          itemGap: this.titleFontSize * 2,
          textStyle: {
            fontSize: this.titleFontSize,
            color: '#fff'
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  computed: {
    selectTypes () {
      if (!this.allData || !this.allData.type) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.dataType
        })
      }
    },
    title () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.dataType].title
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  }
}
</script>
<style scoped lang="less">
.com-container {
  background: #161522;
  .title {
    color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    .title-icon {
      margin-left: 10px;
      cursor: pointer;
    }
    .select-con {
      background: #222733;
      .select-item {
        margin-left: 0.5em;
        cursor: pointer;
      }
    }
  }
}
</style>
