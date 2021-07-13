<template>
  <div class="com-container">
    <div class="com-chart" ref="dv"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      allData: [],
      myecharts: '',
      currentPage: 1,
      totalPage: 0,
      timeId: null
    }
  },
  mounted () {
    this.getData()
    this.getInstanse()
    this.setTimePage()
    this.initEcharts()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId) // 清除定时器
    window.removeEventListener('resize', this.screenAdapter) // 自适应
  },
  methods: {
    getInstanse () {
      this.myecharts = this.$echarts.init(this.$refs.dv, 'chalk')
    },
    async getData () {
      var { data: res } = await this.$http.get('http://localhost:8089/api/seller')
      this.allData = res
      this.allData.sort(function (a, b) {
        return a.value - b.value // 数据从大到小排序
      })
      this.totalPage = Math.ceil(this.allData.length / 5) // 数组分割，然后分页
      this.updataChart()
    },
    updataChart () {
      // 分页
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end) // 切割，包头不包尾

      // 获取数据
      const sellername = showData.map(function (item) {
        return item.name
      })
      console.log()
      const sellerdata = showData.map(function (item) {
        return item.value
      })
      const option = {
        // 标题
        title: {
          text: '▎ 商家销量排行',
          left: 20,
          top: 10,
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 50,
              color: '#2D3443'
            }
          }
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          max: this.allData[this.allData.length - 1].value + 10
        },
        yAxis: {
          type: 'category',
          data: sellername
        },
        series: [
          {
            type: 'bar',
            data: sellerdata,
            barWidth: '50%',
            itemStyle: {
              // 渐变
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ]),
              // 圆头
              barBorderRadius: [0, 33, 33, 0]
            },
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff'
              }
            }
          }
        ]
      }
      this.myecharts.setOption(option)
    },
    // 定时器分页显示
    setTimePage () {
      if (this.timeId) {
        clearInterval(this.timeId) // 清除定时器
      }
      this.timeId = setInterval(() => {
        // 开启定时器
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.getData()
      }, 3000)
    },
    initEcharts () {
      this.myecharts = this.$echarts.init(this.$refs.dv)
      // 鼠标移入，定时器关闭
      this.myecharts.on('mousemove', () => {
        clearInterval(this.timeId)
      })
      // 鼠标移出定时器开启
      this.myecharts.on('mouseout', () => {
        this.setTimePage()
      })
    },
    screenAdapter () {
      // 自适应大小
      const titleFontSize = (this.$refs.dv.offsetWidth / 100) * 3.6
      const option = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.myecharts.setOption(option)
      this.myecharts.resize()
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.com-container {
  // width: 100%;
  // height: 100%;
  background: #161522;
}
</style>
