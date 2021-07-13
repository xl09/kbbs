<template>
  <div class="com-container">
    <div class="com-chart" ref="dv"></div>
    <span class="iconfont arr_left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr_right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat_name" :style="comStyle">{{ catTitle }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    catTitle () {
      if (!this.allData) {
        return ''
      }
      return this.allData[this.currentIndex].name
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.dv, 'chalk')
      const initOption = {
        title: {
          text: '▎ 热销商品销售金额占比统计',
          left: 20,
          top: 20,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            }
          }
        ],
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const tipArray = []
            params.data.children.forEach(function (item) {
              const childStr = `${item.name}${parseInt((item.value / params.value) * 100) + '%'}`
              tipArray.push(childStr)
            })
            return tipArray.join('<br/>')
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: res } = await this.$http.get('http://localhost:8089/api/hotproduct')
      this.allData = res
      this.updateChart()
    },
    updateChart () {
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    },
    screenAdapter () {
      this.titleFontSize = (this.$refs.dv.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 1.5,
          itemHeight: this.titleFontSize / 1.5,
          itemGap: this.titleFontSize / 1.5,
          textStyle: {
            fontSize: this.titleFontSize / 1.5,
            color: '#fff'
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.com-container {
  background: #161522;
  .arr_left {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    cursor: pointer;
  }

  .arr_right {
    position: absolute;
    right: 10%;
    top: 50%;
    color: white;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .cat_name {
    position: absolute;
    left: 80%;
    bottom: 20px;
    font-weight: bold;
    color: white;
  }
}
</style>
