# Spiking Neurons

## Introduction

Spiking Neurons is an experimental interactive visualization of a spiking neural network run in the web browser.

## Dependencies

This section contains a list of all project dependencies. Dependencies can be found as well in the project's `package.json` file.

Name | Description | Reference |
--- | --- | --- | 
 React | React is a front end Java Script library for bulding user interfaces und UI components. In this project React is used to implement a single page application | https://reactjs.org/ |
react-force-graph-2d | react-force-graph-2d is graphical library to render a parameterized 2D forcegraph using a canvas element.In this project it is used to visualize the spiking neural network. It is also used to implement interaction with the spiking neural network | https://github.com/vasturiano/react-force-graph |
Bootswatch | Bootswatch is a CSS library containing free themes for Bootstrap. In this project Bootswatch is used to style the user interface and UI components in a convenient way | https://bootswatch.com/ |
events | events is a library, which implements the Node.js events module for the browser environment. In this project events is used to implement the neural network and it's neurons as event emitters | https://github.com/browserify/events#readme |

## Technical Documentation

This section contains an overview about the project structure, it's components and their crucial functions. 

### Project Structure

### Spiking Neural Network

The spiking neural network is implented in `snn.js`. Network and neurons are implemented as JavaScript classes. Both extend the classs `EventEmitter` and contain functions to emit events, which can be listened on. 

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
`fire(id)` | Function | Function to fire a certain neuron. Can be used to fire neurons and create spikes |
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
`fire()` | Function | Function to fire neuron |

### Network Simulator

Name | Type | Description | 
--- | --- | --- | 
 | | | 

## Experiments & Results
