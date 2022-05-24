
let SouthEast = L.latLng(-80, 180),
    NorthWest = L.latLng(80, -180),
    Bounds = L.latLngBounds(SouthEast, NorthWest);
let map = L.map('map', {
    maxBounds: Bounds,
    zoomControl: false,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 9
}).setView([50, 6.8], 2); //[8, 46]

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoia2FuaXdhcnIiLCJhIjoiY2t6OGd6bTM5MWlxajJvcnhhb2J4bW8zMiJ9.IqUfZFMC1eiBNj3tH_8IyA'
}).addTo(map);


//Render Zoom Control
L.control
    .zoom({
        position: "topright"
    })
    .addTo(map);

var sidebar = L.control
    .sidebar({
        autopan: false,
        container: "sidebar",
        position: "left"
    })
    .addTo(map);

//L.Control.geocoder().addTo(map);

//const geojson = JSON.parse($.ajax({ 'url': "./data.json", 'async': false }).responseText);
//console.log(geojson);
function childChild(i, j, widthMin, heightMin, widthMax, heightMax) {
    let child = {}
    child['coordinates'] = map.unproject([i, j]);
    child['maxCoor'] = map.unproject([widthMax, heightMax]);
    child['minCoor'] = map.unproject([widthMin, heightMin]);
    child['represent'] = '';
    return child;
}
function child(i, j, widthMin, heightMin, widthMax, heightMax) {
    let child = {};
    child['childreen'] = [];
    child['coordinates'] = map.unproject([i, j]);
    child['maxCoor'] = map.unproject([widthMax, heightMax]);
    child['minCoor'] = map.unproject([widthMin, heightMin]);
    child['represent'] = '';
    let child_1 = childChild(widthMin - 10, heightMin - 10, widthMin, heightMin, widthMin + 20, heightMin + 20);
    let child_2 = childChild(widthMin - 30, heightMin - 10, widthMin + 20, heightMin, widthMin + 40, heightMin + 20);
    let child_3 = childChild(widthMin - 10, heightMin - 30, widthMin, heightMin + 20, widthMin + 20, heightMin + 40);
    let child_4 = childChild(widthMin - 30, heightMin - 30, widthMin + 20, heightMin + 20, widthMin + 40, heightMin + 40);
    child['childreen'].push(child_1);
    child['childreen'].push(child_2);
    child['childreen'].push(child_3);
    child['childreen'].push(child_4);
    return child;
}
function clusterZoom(latMin, latMax, lngMin, lngMax) {
    var generatedCluster = [];
    for (let i = latMin; i < latMax; i = i + 80) {
        for (let j = lngMin; j < lngMax; j = j + 80) {
            var cluster = {};
            cluster['markers'] = [];
            cluster['childreen'] = [];
            //cluster['coordinates1'] = map.unproject([i + 40, j + 40]);
            cluster['coordinates'] = map.unproject([i, j]);
            cluster['maxCoor'] = map.unproject([i + 80, j + 80])
            cluster['minCoor'] = map.unproject([i, j])
            cluster['represent'] = '';
            child_1 = child(i - 20, j - 20, i, j, i + 40, j + 40);
            child_2 = child(i + 20, j - 20, i + 40, j, i + 80, j + 40);
            child_3 = child(i - 20, j + 20, i, j + 40, i + 40, j + 80);
            child_4 = child(i + 20, j + 20, i + 40, j + 40, i + 80, j + 80);
            cluster['childreen'].push(child_1);
            cluster['childreen'].push(child_2);
            cluster['childreen'].push(child_3);
            cluster['childreen'].push(child_4);
            generatedCluster.push(cluster);
            //console.log(cluster)
        }
    }
    //console.log(generatedCluster)
    for (let celle of generatedCluster) {
        //console.log(celle.coordinates.lng);
        for (const marker of geojson.features) {
            if (marker.geometry.coordinates[0] <= celle.minCoor.lat &&
                marker.geometry.coordinates[0] > celle.maxCoor.lat) {
                if (marker.geometry.coordinates[1] >= celle.minCoor.lng &&
                    marker.geometry.coordinates[1] < celle.maxCoor.lng) {
                    celle.markers.push(marker);
                }
            }
        }
        if (celle.markers.length != 0) {
            celle.represent = celle.markers[0];
        }
    }
    for (let i = 0; i < generatedCluster.length; i++) {
        if (generatedCluster[i].markers.length == 0) {
            generatedCluster.splice(i, 1);
            i--;
            //console.log(diff[i])
        }
    }
    childMarkers(generatedCluster);
    childLevel2Markers(generatedCluster);
    return generatedCluster;
}

