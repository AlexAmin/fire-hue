const v3 = require('node-hue-api').v3;

module.exports = async function connectHue(HUE_USERNAME, HUE_BASE_STATION_NAME, HUE_BASE_STATION_IP_ADDRESS){
    if(HUE_BASE_STATION_IP_ADDRESS){
        console.log(`Connecting to Hue base station at ${HUE_BASE_STATION_IP_ADDRESS}`);
        return v3.api.createLocal(hueBaseStation.ipaddress).connect(HUE_USERNAME);
    }
    let searchResults = await v3.discovery.nupnpSearch();
    if(searchResults.length === 0){
        throw new Error("No Hue base stations were found on the network");
    }
    if(searchResults.length > 1 && !HUE_BASE_STATION_NAME){
        //If there is more than one base station on the network and no name has been supplied, throw an error
        //Log the found base stations to make it easier to find the name
        console.warn("Found base stations", searchResults);
        throw new Error("More than one Hue base station was found. Please supply a HUE_BASE_STATION_NAME parameter to the application to select a station");
    }
    if(searchResults.length > 1){
        //More than one base station was found and a name was provided
        //Filter the found base stations to find the one we're looking for
        const filteredSearchResults = searchResults.filter( result => result.name === HUE_BASE_STATION_NAME);
        if(filteredSearchResults.length === 0){
            //None of the found base stations match the name we are looking for
            //Log the found base stations to make it easier to correct the name
            console.warn("Found base stations", searchResults);
            throw new Error(`No base station with the name ${HUE_BASE_STATION_NAME} was found`)
        }
        //The base station we are looking for was found, update the searchResults variable
        searchResults = filteredSearchResults;
    }
    //There is only one base station in the array at this point
    const hueBaseStation = searchResults[0];

    if(HUE_BASE_STATION_NAME && hueBaseStation.name !== HUE_BASE_STATION_NAME){
        //If only one station was found, we need to check one last time if the station is the correct one
        throw new Error(`Only one base station was found and its name does not match the requested name (${hueBaseStation.name} !== ${HUE_BASE_STATION_NAME})`)
    }

    console.log(`Connecting to Hue base station ${hueBaseStation.name} (${hueBaseStation.ipaddress})`);
    //Connect using node-hue-api and the supplied HUE_USERNAME
    return v3.api.createLocal(hueBaseStation.ipaddress).connect(HUE_USERNAME);
}
