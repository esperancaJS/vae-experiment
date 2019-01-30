import { Component } from 'preact';
import * as tf from '@tensorflow/tfjs';

import './styles.scss';

export default class VAEApp extends Component {

    canvas = null;
    model = null;

    constructor() {
        super();
     
        this.state = {
            latentDims: [ 1, 1 ]
        }
    }

    componentDidMount() {
        const canvasEl = document.querySelector('canvas');

        canvasEl.width = '28';
        canvasEl.height = '28';


        this.canvas = canvasEl.getContext('2d');

        console.log(process.env.NODE_ENV);

        const url = process.env.NODE_ENV === 'production' ? './model' : 'http://127.0.0.1:8081';

        tf.loadModel(`${url}/model.json`).then(
            model => {
                this.model = model;
            }
        );
    }

    componentDidUpdate () {
        const prediction = this.model.predict(
            tf.tensor([this.state.latentDims])
        ).dataSync();

        let imageData = new ImageData(28, 28);

        for (let i = 0; i < 28 * 28; ++i) {
            const j = i * 4;
            imageData.data[j + 0] = prediction[i] * 255;
            imageData.data[j + 1] = prediction[i] * 255;
            imageData.data[j + 2] = prediction[i] * 255;
            imageData.data[j + 3] = 255;
        }

        this.canvas.putImageData(imageData, 0, 0);
    }

    onSliderChange = ({ e, dim }) => {
        this.setState({
            latentDims: this.state.latentDims.map((latentDim, i) => {
                if (i === dim) {
                    return Number(e.target.value)
                } else  {
                    return latentDim
                }
            })
        })
    }

    render() {
        return (
            <div>
                <input
                    type="range"
                    min="-3" max="3" value="1" step="0.1"
                    value={this.state.latentDims[0]}
                    onChange={e => this.onSliderChange({ e, dim: 0})}
                ></input>

                <input
                    type="range"
                    min="-2" max="2" value="1" step="0.1"
                    value={this.state.latentDims[1]}
                    onChange={e => this.onSliderChange({ e, dim: 1})}
                ></input>

                <div class="canvas-wrapper">
                    <canvas id="canvas"></canvas>
                </div>
            </div>
        );
    }
}