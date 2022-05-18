import EventEmitter from 'events';

const NETWORK_DEFAULT_SIZE = 256;
const NETWORK_DEFAULT_SHAPE = 'sausage';
const SYNAPSE_AVG_PER_NEURON = 4;
const SIGNAL_MAX_FIRE_DELAY = 200;
const SIGNAL_RECOVERY_DELAY = 1250;
const SIGNAL_FIRE_THRESHOLD = 0.3;
const LEARNING_RATE = 0.3;
const LEARNING_PERIOD = 60 * 1000;

export class NeuralNetwork extends EventEmitter {

    constructor(size, shape, synapseAvgPerNeuron, signalMaxFireDelay, signalRecoveryDelay, signalFireThreshold) {
        super();
        this.shape = shape || NETWORK_DEFAULT_SHAPE;
        this.synapseAvgPerNeuron = synapseAvgPerNeuron || SYNAPSE_AVG_PER_NEURON;
        this.signalMaxFireDelay = signalMaxFireDelay || SIGNAL_MAX_FIRE_DELAY;
        this.signalRecoveryDelay = signalRecoveryDelay || SIGNAL_RECOVERY_DELAY;
        this.signalFireThreshold = signalFireThreshold || SIGNAL_FIRE_THRESHOLD;
        this.nodes = [];
        this.channels = [];
        if (typeof size === 'number') {
            // Initialize with size
            this.nodes = new Array(size)
                .fill()
                .map((n, i) => Neuron.random(i, size, shape, this.synapseAvgPerNeuron, this.signalMaxFireDelay, this.signalRecoveryDelay, this.signalFireThreshold));
        }
        else if (size && size.nodes && size.nodes instanceof Array) {
            // Initialize with exported network
            this.nodes = size.nodes.map((n, i) => {
                var neuron = new Neuron(n.s, n.id);
                neuron.synapses.forEach(s => s.i = s.t);
                return neuron;
            });
        }
        // Extra initialization per neuron
        this.nodes.forEach(neuron => {
            neuron.on('spike', id => this.emit('spike', id));
            // Add synapse ref pointers to corresponding target neurons
            neuron.synapses.forEach(synapse => {
                synapse.t = this.nodes[synapse.i];
            })
        });
    }

    // Fire a neuron, used for testing and visualization
    spike(id) {
        if (id && this.nodes[id]) {
            this.nodes[id].spike();
        }
    }

    // Stops the network firing, used for testing and visualization
    // network.stop();
    stop() {
        this.synapses.forEach(s => clearTimeout(s.c));
    }

    get size() {
        return this.nodes.length;
    }

    get strength() {
        var synapses = this.synapses;
        return synapses.map(s => s.w).reduce((a, b) => a + b, 0) / synapses.length;
    }

    get synapses() {
        return this.nodes.reduce((acc, node) => acc.concat(node.synapses), []);
    }
}

class Neuron extends EventEmitter {

    constructor(synapses, index, signalMaxFireDelay, signalRecoveryDelay,signalFireThreshold) {
        super();
        this.synapses = synapses || [];
        this.id = index > -1 ? index : Random.alpha(6);
        this.potential = 0;

        this.signalMaxFireDelay = signalMaxFireDelay;
        this.signalRecoveryDelay = signalRecoveryDelay;
        this.signalFireThreshold = signalFireThreshold;
    }

    // Generates a random neuron
    static random(position, networkSize, shape, synapseAvgPerNeuron, signalMaxFireDelay, signalRecoveryDelay, signalFireThreshold) {
        // Number of synapses are random based on average
        var synapses = new Array(Random.integer(1, synapseAvgPerNeuron * 2 - 1))
            .fill()
            .map(() => {
                var shaper = NetworkShapes[shape],
                    i = shaper(position, networkSize),
                    w = Math.pow(Math.random(), 3);

                if (i) {
                    return { i, w }; // index, weight
                }
                // Cannot find suitable target
                return null;
            })
            .filter(s => !!s);
        return new Neuron(synapses, position, signalMaxFireDelay, signalRecoveryDelay, signalFireThreshold);
    }

