import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import { wp, hp } from '../utils/heightWidthRatio';
let width=Dimensions.get('window').width;
let height=Dimensions.get('window').height;
class ChildDataBarGraph extends Component{ 
    constructor(props){
        super(props);
        this.state={
            barvalue:false,
            bar: {
              title: 'Sales motor in Indonesia',
              detail: { 
                time_value_list: ['Dec','Jan', 'Feb',],
                legend_list: ['December', 'Janaury', 'Feburary'],
                dataset: {
                  December: {
                    'Dec': 0,
                    'Jan':0,
                    'Feb': 0,
                   
                    // '2014': 7000,
                    // '2015': 7800,
                    // '2016': 8600,
                    // '2017': 9000
                  },
                  Janaury: {
                    'Dec': 0,
                    'Jan':0,
                    'Feb': 0,
                   
                    // '2014': 5600,
                    // '2015': 6700,
                    // '2016': 7700,
                    // '2017': 8900,
                  },
                  Feburary: {
                    'Dec': 0,
                    'Jan':0,
                    'Feb': 0,
                   
                    // '2014': 7400,
                    // '2015': 8000,
                    // '2016': 8500,
                    // '2017': 9100
                  },
                }
              }
            },
        }
    }
    componentDidMount() {
        console.log('log id');
      }
      renderBar () {
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
    
        if (legend.length === 3) {
          chooseStyle = style1
        } else if (legend.length === 2) {
          chooseStyle = style2
        } else if (legend.length === 1) {
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
              colors: [processColor('green')]
            }
          }
          dataSetsValue.push(datasetObject)
        })
    
        legendStyle = {
          enabled: true,
          textSize: 14,
          form: 'SQUARE',
          formSize: 14,
          xEntrySpace: 25,
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
          axisMaximum: 3,
          axisMinimum: 0,
          centerAxisLabels: true
        }
    
        return (
          
          <BarChart
          style={{width:width,height:hp(350)}}
            xAxis={xAxisStyle}
            chartDescription={{ text: '' }}
            onSelect={this.handleBarGraph.bind(this)}
            data={dataStyle}
            legend={legendStyle}
            drawValueAboveBar={false}
          />
       
        )
      }
render(){
    return(
        <View style={styles.container}>
            {this.renderBar()}
        </View>
    )
}
}
const styles = StyleSheet.create({
    container: {
        marginTop:10,
      flex: 0.2,
      backgroundColor: '#F5FCFF'
    },
});
export default ChildDataBarGraph;