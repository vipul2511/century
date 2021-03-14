import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';

import {BarChart} from 'react-native-charts-wrapper';

export default class ChartBar extends React.Component {
  constructor(props){
      super(props);
      this.state={
        bar: {
            title: 'Sales motor in Indonesia',
            detail: { 
              time_value_list: ['2010', 
              '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
              legend_list: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki'],
              dataset: {
                Honda: {
                  '2010': 3800,
                  '2011': 4500,
                  '2012': 5400,
                  '2013': 6000,
                  '2014': 7000,
                  '2015': 7800,
                  '2016': 8600,
                  '2017': 9000
                },
                Yamaha: {
                  '2010': 3500,
                  '2011': 4000,
                  '2012': 4600,
                  '2013': 5000,
                  '2014': 5600,
                  '2015': 6700,
                  '2016': 7700,
                  '2017': 8900,
                },
                Suzuki: {
                  '2010': 4500,
                  '2011': 5000,
                  '2012': 5600,
                  '2013': 6600,
                  '2014': 7400,
                  '2015': 8000,
                  '2016': 8500,
                  '2017': 9100
                },
                Kawasaki: {
                  '2010': 3000,
                  '2011': 3500,
                  '2012': 4100,
                  '2013': 4900,
                  '2014': 5600,
                  '2015': 6500,
                  '2016': 7600,
                  '2017': 8500
                }
              }
            }
          },
      }
  }
  render() {
    const style1 = {
        barWidth: 0.1,
        groupSpace: 0.2
      }
      const style2 = {
        barWidth: 0.2,
        groupSpace: 0.1
      }
      const style3 = {
        barWidth: 0.3,
        groupSpace: 0.2
      }
  
      const time = this.state.bar.detail.time_value_list
      const legend = this.state.bar.detail.legend_list
      const dataset = this.state.bar.detail.dataset
  
      var dataSetsValue = []
      var dataStyle = {}
      var legendStyle = {}
      var descStyle = {}
      var xAxisStyle = {}
      var chooseStyle = {}
      var valueLegend = []
      var colorLegend = []
  
      if (legend.length === 4) {
        chooseStyle = style1
      } else if (legend.length === 3) {
        chooseStyle = style2
      } else if (legend.length === 2) {
        chooseStyle = style3
      }
  
      legend.map((legendValue) => {
        var valueLegend = []
  
        time.map((timeValue) => {
          const datasetValue = dataset[legendValue]
          const datasetTimeValue = datasetValue[timeValue]
  
          valueLegend.push(parseInt(datasetTimeValue))
        })
  
        const datasetObject = {
          values: valueLegend,
          label: legendValue,
          config: {
            drawValues: false,
            colors: [processColor('Green')]
          }
        }
        dataSetsValue.push(datasetObject)
      })
  
      legendStyle = {
        enabled: true,
        textSize: 14,
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true
      }
      dataStyle = {
        dataSets: dataSetsValue,
        config: {
          barWidth: chooseStyle.barWidth, // 0.1
          group: {
            fromX: 0,
            groupSpace: chooseStyle.groupSpace, // 0.2
            barSpace: 0.1
          }
        }
      }
      xAxisStyle = {
        valueFormatter: time,
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: 5,
        axisMinimum: 0,
        centerAxisLabels: true
      }
    return (
      <View style={{flex: 1}}>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text>Bar Graph</Text>
            </View>
        <View style={styles.container}>
        <BarChart
        style={{flex:0.4}}
        xAxis={xAxisStyle}
        chartDescription={{ text: '' }}
        data={dataStyle}
        legend={legendStyle}
        drawValueAboveBar={false}
      />
        </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      marginTop:10,
    flex: 0.2,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
});