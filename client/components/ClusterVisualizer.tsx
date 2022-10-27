import React, { useState, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import styleSheet from './Stylesheet'
import options2 from './CytoscapeConfig'


cytoscape.use(coseBilkent);
const ClusterVisualizer = () => {
  console.log('imported options: ', options2)
  const [podData, setPodData] = useState([]);

  useEffect(() => {
    fetch('/api/cluster')
    .then((response) => response.json())
    // .then((data) => console.log('Inside fetch', data))
    .then((data) => {setPodData(data)});
  }, []);

  const layout = options2()
  // console.log("Cluster Data Format:")
  // console.log(podData);
  
  return (
  <div>
  {/* <div id="title">Konstellation</div> */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
    }}
    
  >
    
   
    <CytoscapeComponent
     
      elements={podData}
      stylesheet={styleSheet}
      layout={layout}
      style={{
        width: '70%',
        height: '50rem',
        border: 'solid',
        objectFit: 'cover',
      }}
    ></CytoscapeComponent>
  </div>
  </div>
  )
}

export default ClusterVisualizer