function childMarkers(zoomlevel) {
    for (let i = 0; i < zoomlevel.length; i++) {
        let markersInChild1 = [];
        let markersInChild2 = [];
        let markersInChild3 = [];
        let markersInChild4 = [];
        for (let marker of zoomlevel[i].markers) {
            let ch1Lat = zoomlevel[i].childreen[0].minCoor.lat;
            let ch1Lng = zoomlevel[i].childreen[0].minCoor.lng;
            //console.log('lat: ' + ch1Lng, 'lng: ' + ch1Lat)
            let ch1LatMax = zoomlevel[i].childreen[0].maxCoor.lat;
            let ch1LngMax = zoomlevel[i].childreen[0].maxCoor.lng;
            //console.log('maxlat: ' + ch1LngMax, 'maxlng: '+ch1LatMax)
            let ch2Lat = zoomlevel[i].childreen[1].minCoor.lat;
            let ch2Lng = zoomlevel[i].childreen[1].minCoor.lng;
            let ch2LatMax = zoomlevel[i].childreen[1].maxCoor.lat;
            let ch2LngMax = zoomlevel[i].childreen[1].maxCoor.lng;
            let ch3Lat = zoomlevel[i].childreen[2].minCoor.lat;
            let ch3Lng = zoomlevel[i].childreen[2].minCoor.lng;
            let ch3LatMax = zoomlevel[i].childreen[2].maxCoor.lat;
            let ch3LngMax = zoomlevel[i].childreen[2].maxCoor.lng;
            let ch4Lat = zoomlevel[i].childreen[3].minCoor.lat;
            let ch4Lng = zoomlevel[i].childreen[3].minCoor.lng;
            let ch4LatMax = zoomlevel[i].childreen[3].maxCoor.lat;
            let ch4LngMax = zoomlevel[i].childreen[3].maxCoor.lng;
            let lat = marker.geometry.coordinates[0];
            let lng = marker.geometry.coordinates[1];
            if ((lat <= ch1Lat && lat > ch1LatMax) &&
                (lng >= ch1Lng && lng < ch1LngMax)) {
                markersInChild1.push(marker);

            }
            else if ((lng >= ch2Lng && lng < ch2LngMax) &&
                (lat <= ch2Lat && lat > ch2LatMax)) {
                markersInChild2.push(marker);
                //coordinates = childreen[1].coordinates;
                //child = childreen[1];
            }
            else if ((lng >= ch3Lng && lng < ch3LngMax) &&
                (lat <= ch3Lat && lat > ch3LatMax)) {
                markersInChild3.push(marker);
                //coordinates = childreen[2].coordinates;
                //child = childreen[2];
            }
            else if ((lng >= ch4Lng && lng < ch4LngMax) &&
                (lat <= ch4Lat && lat > ch4LatMax)) {
                markersInChild4.push(marker);
                //coordinates = childreen[2].coordinates;
                //child = childreen[2];
            }
        }
        zoomlevel[i].childreen[0]['markers'] = markersInChild1;
        zoomlevel[i].childreen[0].represent = markersInChild1[0];
        zoomlevel[i].childreen[1]['markers'] = markersInChild2;
        zoomlevel[i].childreen[1].represent = markersInChild2[0];
        zoomlevel[i].childreen[2]['markers'] = markersInChild3;
        zoomlevel[i].childreen[2].represent = markersInChild3[0];
        zoomlevel[i].childreen[3]['markers'] = markersInChild4;
        zoomlevel[i].childreen[3].represent = markersInChild4[0];
    }
};


