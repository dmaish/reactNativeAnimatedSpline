import React, { Component } from 'react';
import { StyleSheet, View , SafeAreaView, Dimensions, Animated } from 'react-native';
import { Svg } from 'expo';
import * as path from 'svg-path-properties';
import { scaleTime, scaleLinear } from 'd3-scale';
import * as shape from 'd3-shape';

const d3 = {
  shape,
};

const { Path, Stop, LinearGradient, Defs } = Svg;

const { width } = Dimensions.get('window');
height = 200;

const data = [
  { x: new Date(2018, 9, 1), y: 0},
  { x: new Date(2018, 9, 16), y: 0},
  { x: new Date(2018, 9, 17), y: 200},
  { x: new Date(2018, 10, 1), y: 200},
  { x: new Date(2018, 10, 2), y: 300},
  { x: new Date(2018, 10, 5), y: 300},
];

// d3 scales
const scaleX = scaleTime().domain([ new Date(2018, 9, 1), new Date(2018, 10, 5) ]).range([0, width]);
const scaleY = scaleLinear().domain([0, 300]).range([height - 5, 5]);

const line = d3.shape.line()
        .x(d => scaleX(d.x))
        .y(d => scaleY(d.y))
        .curve(d3.shape.curveBasis)(data);

  // getting length of the above line to use to calculate length of the Svg Scrollview
  const properties = path.svgPathProperties(line);
  const lineLength = properties.getTotalLength();

export default class App extends Component{
cursor = React.createRef();

  state = {
    x: new Animated.Value(0),
  };

  moveCursor(value) {
    const {x, y} = properties.getPointAtLength(lineLength - value);
    this.cursor.current.setNativeProps({top: y - 10, left: x - 10})
  }

  componentDidMount(){
    this.state.x.addListener( ({value}) => this.moveCursor(value));
    this.moveCursor(0);
  }

  render(){
    const { x } = this.state;
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
            <Svg {...{ width, height }}>
              <Defs>
                <LinearGradient id="gradient" x1="0%" y1="0%" x2="20%" y2="100%">
                  <Stop  stopColor='#a8c4ed' offset='0%' />
                  <Stop  stopColor='#ffffff' offset='100%' />
                </LinearGradient>
              </Defs>
                <Path d={line} fill='transparent' stroke='#367be2' strokeWidth={3}/>
                <Path d={`${line} L ${width} ${height} L 0 ${height} `} fill='url(#gradient)' />
              <View ref={this.cursor } style={styles.cursor} />       
            </Svg>
            <Animated.ScrollView
              style={StyleSheet.absoluteFillObject}
              contentContainerStyle={{width: lineLength * 2}}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces={false}
              onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x },
                  },
                },
              ],
              { useNativeDriver: true },
              )}

              horizontal />
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