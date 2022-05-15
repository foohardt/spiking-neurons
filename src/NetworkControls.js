import React from "react";

const NetworkControls = ({
  numberOfNeurons,
  synapseAvgPerNeuron,
  signalMaxFireDelay,
  signalRecoveryDelay,
  signalFireThreshold,
  setNumberOfNeurons,
  setSynapseAvgPerNeuron,
  setSignalMaxFireDelay,
  setSignalRecoveryDelay,
  SetSignalFireThreshold,
  createForceGraph,
  stopNetowrk,
}) => {

  return (
    <div id="network-controls">
      <div className="d-flex">
        <div className="form-group">
          <label>Number of Neurons</label>
          <input
            type="number"
            className="form-control"
            id="synapseAvgPerNeuron"
            value={numberOfNeurons}
            onChange={(e) => setNumberOfNeurons(parseInt(e.target.value))()}
          />
        </div>
        <div className="form-group">
          <label>Avg. Synapes per Neuron</label>
          <input
            type="number"
            className="form-control"
            id="synapseAvgPerNeuron"
            value={synapseAvgPerNeuron}
            onChange={(e) => setSynapseAvgPerNeuron(parseInt(e.target.value))()}
          />
        </div>
        <div className="form-group">
          <label>Max. Signal Fire Delay</label>
          <input
            type="number"
            className="form-control"
            id="signalMaxFireDelay"
            value={signalMaxFireDelay}
            onChange={(e) => setSignalMaxFireDelay(parseInt(e.target.value))()}
          />
        </div>
        <div className="form-group">
          <label>Signal Recovery Delay</label>
          <input
            type="number"
            className="form-control"
            id="signalRecoveryDelay"
            value={signalRecoveryDelay}
            onChange={(e) => setSignalRecoveryDelay(parseInt(e.target.value))()}
          />
        </div>
        <div className="form-group">
          <label>Signal Fire Threshold</label>
          <input
            type="number"
            className="form-control"
            id="signalFireThreshold"
            value={signalFireThreshold}
            onChange={(e) => SetSignalFireThreshold(parseFloat(e.target.value))()}
          />
        </div>
        <span className="align-baseline">
          <button className="btn btn-primary ms-1" onClick={createForceGraph}>
            Initialize
          </button>
          <button className="btn btn-secondary ms-1" onClick={stopNetowrk}>
            Stop
          </button>
        </span>
      </div>
    </div>
  );
};

export default NetworkControls;