function childLevel2Markers(zoomlevel) {
    for (let i = 0; i < zoomlevel.length; i++) {
        for (let child of zoomlevel[i].childreen) {
            if (child.markers.length == 1) {
                let ch1Lat = child.childreen[0].minCoor.lat;
                let ch1Lng = child.childreen[0].minCoor.lng;
                //console.log('lat: ' + ch1Lng, 'lng: ' + ch1Lat)
                let ch1LatMax = child.childreen[0].maxCoor.lat;
                let ch1LngMax = child.childreen[0].maxCoor.lng;
                //console.log('maxlat: ' + ch1LngMax, 'maxlng: '+ch1LatMax)
                let ch2Lat = child.childreen[1].minCoor.lat;
                let ch2Lng = child.childreen[1].minCoor.lng;
                let ch2LatMax = child.childreen[1].maxCoor.lat;
                let ch2LngMax = child.childreen[1].maxCoor.lng;
                let ch3Lat = child.childreen[2].minCoor.lat;
                let ch3Lng = child.childreen[2].minCoor.lng;
                let ch3LatMax = child.childreen[2].maxCoor.lat;
                let ch3LngMax = child.childreen[2].maxCoor.lng;
                let ch4Lat = child.childreen[3].minCoor.lat;
                let ch4Lng = child.childreen[3].minCoor.lng;
                let ch4LatMax = child.childreen[3].maxCoor.lat;
                let ch4LngMax = child.childreen[3].maxCoor.lng;
                let lat = child.markers[0].geometry.coordinates[0];
                let lng = child.markers[0].geometry.coordinates[1];
                if ((lat <= ch1Lat && lat > ch1LatMax) &&
                    (lng >= ch1Lng && lng < ch1LngMax)) {
                    child.childreen[0].represent = child.markers[0];
                }
                else if ((lng >= ch2Lng && lng < ch2LngMax) &&
                    (lat <= ch2Lat && lat > ch2LatMax)) {
                    child.childreen[1].represent = child.markers[0];
                    //coordinates = childreen[1].coordinates;
                    //child = childreen[1];
                }
                else if ((lng >= ch3Lng && lng < ch3LngMax) &&
                    (lat <= ch3Lat && lat > ch3LatMax)) {
                    child.childreen[2].represent = child.markers[0];
                    //coordinates = childreen[2].coordinates;
                    //child = childreen[2];
                }
                else if ((lng >= ch4Lng && lng < ch4LngMax) &&
                    (lat <= ch4Lat && lat > ch4LatMax)) {
                    child.childreen[3].represent = child.markers[0];
                    //coordinates = childreen[2].coordinates;
                    //child = childreen[2];
                }
            }
        }

    }
};

//let zoomlevel2 = clusterZoom(1000, 1024, 1000, 1024);
//let zoomlevel9 = clusterZoom(-10000, 133000, -10000, 133000);
//let zoomlevel8 = clusterZoom(-10000, 65500, -10000, 65500);
//let zoomlevel7 = clusterZoom(-5000, 32700, -5000, 33000);
//let zoomlevel6 = clusterZoom(-2500, 20000, -2500, 25000);
//let zoomlevel5 = clusterZoom(-1000, 8400, -1000, 10000);
//let zoomlevel4 = clusterZoom(-500, 4096, -500, 4096);
//let zoomlevel2 = clusterZoom(-2000, 2048, -2000, 2048);
//console.log(zoomlevel2)

function saveToFile(content, filename) {
    var file = filename + '.json';
    saveAs(new File([JSON.stringify(content)], file, {
        type: "text/plain;charset=utf-8"
    }), file);
}
//saveToFile(zoomlevel2, 'zoomlevel2');

var myDivIcon2 = L.divIcon({
    iconSize: new L.Point(40, 40),
    className: 'leaflet-div-icon'

});
var myDivIcon3 = L.divIcon({
    iconSize: new L.Point(20, 20),
    className: 'leaflet-div-icon'

});

var myDivIcon1 = L.divIcon({
    iconSize: new L.Point(80, 80),
    className: 'leaflet-div-icon'
});

