import React, { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

import { NeuralNetwork } from "./snn";

const createGraphData = (network) => {
  if (!network) {
    return;
  }
  let nodes = [];
  for (const neuron of network.nodes) {
    let synapseIndex;
    for (const synapse of neuron.synapses) {
      synapseIndex = synapse.i;
    }

    nodes.push({
      id: neuron.id,
      group: synapseIndex,
    });
  }

  nodes.sort((a, b) => {
    return a.group - b.group;
  });

  const links = [];
  for (const neuron of network.nodes) {
    for (const synapse of neuron.synapses) {
      let target = "";

      if (!synapse.t) {
        continue;
      }
      if (synapse.t) {
        target = synapse.t.id;
      }

      links.push({
        source: neuron.id,
        target: target,
        value: synapse.w,
      });
    }
  }

  const data = {
    nodes: nodes,
    links: links,
  };
  const graphData = data;

  // cross-link node objects
  graphData.links.forEach((link) => {
    const a = graphData.nodes[link.source];
    const b = graphData.nodes[link.target];
    !a.neighbors && (a.neighbors = []);
    !b.neighbors && (b.neighbors = []);
    a.neighbors.push(b);
    b.neighbors.push(a);

    !a.links && (a.links = []);
    !b.links && (b.links = []);
    a.links.push(link);
    b.links.push(link);
  });

  return graphData;
};

function ForceGraph() {
  // Spiking neural network
  const [network, setNeuralNetwork] = useState(undefined);

  // Network parameters
  const [synapseAvgPerNeuron, setSynapseAvgPerNeuron] = useState(undefined);
  const [signalMaxFireDelay, setSignalMaxFireDelay] = useState(undefined);
  const [signalRecoveryDelay, setSignalRecoveryDelay] = useState(undefined);
  const [signalFireThreshold, SetSignalFireThreshold] = useState(undefined);

  // Visualization attributes
  const [graphData, setGraphData] = useState({ nodes: [{ id: 0 }], links: [] });
  const [nodesOnFire, setNodesOnFire] = useState(new Set());

  useEffect(() => {
    createForceGraph();
  }, []);

  const initializeNetwork = () => {
    setNeuralNetwork(new NeuralNetwork(100, "ball", 4, 200, 1250, 0.3));

  };


  const createForceGraph = () => {
    initializeNetwork();
    setGraphData(createGraphData(network));
  };

  const stopNetowrk = () => {
    network.stop();
  };

  const handleNodeClick = (node) => {
    console.log(network);
    network.fire(node.id);

    for (const node of network.nodes) {
      node.on("fire", function (id) {
        console.info("fire", node.id, node.potential, node);
        nodesOnFire.add(id);
      });

      setNodesOnFire(nodesOnFire);

      node.on("ready", function (id) {
        //console.log("ready", id)
        nodesOnFire.clear();
      });

      setNodesOnFire(nodesOnFire);
    }
  };

  const paintNode = (node) => {
    for (const fireNode of nodesOnFire) {
      if (node.id === fireNode) {
        return "#FF0000";
      }
    }
  };

  const NODE_R = 8;
  return (
    <>
      <button className="btn btn-primary" onClick={createForceGraph}>Initialize</button>
      <button onClick={stopNetowrk}>Stop</button>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeColor={paintNode}
        nodeRelSize={NODE_R}
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={(d) => d.value * 0.01}
        onNodeClick={handleNodeClick}
      />
    </>
  );
}

export default ForceGraph;
