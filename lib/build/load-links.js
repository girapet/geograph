
// Loads link endpoint coordinates and returns an incomplete graph (no nodes yet).

const loadLinks = async (options) => {
  const graph = options.graph || {};
  const reader = options.reader;
  const linkKeyProperty = options.linkKeyProperty || 'id';
  const linkFlowProperty = options.linkFlowProperty || 'flow';
  const onewayValue = options.onewayValue || 'oneway';
  
  if (!graph.links) {
    graph.links = [];
  }
  
  if (!graph.linkIndex) {
    graph.linkIndex = {};
  }
  
  if (!graph.endpoints) {
    graph.endpoints = [];
  }
  
  for await (const feature of reader) {
    if (feature.geometry.type === 'LineString') {
      const linkIndex = graph.links.length;
      const link = {};
      const key = feature.properties[linkKeyProperty];
      
      if (key) {
        link.key = key;
        graph.linkIndex[key] = linkIndex;
      }
      
      if (feature.properties[linkFlowProperty] === onewayValue) {
        link.oneway = true;
      }
      
      graph.links.push(link);
      
      const coordinates = feature.geometry.coordinates;
      graph.endpoints.push({ link: linkIndex, which: 'from', coordinate: coordinates[0].slice() });
      graph.endpoints.push({ link: linkIndex, which: 'to', coordinate: coordinates[coordinates.length - 1].slice() });
    }
  }
  
  return graph;
};

export default loadLinks;