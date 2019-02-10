
// Find subgraphs: tag links and nodes with subgraph IDs, and returns the graph.

// tag all links a nodes connected to the given node with a subgraph ID;
// performs a depth-first search non-recursively

const tagSubgraph = (graph, n, sub) => {
  let node = graph.nodes[n];
  node.sub = sub;
  
  let current = { nodeIndex: n, linkIndex: -1 };
  const stack = [current];
  
  do {
    current.linkIndex += 1;
    
    if (current.linkIndex < node.links.length) {
      const link = graph.links[node.links[current.linkIndex]];
      
      if (!link.sub) {
        link.sub = sub;
        n = link.from === current.nodeIndex ? link.to : link.from;
        node = graph.nodes[n];
        
        if (!node.sub) {
          node.sub = sub;
          current = { nodeIndex: n, linkIndex: -1 };
          stack.push(current);
        }
      }
    }
    else {
      current = stack.pop();
      node = graph.nodes[current.nodeIndex];
    }
  }
  while (stack.length);
};

const findSubgraphs = (options) => {
  const graph = options.graph;
  
  let n = 0;
  let sub = 0;

  // search sequentially for nodes that have not yet been tagged
  
  while (n < graph.nodes.length) {
    sub += 1;
    tagSubgraph(graph, n, sub);

    do {
      n += 1;
    }
    while (n < graph.nodes.length && graph.nodes[n].sub > -1);
  }
  
  return graph;
};

export default findSubgraphs;
