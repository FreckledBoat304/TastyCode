window.onload = main;
var openFiles = [{"name": "index.html", "id": getRandomID()}, {"name": "main.css", "id": getRandomID()}, {"name": "main.js", "id": getRandomID()}];
var activeFile = openFiles[0].id;
var draggingTab = false;

function main(){

    document.getElementById("tabbar").addEventListener("wheel", function(e){
        this.scrollBy(e.deltaY, 0);
    });

    window.addEventListener("mousemove", function(e){
        if(draggingTab){
            var relativeX = e.x - (window.innerWidth * .2) + document.getElementById("tabbar").scrollLeft;
            var tabX = Math.round(relativeX/204)*202 - 2;
            if(tabX < 0) tabX = 0;
            if(tabX > (document.getElementById("tabbar").getElementsByClassName("tab").length*202)) tabX = (document.getElementById("tabbar").getElementsByClassName("tab").length*202) - 2;
            document.getElementById("tabMarker").style.left = tabX + "px";
        }
    });

    window.addEventListener("mouseup", function(e){
        if(draggingTab){
            var relativeX = e.x - (window.innerWidth * .2) + document.getElementById("tabbar").scrollLeft;
            var tabX = Math.round(relativeX/204)*202 - 2;
            if(tabX < 0) tabX = 0;
            if(tabX > (document.getElementById("tabbar").getElementsByClassName("tab").length*202)) tabX = (document.getElementById("tabbar").getElementsByClassName("tab").length*202) - 2;
            var index, currentIndex;
            for(var i = 0;i < openFiles.length;i++){
                if(openFiles[i].id == draggingTab){
                    currentIndex = i;
                    break;
                }
            }
            if(tabX == 0){
                index = 0;
            }else{
                index = Math.round(tabX/202);
                if(currentIndex < index) index -= 1;
            }
            if(currentIndex != index){
                var oldTabs = [];
                for(var i = 0;i < openFiles.length;i++){
                    if(i != currentIndex){
                        oldTabs.push(openFiles[i]);
                    }
                }
                var newOpenFiles = oldTabs.slice(0, index);
                newOpenFiles.push(openFiles[currentIndex]);
                newOpenFiles.concat(oldTabs.slice(index));
                openFiles = newOpenFiles;
                activeTab = draggingTab;
                displayTabs();
            }
            draggingTab = false;
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
        tab.addEventListener("mousedown", function(e){
            draggingTab = this.documentID;
            document.getElementById("tabMarker").style.display = "block";
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

    var tabMarker = document.createElement("div");
    tabMarker.id = "tabMarker";
    document.getElementById("tabbar").appendChild(tabMarker);

}

function getRandomID(){return String((new Date()).getTime()) + String(Math.floor(Math.random()*100000000000000000));}