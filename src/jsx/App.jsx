import React, {Component} from 'react';
import style from './../styles/styles.less';

// Data source:
// view-source:https://www.macrotrends.net/assets/php/chart_iframe_comp.php?id=1369&url=crude-oil-price-history-chart

// https://d3js.org/
import * as d3 from 'd3';

// https://www.chartjs.org/
import Chart from 'chart.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      line_chart_rendered:false,
      line_chart_rendered_16_9:false,
      pizza_chart_rendered:false,
      line_chart_show_meta:false,
      value:26.16
    };

    // We need a ref for chart.js.
    this.lineChartRef = React.createRef();
  }
  componentDidMount() {
    setTimeout(() => {
      this.createLineChart(16/9);
    }, 1000);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {

  }
  componentWillUnMount() {

  }
  // shouldComponentUpdate(nextProps, nextState) {}
  // static getDerivedStateFromProps(props, state) {}
  // getSnapshotBeforeUpdate(prevProps, prevState) {}
  // static getDerivedStateFromError(error) {}
  // componentDidCatch() {}
  createLineChart(ratio) {
    // Check if chart has been rendered and fail if it is.
    if (this.state.line_chart_rendered === false) {
      this.setState((state, props) => ({
        line_chart_rendered:true
      }));
    }
    else {
    }

    // Define constants.
    const self = this;
    let line_chart = false;
    function display(error, data) {

      if (error) {
        console.log(error)
        return false;
      }

        // console.log(data)
      data.price = data.map((values) => {
        return {
          date:values.date,
          value:values.close
        }
      });


      // Define options.
      let options = {
        data:{
          datasets:[{
            backgroundColor:'rgba(59, 49, 49, 0.7)',
            borderColor:'#3B3131',
            borderWidth:2,
            data:[self.state.value],
            fill:true,
            label:'Crude oil price',
            radius:0
          }],
          labels:['1960-01']
        },
        options:{
          hover:{
            enabled:false,
          },
          legend:{
            display:false
          },
          title:{
            display:false,
            text:''
          },
          tooltips:{
            enabled:false,
          },
          aspectRatio:ratio,
          responsive:true,
          scales:{
            xAxes:[{
              display:true,
              scaleLabel:{
                display:false,
                labelString:'month'
              }
            }],
            yAxes:[{
              // https://www.chartjs.org/docs/latest/axes/cartesian/linear.html#axis-range-settings
              ticks: {
                suggestedMin: 0,
                suggestedMax: 50,
              },
              display:true,
              scaleLabel:{
                display:true,
                labelString:'Crude oil price in dollars'
              }
            }]
          }
        },
        type:'line'
      };

      function updateChart() {
        // Update chart.
        let interval = setInterval(() => {
          let price = data.price.shift();
          self.setState((state, props) => ({
            date:price.date,
            value:price.value
          }));

          options.data.labels.push(price.date);
          options.data.datasets[0].data.push(price.value);
          line_chart.update();

          if (data.price.length < 1) {
            clearInterval(interval);
          }
        }, 100);
      }

      // Get context from ref.
      let ctx = self.lineChartRef.current.getContext('2d');

      line_chart = new Chart(ctx, options);

      updateChart();
    }
    // Load the data.
    d3.json('./data/data.json', display);
  }
  render() {
    return (
      <div className={style.app}>
        <div className={style.date}>{this.state.date}</div>
        <div style={(this.state.line_chart_rendered === true) ? {display:'block'} : {display:'none'}}>
          <div style={{position:'relative', margin:'auto auto'}}>
            <div className={style.line_chart_meta}>
              <div>${this.state.value}</div>
            </div>
            <canvas id={style.line_chart} ref={this.lineChartRef}></canvas>
          </div>
        </div>
      </div>
    );
  }
}
export default App;