function makeMarkers(zo) {
    let marker = L.layerGroup();
    for (let i = 0; i < zo.length; i++) {
        //let sizeCoordinates = imgSize(i, zo);
        // 80-50, 60-38, 40-25, 30-20, 20-12
        if (zo[i].childreen[0].markers.length > 20 || zo[i].childreen[1].markers.length > 20 ||
            zo[i].childreen[2].markers.length > 20 || zo[i].childreen[3].markers.length > 20) {
            const randomRep = Math.floor(Math.random() * zo[i].markers.length);
            if (zo[i].markers.length > 20 && zo[i].markers.length <= 40) {
                const img = new Image();
                img.onload = function () {
                    var newWidth;
                    var newHeight;
                    let height = img.height;
                    let width = img.width;
                    if (width > height) {
                        newWidth = 60;
                        newHeight = 45;
                    } else {
                        newHeight = 60;
                        newWidth = 45;
                    }
                    var icon = L.icon({
                        iconUrl: `6/${zo[i].markers[0].properties.path}`,//`6/${zo[i].represent.properties.path}`, 
                        iconSize: [newWidth, newHeight],
                    });
                    let newMarker = new L.marker(zo[i].coordinates, { icon: icon }); //.addTo(map);
                    newMarker.bindPopup(`
                    <h3 id = pup> Name: ${zo[i].markers[0].properties.name}</h3>
                    <h3 id = pup>Date: ${zo[i].markers[0].properties.date}</h3>
                    <h3 id = pup>Cluster size: ${zo[i].markers.length}</h3>
                    For more information click<a href = ${zo[i].markers[0].
                            properties.link} target="_blank"> here</a>`
                    ).openPopup();
                    newMarker.addTo(marker);
                    //new L.marker(zo[i].coordinates, { icon: myDivIcon1 }).addTo(marker)
                }
                img.src = `6/${zo[i].markers[0].properties.path}`;//`6/${zo[i].represent.properties.path}`;
                
            }else{
                const img = new Image();
                img.onload = function () {
                    var newWidth;
                    var newHeight;
                    let height = img.height;
                    let width = img.width;
                    if (width > height) {
                        newWidth = 80;
                        newHeight = 55;
                    } else {
                        newHeight = 80;
                        newWidth = 55;
                    }
                    var icon = L.icon({
                        iconUrl: `6/${zo[i].markers[0].properties.path}`,//`6/${zo[i].represent.properties.path}`, 
                        iconSize: [newWidth, newHeight] 
                    });
                    let newMarker = new L.marker(zo[i].coordinates, { icon: icon }); //.addTo(map);
                    newMarker.bindPopup(`
                    <h3 id = pup>Name: ${zo[i].markers[0].properties.name}</h3>
                    <h3 id = pup>Date: ${zo[i].markers[0].properties.date}</h3>
                    <h3 id = pup>Cluster size: ${zo[i].markers.length}</h3>
                    For more information click<a href = ${zo[i].markers[0].
                            properties.link} target="_blank"> here</a>`
                    ).openPopup();
                    newMarker.addTo(marker);
                    //new L.marker(zo[i].coordinates, { icon: myDivIcon1 }).addTo(marker) 
    
                }
                img.src = `6/${zo[i].markers[0].properties.path}`;//`6/${zo[i].represent.properties.path}`;        
            }        
        }
        else {
            for (let child of zo[i].childreen) {
                const randomRep1 = Math.floor(Math.random() * child.markers.length);
                if (child.markers.length > 1 && child.markers.length <= 10) {
                    const img = new Image();
                    img.onload = function () {
                        let newWidth;
                        let newHeight;
                        let height = img.height;
                        let width = img.width;
                        if (width > height) {
                            newWidth = 30;
                            newHeight = 20;
                        } else {
                            newHeight = 30;
                            newWidth = 20;
                        }
                        let icon = L.icon({
                            iconUrl: `6/${child.markers[0].properties.path}`,//`6/${child.represent.properties.path}`,
                            iconSize: [newWidth, newHeight],
                        });
                        let newMarker = new L.marker(child.coordinates, { icon: icon }); //.addTo(map);
                        newMarker.bindPopup(`
                        <h3 id = pup>Name: ${child.markers[0].properties.name}</h3>
                        <h3 id = pup>Date: ${child.markers[0].properties.date}</h3>
                        <h3 id = pup>Cluster size: ${child.markers.length}</h3>
                        For more information click<a href = ${child.markers[0].
                                properties.link} target="_blank"> here</a>`
                        ).openPopup();
                        newMarker.addTo(marker)
                        //new L.marker(zo[i].coordinates, { icon: myDivIcon1 }).addTo(marker);
                        //new L.marker(child.coordinates, { icon: myDivIcon2 }).addTo(marker);
                    }
                    img.src = `6/${child.markers[0].properties.path}`;//`6/${child.represent.properties.path}`;
                }
                else if (child.markers.length > 10 && child.markers.length <= 20) {
                    const img = new Image();
                    img.onload = function () {
                        let newWidth;
                        let newHeight;
                        let height = img.height;
                        let width = img.width;
                        if (width > height) {
                            newWidth = 40;
                            newHeight = 30;
                        } else {
                            newHeight = 40;
                            newWidth = 30;
                        }
                        let icon = L.icon({
                            iconUrl: `6/${child.markers[0].properties.path}`,//`6/${child.represent.properties.path}`,
                            iconSize: [newWidth, newHeight],
                        });
                        let newMarker = new L.marker(child.coordinates, { icon: icon }); //.addTo(map);
                        newMarker.bindPopup(`
                        <h3 id = pup>Name: ${child.markers[0].properties.name}</h3>
                        <h3 id = pup>Date: ${child.markers[0].properties.date}</h3>
                        <h3 id = pup>Cluster size: ${child.markers.length}</h3>
                        For more information click<a href = ${child.
                            markers[0].properties.link} target="_blank"> here</a>`
                        ).openPopup();
                        newMarker.addTo(marker);
                        //new L.marker(zo[i].coordinates, { icon: myDivIcon1 }).addTo(marker);
                        //new L.marker(child.coordinates, { icon: myDivIcon2 }).addTo(marker);

                    }
                    img.src = `6/${child.markers[0].properties.path}`;//`6/${child.represent.properties.path}`;
                }
                else if (child.markers.length == 1) {
                    for (let childChild of child.childreen) {
                        if (childChild.represent != '') {
                            const img = new Image();
                            img.onload = function () {
                                let newWidth;
                                let newHeight;
                                let height = img.height;
                                let width = img.width;
                                if (width > height) {
                                    newWidth = 20;
                                    newHeight = 15;
                                } else {
                                    newHeight = 20;
                                    newWidth = 15;
                                }
                                let icon = L.icon({
                                    iconUrl: `6/${childChild.represent.properties.path}`,
                                    iconSize: [newWidth, newHeight], // size of the icon
                                });
                                let newMarker = new L.marker(childChild.coordinates, { icon: icon }); //.addTo(map);
                                newMarker.bindPopup(`
                                <h3 id = "pup">Name: ${childChild.represent.properties.name}</h3>
                                <h3 id = "pup">Date: ${childChild.represent.properties.date}</h3>
                                <h3 id = "pup">Cluster size: 1</h3>
                                For more information click<a href = ${childChild.
                                        represent.properties.link} target="_blank"> here</a>`
                                ).openPopup();
                                newMarker.addTo(marker);
                                //new L.marker(zo[i].coordinates, { icon: myDivIcon1 }).addTo(marker);
                                //new L.marker(child.coordinates, { icon: myDivIcon2 }).addTo(marker);
                                //new L.marker(childChild.coordinates, { icon: myDivIcon3 }).addTo(marker);

                            }
                            img.src = `6/${childChild.represent.properties.path}`;

                        }
                    }
                }
            }
        }
    }
    return marker;
}

