<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="dv"></div>
  </div>
</template>
<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstance: '',
      allData: '',
      titleFontSize: ''
    }
  },
  mounted () {
    this.getData()
    this.initCharts()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    this.getScatterData()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initCharts () {
      this.chartInstance = this.$echarts.init(this.$refs.dv, 'chalk')
      this.chartInstance.on('click', async arg => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        const { data: ret } = await axios.get('http://localhost:8080' + provinceInfo.path)
        this.$echarts.registerMap(provinceInfo.key, ret)
        this.chartInstance.setOption({
          geo: {
            map: provinceInfo.key
          }
        })
      })
    },
    async getData () {
      const { data: mapData } = await axios.get('http://localhost:8080/static/map/china.json')
      this.$echarts.registerMap('china', mapData)
      const initOption = {
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20,
          textStyle: {
            color: '#fff'
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getScatterData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('http://localhost:8089/api/map')
      this.allData = ret
      this.updataChart()
    },
    updataChart () {
      // 处理图表需要的数据
      // 图例数据
      const legendData = this.allData.map(item => {
        return item.name
      })
      // 散点数据
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          coordinateSystem: 'geo',
          name: item.name,
          data: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: seriesArr
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
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize,
          textStyle: { fontSize: titleFontSize / 2, color: '#fff' }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap () {
      this.chartInstance.setOption({
        geo: {
          map: 'china'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.com-container {
  background: #161522;
}
</style>
