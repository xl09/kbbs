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
      currentIndex: 0,
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
      const centerPointers = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const initOption = {
        title: {
          text: '▎ 库存销售量',
          left: 20,
          top: 20,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            center: centerPointers[0],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: {
              show: false
            }
          },
          {
            type: 'pie',
            center: centerPointers[1],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: {
              show: false
            }
          },
          {
            type: 'pie',
            center: centerPointers[2],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: {
              show: false
            }
          },
          {
            type: 'pie',
            center: centerPointers[3],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: {
              show: false
            }
          },
          {
            type: 'pie',
            center: centerPointers[4],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: {
              show: false
            }
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
      const { data: res } = await this.$http.get('http://localhost:8089/api/stock')
      this.allData = res
      this.updataChart()
      this.startInterval()
    },
    updataChart () {
      const colorArrs = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'center',
            color: colorArrs[index][0]
          },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArrs[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArrs[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = (this.$refs.dv.offsetWidth / 100) * 3.6
      const innerRadius = this.titleFontSize * 2
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2
            }
          },
          {
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFontSize / 2
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
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updataChart()
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