function imgfilter(data, startYear, endYear) {
    var newCluster = [];
    for (let i = 0; i < data.length; i++) {
        let filterArray = [];
        for (let j = 0; j < data[i].markers.length; j++) {
            if (data[i].markers[j].properties.date != 'Unknown date') {
                if (startYear <= data[i].markers[j].properties.date &&
                    data[i].markers[j].properties.date <= endYear) {
                    filterArray.push(data[i].markers[j]);
                    //console.log(data[i].markers[j].properties.date)
                }
            }
        }
        let newClusterMarkers = data[i];
        //console.log(filterArray)
        newClusterMarkers.markers = filterArray;
        newClusterMarkers.represent = filterArray[0];
        if (newClusterMarkers.markers.length != 0) {
            newCluster.push(newClusterMarkers)
        }
    }

    //console.log(newcluster);
    childMarkers(newCluster);
    childLevel2Markers(newCluster)
    //let markfilter3 = makeMarkers(newcluster);
    return newCluster;//markfilter3;
}

/* let zoomlevel2 = JSON.parse($.ajax({ 'url': "zoomlevel2.json", 'async': false }).responseText);
let zoomlevel3 = JSON.parse($.ajax({ 'url': "zoomlevel3.json", 'async': false }).responseText);
let zoomlevel4 = JSON.parse($.ajax({ 'url': "zoomlevel4.json", 'async': false }).responseText);
let zoomlevel5 = JSON.parse($.ajax({ 'url': "zoomlevel5.json", 'async': false }).responseText);
let zoomlevel6 = JSON.parse($.ajax({ 'url': "zoomlevel6.json", 'async': false }).responseText);
let zoomlevel7 = JSON.parse($.ajax({ 'url': "zoomlevel7.json", 'async': false }).responseText);
let zoomlevel8 = JSON.parse($.ajax({ 'url': "zoomlevel8.json", 'async': false }).responseText);
let zoomlevel9 = JSON.parse($.ajax({ 'url': "zoomlevel9.json", 'async': false }).responseText);


let generatedData = [];
generatedData.push(zoomlevel2);
generatedData.push(zoomlevel3);
generatedData.push(zoomlevel4);
generatedData.push(zoomlevel5);
generatedData.push(zoomlevel6);
generatedData.push(zoomlevel7);
generatedData.push(zoomlevel8);
generatedData.push(zoomlevel9);
//console.log(generatedData)
//const markersLevel2 = makeMarkers(zoomlevel2);
//const markersLevel3 = makeMarkers(zoomlevel3);
function saveToFile(content, filename) {
    var file = filename + '.json';
    saveAs(new File([JSON.stringify(content)], file, {
        type: "text/plain;charset=utf-8"
    }), file);
}
saveToFile(generatedData, 'generatedData');   */

