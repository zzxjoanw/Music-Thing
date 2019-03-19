//a single note
const note = function(abcNote) {
    this.note = 0;
    this.octave = 0;
    this.length = 0; 
}

//check if the tune has [ or ], representing simultaneous notes. i don't want to deal with that
const hasBrackets = function(tuneJSON) {
    	return false;
}

const displayInfo = function(name) {
    document.getElementById("title").innerText = name;
}

const displayNotes = function(notesObjArray) {
    var noteDiv, headDiv, headText, tailDiv, color, defaultWidth = 50, downShift;
    for(var i=0; i<notesObjArray.length; i++) {
        downShift = 0;
        switch(notesObjArray[i].octave) { //4 is highest
            case 1: color = "red";
                    downShift += 280*3;
                break;
            case 2: color = "green";
                    downShift += 280*2;
                break;
            case 3: color = "blue";
                    downShift += 280;
                break;
            case 4: color = "purple";
                break;
        }

        switch(notesObjArray[i].note) { //c is lowest
            case "c":
            case "C": downShift += 210;
                break;
            case "d":
            case "D": downShift += 175;
                break;
            case "e":
            case "E": downShift += 140;
                break;
            case "f":
            case "F": downShift += 105;
                break;
            case "g":
            case "G": downShift += 70;
                break;
            case "a":
            case "A": downShift += 35;
                break;
            case "b":
            case "B": downShift += 0;
                break;
        }

        noteDiv = document.createElement("span");
        noteDiv.setAttribute("class",`note ${color}`);
        noteDiv.style.position = "relative";
        noteDiv.style.top = downShift;

        headDiv = document.createElement("div");
        headDiv.setAttribute("class","head");
        headText = document.createTextNode(notesObjArray[i].note);
        headDiv.appendChild(headText);

        tailDiv = document.createElement("div");
        tailDiv.setAttribute("class","tail");
        tailDiv.style.width = 400 * notesObjArray[i].length;

        noteDiv.appendChild(headDiv);
        noteDiv.appendChild(tailDiv);

        document.getElementById("tune-section").appendChild(noteDiv);
    }
}
 
const parseTune = function(tuneJSON) {
    var regex = /[A-Ga-g][',]?\d?/g;
    var noteArray = tuneJSON.match(regex);
    var noteObjArray = [];
    var basicNoteLength = 0.25;

    console.log(noteArray);

    for(var i=0; i<noteArray.length; i++) {
        let current = new note();
        current.note = noteArray[i][0];

        if(/[A-G]{1}[,]{1}/.test(noteArray[i])) { //A-G,
            current.octave = 1;
        }
        else if(/[a-g]{1}[']{1}/.test(noteArray[i])) { //a-g'
            current.octave = 4;
        }
        else if(/[A-G]{1}/.test(noteArray[i])) { //A-G
            current.octave = 2;
        }
        else if(/[a-g]{1}/.test(noteArray[i])) { //a-g
            current.octave = 3;
        }

        if(/[/]{1}[\d]{1,2}/.test(noteArray[i])) { //slash followed by number - divide bnl by number
            current.length = basicNoteLength/parseInt(noteArray[i].substr(1,noteArray[i].length-1));
        }
        else if(/[/]{1}/.test(noteArray[i])) { //just a slash - half bnl
            current.length = basicNoteLength/2;
        }
        else if(/[\d]{1,2}/.test(noteArray[i])) { //just a number
            current.length = basicNoteLength*parseInt(noteArray[i].match(/[\d]/)[0]);
        }
        else { //no modifier
            current.length = basicNoteLength;
        }

        noteObjArray.push(current);
    }

    console.log(noteObjArray);
    displayNotes(noteObjArray);
}

const getTune = function() {
    var r = Math.floor(Math.random()*17794);
    var url = "https://thesession.org/tunes/1?format=json";
    var goodTune = false;

    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(responseJson) {
        console.log(responseJson);
        parseTune(responseJson.settings[0].abc);
        displayInfo(responseJson.name); 
    });
}

var tuneJSON = getTune();
