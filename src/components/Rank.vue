<template>
  <div class="com-container">
    <div class="com-chart" ref="dv"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: '',
      allData: [],
      startValue: 0,
      endValue: 9,
      timerId: null,
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
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.dv, 'chalk')
      const initOption = {
        title: {
          text: '▎ 地区销售排行',
          left: 20,
          top: 20,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          top: '40%',
          left: '5%',
          bottom: '5%',
          right: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      const { data: res } = await this.$http.get('http://localhost:8089/api/rank')
      this.allData = res
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      const valueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        yAxis: {
          max: this.allData[0].value + 40
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                var targetColorArr = colorArr
                if (arg.value >= 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value >= 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              },
              barBorderRadius: [33, 33, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.dv.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize, titleFontSize, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.com-container {
  background: #161522;
}
</style>
