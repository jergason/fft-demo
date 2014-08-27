var React = require('react');

var FFT = React.createClass({
  getDefaultProps: function() {
    return {
      height: 1000,
      width: 1000
    };
  },

  componentDidMount: function() {
    // kick out the jams
    requestAnimationFrame(this.tick);
  },

  tick: function() {
    if (!this.props.analyzer) {
      return requestAnimationFrame(this.tick);
    }

    var freqData = new Uint8Array(this.props.analyzer.frequencyBinCount);
    this.props.analyzer.getByteFrequencyData(freqData);
    this.paint(freqData);
    requestAnimationFrame(this.tick);
  },

  paint: function(fftBytes) {
    var barWidth = this.props.width / fftBytes.length;
    var context = this.getDOMNode().getContext('2d');
    var vars;

    context.clearRect(0, 0, this.props.width, this.props.height);
    for (var i = 0; i < fftBytes.length; i++) {
      var percentageHeight = fftBytes[i] / 256;
      var pixelHeight = percentageHeight * this.props.height;
      var x = i * barWidth;
      // HSL goes from 0 to 360, so map how far we are through the fft array to
      // that range
      var hue = (i / fftBytes.length) * 360;
      if (i == 0) {
        vars = {
          barWidth: barWidth,
          percentageHeight: percentageHeight,
          fftLength: fftBytes.length,
          pixelHeight: pixelHeight,
          x: x,
          hue: hue
        };
      }
      context.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      context.fillRect(x, this.props.height - pixelHeight, barWidth, pixelHeight);
    }
  },

  render: function() {
    var props = {
      height: this.props.height,
      width: this.props.width,
      className: 'fft'
    };
    return React.DOM.canvas(props);
  }
});

module.exports = FFT;
