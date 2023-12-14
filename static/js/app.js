// Get the S3 amazon endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Global variables to be populated and used in the functions.
var names;
var samples;
var metadata;

//fetch data from url and populate the drop down list.
dataFromUrl = d3.json(url).then(function(data) {
    names = data.names;
    for (i=0; i<names.length; i++) {
        //Populate drop down list with options with text as name and value as index
        d3.select("#selDataset").append("option").text(names[i]).property("value",i)
    }
    samples = data["samples"];
    metadata = data["metadata"];

    //Calling option changed with default value of 0th index to populate the page on page-load.
    //This way something will come up when page loads instead of empty page.
    optionChanged(0);
});

//This function is called when an option is selected from the dropdown.
function optionChanged(value) {

    //fetching samples and metadata using selected value from the drop down.
    let selectedSample = samples[value]; 
    let selectedMetadata = metadata[value];

    //Functions to call on selecting value from drop-down.
    createBar(selectedSample);
    showDemographicInfo(selectedMetadata);
    createBubbleChart(selectedSample);
}

//Create bar graph
function createBar(selectedSample) {

    let otuIds = selectedSample.otu_ids;
    let sampleValues = selectedSample.sample_values;
    let otu_labels = selectedSample.otu_labels;

    //Get top data to populate in the bar chart.
    let topOtuIds = otuIds.slice(0,10);
    let topSamples = sampleValues.slice(0,10);
    let topLabels = otu_labels.slice(0,10);

    let newTopOtuIds = topOtuIds.map(function(data) {
        return "OTU " + data;
    });

    //Plot the data on bar graph.
    let trace = {
        y: newTopOtuIds.reverse(),
        x: topSamples.reverse(),
        type: 'bar',
        hovertext: topLabels.reverse(),
        orientation: 'h'
    };

    let data = [trace];

    Plotly.newPlot("bar", data,);
}

//Display demographic info based on selected value from dropdown
function showDemographicInfo(selectedMetadata) {
    //Reset the data in the div. This way old selection will be removed when new value from drop down is selected.
    d3.select("#sample-metadata").text("");

    //Populate the data in the div.
    d3.select("#sample-metadata")
    .append("p").text("id: " + selectedMetadata.id)
    .append("p").text("ethnicity: " + selectedMetadata.ethnicity)
    .append("p").text("gender: " + selectedMetadata.gender)
    .append("p").text("age: " + selectedMetadata.age)
    .append("p").text("location: " + selectedMetadata.location)
    .append("p").text("bbtype: " + selectedMetadata.bbtype)
    .append("p").text("wfreq: " + selectedMetadata.wfreq);
}

//create a bubble chart based on selected value from drop down.
function createBubbleChart(selectedSample){
    let otuIds = selectedSample.otu_ids;
    let sampleValues = selectedSample.sample_values;
    let otu_labels = selectedSample.otu_labels;

    //Plot the bubble graph.
    let trace1 = {
        x: otuIds,
        y: sampleValues,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Earth'
        }
    };
    let data = [trace1];

    let layout = {
        showlegend: false,
        height: 600,
        width: 1200,
        xaxis: {
            title: 'OTU ID'
        }    
    };
    Plotly.newPlot("bubble", data, layout);
}

