import GeoJsonReader from './lib/build/geojson-reader.js';
import loadLinks from './lib/build/load-links.js';
import generateNodes from './lib/build/generate-nodes.js';
import matchNodes from './lib/build/match-nodes.js';
import cleanUp from './lib/build/clean-up.js';
import findSubgraphs from './lib/build/find-subgraphs.js';

const links = require('./data/links.json');
const nodes = require('./data/nodes.json');

const linkReader = new GeoJsonReader(links);
const nodeReader = new GeoJsonReader(nodes);

const test = async () => {
  let graph = await loadLinks({ reader: linkReader });
  graph = generateNodes({ graph });
  graph = await matchNodes({ graph, reader: nodeReader });
  graph = cleanUp({ graph });
  graph = findSubgraphs({ graph });
  console.log(JSON.stringify(graph, null, 2));
};

test();
