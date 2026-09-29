var startingRoom; // = "001 Atrium"
if (location.hash) {
    startingRoom = decodeURIComponent(location.hash.split("#")[1].replace(/\+/g, " "));

}
console.log(startingRoom)
var sceneEl;
var rooms;
var points;
var plants = [];
var aplantID;
var cursorPosition;
$(function () {
    var cursor = document.querySelector('[cursor]');
    cursor.addEventListener('mouseleave', mouseleave);
    getData(0).then((data) => {
        rooms = data;


        getData(2007684424).then((data) => {
            points = data;
            loadPlants(points)
            loadSphere(startingRoom, 200);
            nextFind(true,true)
        })




    })

    sceneEl = document.querySelector('a-scene');
});


function loadPlants(points) {
    var pointID = 0;
    points.filter(point => point.type == "info").forEach((point) => {
        point.id = pointID;
        plants.push({
            area: point.area,
            label: point.label,

        })
        pointID++;


    })


}



function getCursorPosition() {
    var cursor = document.querySelector('[cursor]');
    var intersectedEl = document.querySelector('a-sky');
    //if (!cursor.components.intersectedEl) { return; }
    var intersection = cursor.components.raycaster.getIntersection(intersectedEl);
    var intersectionPosition = intersection.point;
    return `${intersectionPosition.x} ${intersectionPosition.y} ${intersectionPosition.z}`

}

function leftPad(num) {
    return ("0" + num).slice(-2)
}

function nextFind(isNewFind,isHunted) { 
 
    missing = plants.filter(plant => !plant["found"])

    var hud2 = `${missing.length} plants left to find`;
    if (isHunted) {
        aplantID = Math.floor(Math.random() * missing.length)


    }
    var aplant = missing[aplantID]
    if (missing.length && isHunted) {

        var many = ""
        var plantsOfSameType = plants.filter(plant => aplant.label == plant.label);
        var sameLeft = plantsOfSameType.filter(plant => plant["found"]).length;
        if (plantsOfSameType.length - 1) {

            many = `(${plantsOfSameType.length- sameLeft} of ${plantsOfSameType.length})`

        }


        var hud1 = `Find the ${aplant.label} ${many} somewhere in ${aplant.area.replace(/\d\d\d/g,"")}`;

    } else if(!missing.length) {

        var hud1 = `You Found All of the Plants!`;
        var hud2 = `Congratulations`;

    }

    $("#hudText")[0].setAttribute("text", {
        value: hud1,
        color: "red",
        align: "center",
        width: 1
    })
    $("#hudText2")[0].setAttribute("text", {
        value: hud2,
        color: "red",
        align: "center",
        width: 1
    })
}



function loadSphere(room, rotation) {

    console.log(room)
    if (!room) room = rooms[0].area
    console.log(room)
    var infoimage = false;
    window.location.hash = `#${room.replace(/ /g,"+")}`;
    var roomData = rooms.find((item) => item.area == room)
    var pointsData = points.filter(item => item.area == room)
    console.log(pointsData)
    $('.marker').remove();
    $('.preview').remove();




    $("#sky1").attr("src", `img/${roomData.image}`);
    document.getElementById("sky1").setAttribute('rotation', {
        x: 0,
        y: rotation,
        z: 0
    });



    document.getElementById("markers").setAttribute('rotation', {
        x: 0,
        y: rotation,
        z: 0
    });

    pointsData.forEach(function (val) {

        makeMarker(val);
    });

    $(".marker").on("click", function (evt) {
        if ($(evt.target).data("type") == "scene") {
            loadSphere($(evt.target).data("label"), $(evt.target).data("rotation") || 0);
        }
    });


    $(".marker").on("fusing", function (evt) {
        var target = $(evt.target)
        var type = target.data("type")
        var direction = "";

        if (target.data("type") == "scene") {
            direction = `(${target.data("direction")})`;
            var smartText = sceneEl.querySelector('#smartText');
            $("#smartText")[0].setAttribute("text", {
                value: `${target.data("label").replace(/\d\d\d/g,"")} ${direction}`,
                color: "red",
                align: "center",
                width: 1
            }) // + "; align: center; color: red");
            smartText.emit('textShow')

        }



        if (type == "info") {

            $('.marker, #cursor, #textHolder').attr("opacity", 0);
            var foundPlant = plants.find((plant) => plant.id == target.data("plantID"))
            var aplant = plants[aplantID]
            var isNewFind =  !foundPlant.found;
            foundPlant.found = true;

            nextFind(isNewFind,foundPlant.length)
            $("#slideWindow").append("<a-image id='slide' height='40' width='60' position = '-1.3 0 -30' src='img/ppt/" + target.data("slide").replace(/ /g, "_") + ".png'></a-image>");

        }




    });

    //$('#cursor').on('mouseleave', mouseleave);







    function makeMarker(mkr) {
        console.log(mkr)
        var spin = Math.atan2(mkr.x, mkr.y) * (180 / Math.PI) + 180;
        var marker = document.createElement('a-sphere');
        [x, y, z] = mkr.position.split(" ");
        console.log(x, y, z)
        var scale = 100
        marker.setAttribute('position', {
            x: x / scale,
            y: y / scale,
            z: z / scale
        });

        for (var key in mkr) {
            console.log(key)
            marker.setAttribute('data-' + key, mkr[key])
        }
        //marker.setAttribute('src',  "nextMarker.png")sc
        marker.setAttribute('radius', 10 / scale)
        marker.setAttribute('color', mkr.color)
        marker.setAttribute('data-id', mkr.id)
        marker.setAttribute("cursor-listener")

        //marker.setAttribute("id", "marker" + id)
        marker.setAttribute('data-image', mkr.slide);
        //marker.setAttribute('data-room', mkr.room || "");
        marker.setAttribute("class", "marker")
        $("#markers").prepend(marker)
    }
}

function mouseleave(event) {
    //$("#smartText").attr("text", "");
    // $("#smartText").attr("scale","0 0 0")
    var smartText = sceneEl.querySelector('#smartText');
    smartText.emit('textHide')

    $('.marker, #cursor, #textHolder').attr("opacity", 1);
    $('#slide').remove()


}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

window.addEventListener("wheel", event => {
    const delta = Math.sign(event.wheelDelta) * .4;

    var mycam = document.getElementById('cam').getAttribute('camera');
    var finalZoom = document.getElementById('cam').getAttribute('camera').zoom + delta;

    if (finalZoom < 1)
        finalZoom = 1;
    if (finalZoom > 5)
        finalZoom = 5;

    mycam.zoom = finalZoom;
    //setting the camera element
    document.getElementById('cam').setAttribute('camera', mycam);
});


document.addEventListener('keypress', logKey);

function logKey(e) {
    copyToClipboard(getCursorPosition());
}