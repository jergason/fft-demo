/**
 * @jsx React.DOM
 */
var React = require('react');
var FFT = require('./fft');

var App = React.createClass({
  componentDidMount: function() {
    // listen for the audio element to be ready, make ze context, set
    // ze state
    var audio = new Audio();
    audio.src = '/sounds/song.mp3';
    audio.addEventListener('canplaythrough', this.createContext);
    this.setState({audio: audio});
  },
  getInitialState: function() {
    return {};
  },
  createContext: function() {
    var ctx = new AudioContext;
    var elementSource = ctx.createMediaElementSource(this.state.audio);
    var analyzer = ctx.createAnalyser();
    elementSource.connect(analyzer);
    analyzer.connect(ctx.destination);
    this.state.audio.play();
    this.setState({
      analyzer: analyzer
    });
  },

  render: function() {
    if (this.state.analyzer) {
      return <FFT analyzer={this.state.analyzer} />;
    } else {
      return <h1>Not loaded yet</h1>
    }
  }
});

React.renderComponent(App(), document.body);
