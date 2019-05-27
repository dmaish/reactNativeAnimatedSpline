import React, { Component } from 'react';
import { StyleSheet, View , SafeAreaView, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as path from 'svg-path-properties';
import { scaleTime, scaleLinear, scalePoint } from 'd3-scale';
import * as shape from 'd3-shape';

const d3 = {
  shape,
};

const { Path, Line, Text, Defs, LinearGradient, Stop, Filter, FeBlend, FeGaussianBlur, FeOffset } = Svg;

const { width } = Dimensions.get('window');
height = 200;

const data = [
  { x: new Date(2018, 1, 1), y: 1820},
  { x: new Date(2018, 1, 2), y: 2231},
  { x: new Date(2018, 1, 9), y: 2370},
  { x: new Date(2018, 2, 16), y: 2192},
  { x: new Date(2018, 3, 17), y: 2300},
  { x: new Date(2018, 4, 1), y: 2400},
  { x: new Date(2018, 5, 2), y: 3300},
  { x: new Date(2018, 5, 5), y: 3060},
  { x: new Date(2018, 6, 5), y: 1060},
  { x: new Date(2018, 7, 5), y: 3060},
  { x: new Date(2018, 8, 1), y: 3535},
  { x: new Date(2018, 9, 16), y: 2330},
  { x: new Date(2018, 9, 17), y: 2200},
  { x: new Date(2018, 10, 1), y: 2030},
  // { x: new Date(2018, 10, 2), y: 3006},
  { x: new Date(2018, 10, 5), y: 1300},
  { x: new Date(2018, 11, 1), y: 2030},
  // { x: new Date(2018, 11, 2), y: 3006},
  { x: new Date(2018, 12, 5), y: 2728},
  // { x: new Date(2018, 12, 15), y: 2942},
  { x: new Date(2018, 12, 29), y: 2300},
]

// d3 scales
const scaleX = scaleTime().domain([ new Date(2018, 1, 1), new Date(2018, 12, 29) ]).range([0, width]);
const scaleY = scaleLinear().domain([0, 6000]).range([height - 5, 5]);

 // d3 axes
 // X scale point
const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const xDomain = monthNames.map(item => item);
const xRange = [0, width];
const xScalePoint = scalePoint()
  .domain(xDomain)
  .range(xRange)
  .padding(0.5)

// y scale point
const cashAmounts = [6000,2000,1000,];
const yDomain = cashAmounts.map(item => item);
const yRange = [0, height];
const yScalePoint = scalePoint()
  .domain(yDomain)
  .range(yRange)
  .padding(0.5)

const line = d3.shape.line()
        .x(d => scaleX(d.x))
        .y(d => scaleY(d.y))(data);

  // getting length of the above line to use to calculate length of the Svg Scrollview
  const properties = path.svgPathProperties(line);

export default class App extends Component{
cursor = React.createRef();  


  render(){
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
            <Svg {...{ width, height }}>
              <Defs>
                  <LinearGradient id="grad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <Stop offset="0%" stopColor="#4DB6AC" />
                      <Stop offset="60%" stopColor="#B2DFDB" />
                      <Stop offset="100%" stopColor="#E0F2F1" />
                  </LinearGradient>
              </Defs>
                <Path d={line} fill='transparent' stroke='#6DEAC3' strokeWidth={4}/>
                <Path d={`${line} L ${width} ${height} L 0 ${height} `} fill='url(#f2)' />

                {cashAmounts.map(item => (
                  <Text
                    key={'label' + item}
                    fontSize="12"
                    fontWeight='900'
                    y={yScalePoint(item)}
                    x={30}
                    textAnchor="end"
                    fill='#9E9E9E'
                  >
                  {item}
                  </Text>
                ))}
                  
                {monthNames.map(item => (
                  <Text
                    key={'label' + item}
                    fontSize="12"
                    fontWeight='900'
                    x={xScalePoint(item)}
                    y={height}
                    textAnchor="end"
                    fill='#9E9E9E'
                  >
                  {item}
                  </Text>
                ))}
            </Svg>
        
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create(
  {
    root: {
      flex: 1,
    },
    container: {
      marginTop: 60,
      height,
      width,
    },
    cursor: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderColor: '#367be2',
      borderWidth: 3,
      backgroundColor: '#FFFFFF', 
    }
  }
);