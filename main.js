window.onload = main;
var openFiles = [{"name": "Hello", "id": getRandomID()}, {"name": "Hey", "id": getRandomID()}, {"name": "Gay", "id": getRandomID()}];
var activeFile = openFiles[0].id;
var draggingTab = false;

function main(){

    document.getElementById("tabbar").addEventListener("wheel", function(e){
        this.scrollBy(e.deltaY, 0);
    });

    document.getElementById("tabbar").addEventListener("mousemove", function(e){
        if(draggingTab){
            
        }
    });

    displayTabs();

}

function addNewTab(){

    var rID = getRandomID();
    openFiles.push({"name": "Untitled", "id": rID});
    activeFile = rID;
    displayTabs();

}

function selectTab(documentID){

    activeFile = documentID;
    displayTabs();

}

function removeTab(documentID){

    var fileIndex, activeIndex;

    for(var i = 0;i < openFiles.length;i++){
        if(openFiles[i].id == documentID){
            fileIndex = i;
        }
        if(openFiles[i].id == activeFile){
            activeIndex = i;
        }
    }

    openFiles.splice(fileIndex, 1);

    if(activeIndex != fileIndex){
        if(activeIndex > fileIndex){
            activeFile = openFiles[activeIndex - 1].id;
        }
    }else{
        if((openFiles.length == fileIndex) && (fileIndex != 0)){
            activeFile = openFiles[fileIndex - 1].id;
        }else if(openFiles.length != 0){
            activeFile = openFiles[fileIndex].id;
        }else{
            activeFile = null;
        }
    }

    displayTabs();

}

function displayTabs(){

    document.getElementById("tabbar").innerHTML = "";

    for(var i = 0;i < openFiles.length;i++){

        var tab = document.createElement("div");
        tab.className = "tab";
        if(openFiles[i].id == activeFile){
            tab.style.backgroundColor = "#606060";
        }
        tab.style.left = String(i * 202) + "px";
        tab.innerText = openFiles[i].name;
        tab.documentID = openFiles[i].id;
        tab.addEventListener("click", function(e){
            selectTab(this.documentID);
        });
        tab.addEventListener("click", function(e){
            draggingTab = this.documentID;
        });
        document.getElementById("tabbar").appendChild(tab);

        var removeButton = document.createElement("div");
        removeButton.className = "removeButton";
        removeButton.innerText = "✕";
        removeButton.addEventListener("click", function(e){
            e.stopPropagation();
            removeTab(this.parentElement.documentID);
        });
        tab.appendChild(removeButton);

    }

    var addTab = document.createElement("div");
    addTab.id = "addTab";
    addTab.innerText = "+";
    addTab.style.left = String(202 * openFiles.length - 2) + "px";
    addTab.addEventListener("click", addNewTab);
    document.getElementById("tabbar").appendChild(addTab);

}

function getRandomID(){return String((new Date()).getTime()) + String(Math.floor(Math.random()*100000000000000000));}