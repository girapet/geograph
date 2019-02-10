
// Cleans out unnecessary objects from a graph and returns it.

const cleanUp = (options) => {
  const graph = options.graph;
  
  graph.endpoints = undefined;
  
  if (!options.preserveCoordinates) {
    graph.nodes.forEach((node) => {
      node.coordinate = undefined;
    });
  }
  
  return graph;
};

export default cleanUp;