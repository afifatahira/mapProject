var map;

var userName = 'Tom';   //Default user attributes
var userRadius = 300;
var userLat = 23.752805;
var userLng = 90.375433;

var user = new google.maps.LatLng(userLat, userLng);

var placeType = ['school'];     //Default place type

var info;       //Information window for every markers
var userMarker;     //Marker for user
var markers = [];   //Marker for the places

var allUsers = [];  //User Data

function userData(users)
{
    allUsers = users;
}

var placeRequest = {
        location: user,
        radius: userRadius,
        types: placeType
    };

var placeService;

function initialize()   //Initialize map settings
{
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: user,
        zoom: 15
    });

    info = new google.maps.InfoWindow();
    userMarker = new google.maps.Marker();
    
    setUser();
    doNearbySearch();    
}

function setUser()
{
    user = new google.maps.LatLng(userLat, userLng);
    map.panTo(user);
    createUserMarker();
}

function doNearbySearch()
{
    placeRequest = {
        location: user,
        radius: userRadius,
        types: placeType
    };
    
    placeService = new google.maps.places.PlacesService(map);
    placeService.nearbySearch(placeRequest, callback);
}

function callback(results, status) 
{ 
    if (status == google.maps.places.PlacesServiceStatus.OK) 
    {  
        for (var i = 0; i < results.length; i++) 
        {            
            if(i == 5)  break;  //To show only 5 available places
            
            markers[i] = new google.maps.Marker({
                map: map,
                position: results[i].geometry.location,
                title: results[i].name
            });

            google.maps.event.addListener(markers[i], 'click', function() {
                info.setContent(this.title);
                info.open(map, this);
            });
        }
    }
}

function createUserMarker() 
{
    info.setMap(null);  //Clear previous info window if any
    userMarker.setMap(null);    //Clear previous user marker if any

    userMarker = new google.maps.Marker({
      map: map,
      position: user,
      icon: 'images/man.png'
    });

    google.maps.event.addListener(userMarker, 'click', function() {
        map.panTo(user);
        info.setContent(userName);
        info.open(map, this);
    });
}

function clearPlaceMarkers() 
{    
    for (var i = 0; i < markers.length; i++) 
    {
      markers[i].setMap(null);
    }
    markers = [];
}

function getSelectedType()
{
    var index  = document.getElementById('place-type').selectedIndex;   //Fetch selected place type from dropdown menu
    var selectedType = document.getElementById('place-type').options[index].value;
    
    changeType(selectedType);
}

function setSelectedType(type)
{
    if(validType(type))
    {
        document.getElementById('place-type').value = type; //Set the dropdown menu according to voice command
        changeType(type);
    }
}

function changeType(newType)
{
    placeType[0] = newType.toLowerCase();   //Update place type
    clearPlaceMarkers();    //Clear previously placed markers
    doNearbySearch();   //Find new places for changed type
}

function getSelectedUser()
{
    var index  = document.getElementById('user').selectedIndex; //Fetch selected user from dropdown menu
    var selectedName = document.getElementById('user').options[index].value;
    
    changeUser(selectedName);
}

function setSelectedUser(name)
{
    if(validName(name))
    {
        document.getElementById('user').value = name;   //Set the dropdown menu according to voice command
        changeUser(name);
    }
}

function changeUser(newName)
{
    updateUser(newName);
    clearPlaceMarkers();
    setUser();
    doNearbySearch();
}

function updateUser(name)
{
    userName = name;
    
    //Find location and radius for new user from given data
    for(var i = 0; i<allUsers.length; i++)
    {
        if(allUsers[i].username == userName)
        {
            userRadius = allUsers[i].radius;
            userLat = allUsers[i].current_latitude;
            userLng = allUsers[i].current_longitude;
            break;
        }
    }
}

function validName(name)
{
    for(var i = 0; i<allUsers.length; i++)
    {
        if(allUsers[i].username == name)
        {
            return true;
        }
    }   
    return false;
}

function validType(type)
{
    if(type == "School" || type == "Hospital" || type == "Restaurant" || type == "Bank")
    {
        return true;
    }
    return false;
}

document.getElementById('place-type').addEventListener('change', getSelectedType);
document.getElementById('user-selection').addEventListener('change', getSelectedUser);

google.maps.event.addDomListener(window, 'load', initialize);

window.onresize = resize;

function resize()   //Center map to user if window is resized
{
    map.panTo(user);
}