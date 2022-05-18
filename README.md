# Spiking Neurons

## Introduction

Spiking Neurons is an experimental interactive visualization of a spiking neural network run in the web browser.

## Instructions

- Open <a href="http://public.beuth-hochschule.de/~s85393/deep-learning/spiking-neurons/" target="_blank" rel="noopener noreferrer">spiking neuronal network simulator</a> in web browser
- Set network paramaters or use default parameters (for parameter description see section `Spiking Neural Network`)
- Click `Initialize Network` to initialize network data structure
- Click `Render Network` to render network visualization
- Click on any neuron and observe network activity
- To stop network from spiking click `Stop Network Activity`

## Technical Documentation

This section provides an overview about the technical setup of the project. Project depedencies are listed and crucial components, functions and attributes are explained.

### Local Usage 

- Clone repository
- Open CLI and navigate to project root folder
- Install dependencies with `npm install`
- Run simulatur with `npm start`
- Open `localhost:3000` in browser

### Dependencies

This section contains a list of all project dependencies. Dependencies can be found as well in the project's `package.json` file.

Name | Description | Reference |
--- | --- | --- | 
 React | React is a front end Java Script library for bulding user interfaces und UI components. In this project React is used to implement a single page application | https://reactjs.org/ |
react-force-graph-2d | react-force-graph-2d is graphical library to render a parameterized 2D forcegraph using a canvas element.In this project it is used to visualize the spiking neural network. It is also used to implement interaction with the spiking neural network | https://github.com/vasturiano/react-force-graph |
Bootswatch | Bootswatch is a CSS library containing free themes for Bootstrap. In this project Bootswatch is used to style the user interface and UI components in a convenient way | https://bootswatch.com/ |
events | events is a library, which implements the Node.js events module for the browser environment. In this project events is used to implement the neural network and it's neurons as event emitters | https://github.com/browserify/events#readme |

### Spiking Neural Network

The spiking neural network is implented in `snn.js`. Network and neurons are implemented as JavaScript classes. Both extend the classs `EventEmitter` and contain functions to emit events, which can be listened on and interacted with. 

#### NeuralNetwork

Name | Type | Description | 
--- | --- | --- | 
`NeuralNetwork` | Class | Extends `EventEmitter`. Can be instantiated to implement a spiking neural network | 
`size` | Class Variable | Number of neurons |
`shape` | Class Variable | Network shape defines how neurons are connected. Default shape is a randomly connected blob of neurons |
`synapseAvgPerNeuron` | Class Variable | Average number of connections between neurons |
`signalMaxFireDelay` | Class Variable | Timeout in `ms` neuron takes after spiking |
`signalRecoveryDelay` | Class Variable | Time in `ms` neurons take to recover after spiking |
`signalFireThreshold` | Class Variable | Neuronal threshold for action potential |
`spike(id)` | Function | Function to fire a certain neuron. Can be used to fire neurons and create spikes |
`stop()` | Function | Function to stop ongoing network activity from spiking | 

#### Neuron

Name | Type | Description | 
--- | --- | --- | 
`Neuron` | Class | Extends `EventEmitter`. Is instantiated by `NeuraNetwork` to implement network neurons | 
`synapses` | Class Variable | Interconnections between neurons |
`id` | Class Variable | Unique neuron identifier  |
`potential` | Class Variable | Neuron action potential |
`signalMaxFireDelay` | Class Variable | Timeout in `ms` neuron takes after spiking |
`signalRecoveryDelay` | Class Variable | Time in `ms` neurons take to recover after spiking |
`signalFireThreshold` | Class Variable | Neuronal threshold for action potential |
`spike(potential)` | Function | Function to fire neuron and increase neuronal potential |

#### Network Simulator

Name | Type | Description | 
--- | --- | --- | 
`createGraphData(network)` | Function | Takes the spiking neural network as parameter. Maps neurons and their attributes to force graph data | 
`NetworkSimulator()` | React Component | Creates an instance of `NeuralNetwork` and holds application state. Implements user interface and user interaction. Renders 2D force graph |

## Experiments & Results

**a) Experiment with different densities and strengths of networks (synapses)**

In the present experiment, the network was initialized with different combinations of parameters. In general, it can be stated that the number of synapses in the network has a significant influence on the spiking behavior. The more synapses there are in the network, i.e. the more neurons are interconnected, the more spikes are generated. 

Likewise, the neuronal parameters action potential threshold and the recovery time per neuron have an influence on the spiking behavior. A low threshold and a low recovery time increase the occurrence of spikes in the network.

As a result, it can be stated that the spiking behavior depends on the neuronal properties. A high density as well as a high number of synapses promote the excitation of the network. The same applies to a low neuronal action potential threshold and a low neuronal recovery time.

The available findings can be reproduced in the simulator by means of appropriate parameterization as mentioned in this section.

**b) What influence does the initial excitation of the network have on the final state?**

The initial excitation has a non-linear relationship with the further behavior of the neuronal network. This means, for example, that an initial excitation may dry up if the neurons it passes through are not connected to other neurons via synapses, or if the action potential is not sufficient to excite further neurons connected. 

**c) What other dynamics besides saturation and drying up of activity is possible in principle? Do you succeed in generating such a dynamic?**

Besides the dynamics of saturation and drying of signals, a kind of oversaturation could be observed in the simulator. 

When a network with a higher density of 1,000 neurons or more was initialized with an average of four synpases per neuron, it was observed that signals passing through neurons in an apparently recursive manner caused the network to enter a steady state of spiking.
