import coordinates from './coordinates.js';

// Matches points to their corresponding graph nodes, transfers keys to the nodes, 
// and returns the completed graph.  At this point the graph is ready for use.

// search for the node closest to the given coordinate within the
// search tolerance (squared) and return its index

const findNode = (graph, c, nodeSnap) => {
  const nodeSnap2 = nodeSnap * nodeSnap;
  
  let min = 0;
  let max = graph.nodes.length - 1;
  let n = Math.floor(max * 0.5);
  let r = -1;
  
  // perform a binary search for the node closest to the coordinate
  // regardless of the search tolerance
  
  while (r !== 0 && min < n && n < max) {
    r = coordinates.compare(c, graph.nodes[n].coordinate);

    if (r !== 0) {
      if (r < 0) {
        max = n;
      }
      else {
        min = n;
      }

      n = Math.floor((min + max) * 0.5);
    }
  }
  
  // search outwards for the closest node within the search tolerance
  
  let nearestNode = -1;
  let nearestDistance2 = Number.POSITIVE_INFINITY;
  let difference = { x: 0 };
 
  for (let j = n; j >= 0 && difference.x <= nodeSnap && nearestDistance2 > 0; --j) {
    const node = graph.nodes[j];
    difference = coordinates.difference(c, node.coordinate);
    
    if (c.length === node.coordinate.length && difference.d2 <= nodeSnap2 && difference.d2 < nearestDistance2) {
      nearestNode = j;
      nearestDistance2 = difference.d2;
    }
  }
  
  difference.x = 0;
    
  for (let j = n + 1; j < graph.nodes.length && difference.x <= nodeSnap && nearestDistance2 > 0; ++j) {
    const node = graph.nodes[j];
    difference = coordinates.difference(c, node.coordinate);
    
    if (c.length === node.coordinate.length && difference.d2 <= nodeSnap2 && difference.d2 < nearestDistance2) {
      nearestNode = j;
      nearestDistance2 = difference.d2;
    }
  }

  return nearestNode;
}

const matchNodes = async (options) => {
  const graph = options.graph;
  const reader = options.reader;
  const nodeKeyProperty = options.nodeKeyProperty || 'id';
  const nodeSnap = options.nodeSnap || 0;
  
  for await (const feature of reader) {
    const key = feature.properties[nodeKeyProperty];
    
    if (feature.geometry.type === 'Point' && key) {
      const nearestNode = findNode(graph, feature.geometry.coordinates, nodeSnap);
      
      if (nearestNode > -1) {
        graph.nodes[nearestNode].key = key;
        graph.nodeIndex[key] = nearestNode;
      }
    }
  }
  
  return graph;
};

export default matchNodes;
