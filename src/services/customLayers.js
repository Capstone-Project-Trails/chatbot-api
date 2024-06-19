const tf = require('@tensorflow/tfjs-node');

// Define and register the custom layer
class SlicingOpLambda extends tf.layers.Layer {
  constructor(config) {
    super(config);
  }

  call(inputs, kwargs) {
    const input = inputs[0];
    const sliceSpec = kwargs.slice_spec;

    return tf.slice(input, sliceSpec.begin, sliceSpec.size);
  }

  static get className() {
    return 'SlicingOpLambda';
  }
}

tf.serialization.registerClass(SlicingOpLambda);
module.exports = { SlicingOpLambda };
