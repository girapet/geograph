import coordinates from './coordinates.js';

// Generates nodes from link endpoints and returns the graph.

const generateNodes = (options) => {
  const graph = options.graph;
  const linkSnap = options.linkSnap || 0;
  const linkSnap2 = linkSnap * linkSnap;
  
  // sort the link endpoint coordinates in X-major order
  
  graph.endpoints.sort((a, b) => coordinates.compare(a.coordinate, b.coordinate));

  graph.nodes = [];
  graph.nodeIndex = {};
  
  // loop through the link endpoints
  
  graph.endpoints.forEach((endpoint) => {
    let nodeIndex = -1;
    let nearestDistance2 = Number.POSITIVE_INFINITY;
    let difference = { x: 0 };
    
    // search for the nearest existing node; since the endpoints are sorted on X 
    // the existing nodes must have X-values less than the current endpoint, so
    // search backwards through the nodes until the difference in X exceeds
    // the link snapping tolerance
    
    for (let j = graph.nodes.length - 1; j >= 0 && difference.x <= linkSnap; --j) {
      const node = graph.nodes[j];
      difference = coordinates.difference(endpoint.coordinate, node.coordinate);
      
      if (endpoint.coordinate.length === node.coordinate.length && difference.d2 <= linkSnap2 && difference.d2 < nearestDistance2) {
        nodeIndex = j;
        nearestDistance2 = difference.d2;
      }
    }
    
    // if this is a new node, push it onto the graph's nodes array
    
    if (nodeIndex < 0) {
      nodeIndex = graph.nodes.length;
      graph.nodes.push({ coordinate: endpoint.coordinate, links: [] });
    }
    
    // connect the link to the node
    
    graph.links[endpoint.link][endpoint.which] = nodeIndex;
    graph.nodes[nodeIndex].links.push(endpoint.link);
  });
  
  return graph;
};

export default generateNodes;