function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//. Create the buildCharts function.
function buildCharts(sample) {
  
   //  Use d3.json to load and retrieve the samples.json file 
   d3.json("samples.json").then((data) => {

     //  Create a variable that holds the samples array. 
    var samplesArray =data.samples;
    console.log(samplesArray);

    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilters = samplesArray.filter(sampleObj=>sampleObj.id==sample);
    console.log(sampleFilters);
   
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData=data.metadata;
    var filtermetaData=metaData.filter(sampleObj=>sampleObj.id==sample);

    //  Create a variable that holds the first sample in the array.
    var firstSample=sampleFilters[0];
    console.log(firstSample);
    
     // Create a variable that holds the first sample in the metadata array.
    var firstsampleMetadata=filtermetaData[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds=firstSample.otu_ids;
    console.log(otuIds);

    var otuLabels=firstSample.otu_labels;
    console.log(otuLabels);

     var sampleValues=firstSample.sample_values;
     console.log(sampleValues);

    // Create a variable that holds the washing frequency.
     var wfreq=firstsampleMetadata.wfreq;
     console.log(wfreq);

     //Create the yticks for the bar chart
    var yticks= otuIds.slice(0,10).map(id=>"OTU"+id).reverse();


    // Create the trace for the bar chart. 
    var trace={
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text:otuLabels,
      type:"bar",
      orientation:"h",
      marker:{color:"darkviolet"}
    };

    var barData = [trace];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin:{t:50,l:150},
      paper_bgcolor:"ivory"
    
    };
   
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot ("bar", barData, barLayout);
    
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y:  sampleValues,
      text:otuLabels,
      type:"scatter",
      mode:'markers',
      marker:{
        color:otuIds,
         size:sampleValues,
         colorscale:"Earth"
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"},
      paper_bgcolor:"ivory"
      
      
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
      value: wfreq,
      title: {text:"Belly Button Washing Frequency"},
      type:"indicator",
      mode:"gauge+number",
      gauge:{
        axis:{range:[null,10]},
        bar:{color:"black"},
        steps:[
          {range:[0,2], color:"red"},
          {range:[2,4], color:"orange"},
          {range:[4,6], color:"yellow"},
          {range:[6,8], color:"lightgreen"},
          {range:[8,10], color:"green"}
        ]
      }
    }];

    // Create the layout for the gauge chart.
    var gaugeLayout = { width:350, height:350, margin:{t:0,b:0, r:25, l:0},
      paper_bgcolor:"ivory"
     
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