const data = JSON.parse($.ajax({ 'url': "dataSimillarity.json", 'async': false }).responseText);
//console.log(data[7])

//console.log(data)
//const markersLevel2 = makeMarkers(zoomlevel2);
const markersLevel2 = makeMarkers(data[0]); const markersLevel3 = makeMarkers(data[1]);
const markersLevel4 = makeMarkers(data[2]); const markersLevel5 = makeMarkers(data[3]);
const markersLevel6 = makeMarkers(data[4]); const markersLevel7 = makeMarkers(data[5]);
const markersLevel8 = makeMarkers(data[6]); const markersLevel9 = makeMarkers(data[7]);
//console.log(`6/${data[0][0].represent.properties.path}`);
//`6/${markersLevel2.represent.properties.path}`
var filterData2, filterData3, filterData4, filterData5;
var filterData6, filterData7, filterData8, filterData9;

let imgDate = [];
for (let i = 0; i < data[0].length; i++) {
    for (let j = 0; j < data[0][i].markers.length; j++) {
        if (data[0][i].markers[j].properties.date > 1800 && data[0][i].markers[j].properties.date <= 1990) {
            imgDate.push(data[0][i].markers[j].properties.date)
        }

    }
}
const counts = {};
imgDate.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

let keys = Object.keys(counts);
let values = Object.values(counts);
var startYear;
var endYear;
var filterKeys;
var filterValues;
let falg = 'off';