    // Should be optimised as this gets executed very frequently.
    spike(potential) {
        if (this.isfiring) return false;
        // Action potential is accumulated so that
        // certain patterns can trigger even
        // weak synapses.
        this.potential += potential || 1;
        setTimeout(() => this.potential -= potential, SIGNAL_RECOVERY_DELAY / 2);
        if (this.potential > this.signalFireThreshold) {
            // Fire signal
            this.isfiring = true;
            this.emit('spike', this.id);
            this.synapses.forEach(synapse => {
                if (synapse.t) {
                    // Stronger connections will fire quicker
                    // @see Conduction Velocity: https://faculty.washington.edu/chudler/cv.html
                    synapse.c = setTimeout(() => {
                        if (synapse.t.spike(synapse.w)) {
                            // Avoid epileptic spasm by tracking when last fired
                            synapse.l = new Date().getTime();
                        }
                    }, Math.round(this.signalMaxFireDelay * (1 - synapse.w)));

                }
            });
            // Post-fire recovery
            setTimeout(() => {
                this.potential = 0;
                this.isfiring = false;
                this.emit('ready', this.id);
            }, SIGNAL_RECOVERY_DELAY);
        }
        return true;
    }

}

class NetworkShapes {
    // Random ball shape (neurons linked at random)
    static ball(position, size) {
        var i = Random.integer(0, size);
        if (i !== position) {
            return i;
        }
        return null;
    }

    // Tube shape
    static tube(position, size) {
        var i, range = Math.ceil(size / 5);
        for (var tries = 0; tries < 3; tries++) {
            var from = -1 * range + position;
            var to = range + position;
            i = Random.integer(from, to);
            if (i > 0 && i < size && i !== position) {
                return i;
            }
        }
        return null;
    }

    // Snake shape
    static snake(position, size) {
        var i, range = Math.ceil(size / 20);
        for (var tries = 0; tries < 3; tries++) {
            var from = -1 * range + position;
            var to = range + position;
            i = Random.integer(from, to);
            if (i > 0 && i < size && i !== position) {
                return i;
            }
        }
        return null;
    }

    // Forward-biased sausage shape
    // (neurons linked to neurons with similar id, slightly ahead of each other)
    static sausage(position, size) {
        var i, range = Math.ceil(size / 10);
        var offset = position + Math.floor(range / 2);
        for (var tries = 0; tries < 3; tries++) {
            var from = -1 * range + offset;
            var to = range + offset;
            i = Random.integer(from, to);
            if (i > 0 && i < size && i !== position) {
                return i;
            }
        }
        i = Random.integer(0, size);
        if (i !== position) {
            return i;
        }
        return null;
    }

    // Donught shape
    static donught(position, size) {
        var i, range = Math.ceil(size / 20);
        var offset = position + Math.floor(range / 2);
        for (var tries = 0; tries < 3; tries++) {
            var from = -1 * range + offset;
            var to = range + offset;
            i = Random.integer(from, to);
            if (i >= size) {
                return i - size; // Link to beginning
            }
            if (i < 0) {
                return size + i; // Link to end
            }
            if (i !== position) {
                return i;
            }
        }
        return null;
    }
}

class Random {
    // Inclusive random integers
    static integer(from, to) {
        if (!from && !to) return 0;
        if (!to) { to = from; from = 0; }
        var diff = to + 1 - from;
        return Math.floor(Math.random() * diff) + from;
    }

    static alpha(length) {
        var output = '';
        do {
            output += Math.random().toString('16').substr(2);
            if (output.length > length) {
                output = output.substr(0, length);
            }
        } while (length > 0 && output.length < length)
        return output;
    }
}
