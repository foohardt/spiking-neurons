import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

import { NeuralNetwork } from './snn'

const createGraphData = (network) => {
    console.log("createGraphData", network)
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
            group: synapseIndex
        })
    }

    nodes.sort((a, b) => { return a.group - b.group })

    const links = [];
    for (const neuron of network.nodes) {
        for (const synapse of neuron.synapses) {
            let target = ""

            if (!synapse.t) {
                continue
            }
            if (synapse.t) {
                target = synapse.t.id;
            }

            links.push({
                source: neuron.id,
                target: target,
                value: synapse.w,
            })
        }
    }

    const data = {
        nodes: nodes,
        links: links,
    }
    const graphData = data;

    // cross-link node objects
    graphData.links.forEach(link => {
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

    return graphData
}

function ForceGraph() {
    let network = new NeuralNetwork(1000, 'tube');

    const [graphData, setGraphData] = useState({ nodes: [{ id: 0 }], links: [] });
    const [fireNodes, setFireNodes] = useState(new Set());

    useEffect(() => {
        init()
    }, []);

    const init = () => {
        const graphData = createGraphData(network)
        setGraphData(graphData)
    }

    const stopNetowrk = () => {
        network.stop();
    }

    const handleNodeClick = (node) => {
        network.fire(node.id)
        for (const node of network.nodes) {
            node.on('fire', function (id) {
                console.log("fire", id)
                fireNodes.add(id)
            })
            setFireNodes(fireNodes)
            node.on('ready', function (id) {
                //console.log("ready", id)
                fireNodes.clear();

            })
            setFireNodes(fireNodes)
        }
    }

    const paintNode = (node) => {
        for (const fireNode of fireNodes) {
            if (node.id === fireNode) {
                return '#FF0000'
            }
        }
    }

    const NODE_R = 8;
    return (
        <>

            <button onClick={stopNetowrk}>Stop</button>


            <ForceGraph2D
                graphData={graphData}
                nodeLabel="id"
                nodeColor={paintNode}
                nodeRelSize={NODE_R}
                linkDirectionalParticles="value"
                linkDirectionalParticleSpeed={d => d.value * 0.01}
                onNodeClick={handleNodeClick}
            />

        </>
    )
}

export default ForceGraph;