var ctx = document.getElementById("line-chart").getContext('2d');
var config = {
    type: 'bar',
    data: {
        labels: keys,
        datasets: [{
            data: values,
            label: "Postcards",
            borderColor: "#3e95cd",
            backgroundColor: "#3e95cd",
            fill: false
        },
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Distribution of postcards related to the date'
        }
    }
};
var barChart = new Chart(ctx, config);
$("#filter-button").click(function () {
    //window.location.reload();
    const startYear = $("#startYear").val();
    //console.log(startYear);
    const endYear = $("#endYear").val();
    //console.log(startYear);
    if ((!isNaN(startYear) && !isNaN(endYear)) &&
        (startYear > 1800 && startYear < 2030) &&
        (endYear > 1800 && endYear < 2030)) {
        var filterData21 = imgfilter(data[0], startYear, endYear);
        filterData2 = makeMarkers(filterData21);
        filterData3 = makeMarkers(imgfilter(data[1], startYear, endYear));
        filterData4 = makeMarkers(imgfilter(data[2], startYear, endYear));
        filterData5 = makeMarkers(imgfilter(data[3], startYear, endYear));
        filterData6 = makeMarkers(imgfilter(data[4], startYear, endYear));
        filterData7 = makeMarkers(imgfilter(data[5], startYear, endYear));
        filterData8 = makeMarkers(imgfilter(data[6], startYear, endYear));
        var filterData91 = imgfilter(data[7], startYear, endYear);
        filterData9 = makeMarkers(filterData91);
        let postCardsDate = [];
        //console.log(filterData21)
        //console.log(filterData91[1].markers[0].properties)
        for (let i = 0; i < filterData91.length; i++) {
            for (let j = 0; j < filterData91[i].markers.length; j++) {
                postCardsDate.push(filterData91[i].markers[j].properties.date)
            }
        }
        const counts = {};
        postCardsDate.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

        filterKeys = Object.keys(counts);
        filterValues = Object.values(counts);
        //console.log(values);

        var dataChart = barChart.config.data;
        dataChart.datasets[0].data = filterValues;
        dataChart.labels = filterKeys;
        barChart.update();

        falg = 'on';
        if (map.getZoom() == 2) {
            map.removeLayer(markersLevel2);
            if (!map.hasLayer(filterData2)) {
                map.addLayer(filterData2);
            }
        }
        if (map.getZoom() == 3) {
            map.removeLayer(markersLevel3)
            if (!map.hasLayer(filterData3)) {
                map.addLayer(filterData3);
            }
        }
        if (map.getZoom() == 4) {
            map.removeLayer(markersLevel4)
            if (!map.hasLayer(filterData4)) {
                map.addLayer(filterData4);
            }
        }
        if (map.getZoom() == 5) {
            map.removeLayer(markersLevel5)
            if (!map.hasLayer(filterData5)) {
                map.addLayer(filterData5);
            }
        }
        if (map.getZoom() == 6) {
            map.removeLayer(markersLevel6)
            if (!map.hasLayer(filterData6)) {
                map.addLayer(filterData6);
            }
        }
        if (map.getZoom() == 7) {
            map.removeLayer(markersLevel7)
            if (!map.hasLayer(filterData7)) {
                map.addLayer(filterData7);
            }
        }
        if (map.getZoom() == 8) {
            map.removeLayer(markersLevel8)
            if (!map.hasLayer(filterData8)) {
                map.addLayer(filterData8);
            }
        }
        if (map.getZoom() == 9) {
            map.removeLayer(markersLevel9)
            if (!map.hasLayer(filterData9)) {
                map.addLayer(filterData9);
            }
        }
    } else {
        alert('The date must be a number between 1800-2030, \n please try again..');
    }


});
$("#all").click(function () {
    //window.location.reload(false);
    falg = 'off';
    var dataChart = barChart.config.data;
    dataChart.datasets[0].data = values;
    dataChart.labels = keys;
    barChart.update();

    if (map.getZoom() === 2) {
        if (map.hasLayer(filterData2)) {
            map.removeLayer(filterData2);
        }
        if (!map.hasLayer(markersLevel2)) {
            map.addLayer(markersLevel2);

        }
    }
    if (map.getZoom() == 3) {
        if (map.hasLayer(filterData3)) {
            map.removeLayer(filterData3);
        }
        if (!map.hasLayer(markersLevel3)) {
            map.addLayer(markersLevel3);

        }
    }
    if (map.getZoom() == 4) {
        if (map.hasLayer(filterData4)) {
            map.removeLayer(filterData4);
        }
        if (!map.hasLayer(markersLevel4)) {
            map.addLayer(markersLevel4);

        }
    }
    if (map.getZoom() == 5) {
        if (map.hasLayer(filterData5)) {
            map.removeLayer(filterData5);
        }
        if (!map.hasLayer(markersLevel5)) {
            map.addLayer(markersLevel5);

        }
    }
    if (map.getZoom() == 6) {
        if (map.hasLayer(filterData6)) {
            map.removeLayer(filterData6);
        }
        if (!map.hasLayer(markersLevel6)) {
            map.addLayer(markersLevel6);

        }
    }
    if (map.getZoom() == 7) {
        if (map.hasLayer(filterData7)) {
            map.removeLayer(filterData7);
        }
        if (!map.hasLayer(markersLevel7)) {
            map.addLayer(markersLevel7);

        }
    }
    if (map.getZoom() == 8) {
        if (map.hasLayer(filterData8)) {
            map.removeLayer(filterData8);
        }
        if (!map.hasLayer(markersLevel8)) {
            map.addLayer(markersLevel8);

        }
    }
    if (map.getZoom() == 9) {
        if (map.hasLayer(filterData9)) {
            map.removeLayer(filterData9);
        }
        if (!map.hasLayer(markersLevel9)) {
            map.addLayer(markersLevel9);

        }
    }
});

if (falg == 'off') {
    map.addLayer(markersLevel2)
} else {
    map.addLayer(filterData2)
}
map.on('zoom', function () {
    if (falg == 'on') {
        if (map.getZoom() == 2) {
            if (map.hasLayer(markersLevel2)) {
                map.removeLayer(markersLevel2);
            }

            if (!map.hasLayer(filterData2)) {
                map.addLayer(filterData2);
            }
        } else {
            map.removeLayer(filterData2);
        }
        if (map.getZoom() == 3) {
            if (map.hasLayer(markersLevel3)) {
                map.removeLayer(markersLevel3);
            }
            if (!map.hasLayer(filterData3)) {
                map.addLayer(filterData3);
            }
        } else {
            map.removeLayer(filterData3);
        }
        if (map.getZoom() == 4) {
            if (map.hasLayer(markersLevel4)) {
                map.removeLayer(markersLevel4);
            }
            if (!map.hasLayer(filterData4)) {
                map.addLayer(filterData4);
            }
        } else {
            map.removeLayer(filterData4);
        }
        if (map.getZoom() == 5) {
            if (map.hasLayer(markersLevel5)) {
                map.removeLayer(markersLevel5);
            }
            if (!map.hasLayer(filterData5)) {
                map.addLayer(filterData5);
            }
        } else {
            map.removeLayer(filterData5);
        }
        if (map.getZoom() == 6) {
            if (map.hasLayer(markersLevel6)) {
                map.removeLayer(markersLevel6);
            }
            if (!map.hasLayer(filterData6)) {
                map.addLayer(filterData6);
            }
        } else {
            map.removeLayer(filterData6);
        }
        if (map.getZoom() == 7) {
            if (map.hasLayer(markersLevel7)) {
                map.removeLayer(markersLevel7);
            }
            if (!map.hasLayer(filterData7)) {
                map.addLayer(filterData7);
            }
        } else {
            map.removeLayer(filterData7);
        }
        if (map.getZoom() == 8) {
            if (map.hasLayer(markersLevel8)) {
                map.removeLayer(markersLevel8);
            }
            if (!map.hasLayer(filterData8)) {
                map.addLayer(filterData8);
            }
        } else {
            map.removeLayer(filterData8);
        }
        if (map.getZoom() == 9) {
            if (map.hasLayer(markersLevel9)) {
                map.removeLayer(markersLevel9);
            }
            if (!map.hasLayer(filterData9)) {
                map.addLayer(filterData9);
            }
        } else {
            map.removeLayer(filterData9);
        }
    } else {
        if (map.getZoom() === 2) {
            map.addLayer(markersLevel2);
        } else {
            map.removeLayer(markersLevel2);
            if (map.hasLayer(filterData2)) {
                map.removeLayer(filterData2);
            }
        }
        if (map.getZoom() === 3) {
            map.addLayer(markersLevel3);
        } else {
            map.removeLayer(markersLevel3);
            if (map.hasLayer(filterData3)) {
                map.removeLayer(filterData3);
            }
        }
        if (map.getZoom() === 4) {
            map.addLayer(markersLevel4);
        } else {
            map.removeLayer(markersLevel4);
            if (map.hasLayer(filterData4)) {
                map.removeLayer(filterData4);
            }
        }
        if (map.getZoom() === 5) {
            map.addLayer(markersLevel5);
        } else {
            map.removeLayer(markersLevel5);
            if (map.hasLayer(filterData5)) {
                map.removeLayer(filterData5);
            }
        }
        if (map.getZoom() === 6) {
            map.addLayer(markersLevel6);
        } else {
            map.removeLayer(markersLevel6);
            if (map.hasLayer(filterData6)) {
                map.removeLayer(filterData6);
            }
        }
        if (map.getZoom() === 7) {
            map.addLayer(markersLevel7);
        } else {
            map.removeLayer(markersLevel7);
            if (map.hasLayer(filterData7)) {
                map.removeLayer(filterData7);
            }
        }
        if (map.getZoom() === 8) {
            map.addLayer(markersLevel8);
        } else {
            map.removeLayer(markersLevel8);
            if (map.hasLayer(filterData8)) {
                map.removeLayer(filterData8);
            }
        }
        if (map.getZoom() === 9) {
            map.addLayer(markersLevel9);
        } else {
            map.removeLayer(markersLevel9);
            if (map.hasLayer(filterData9)) {
                map.removeLayer(filterData9);
            }
        }
    }
});

