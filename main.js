window.onload = main;

var files = [new VFile("Hello"), new VFolder("neil breen", [new VFile("jay"), new VFolder("biggay", [new VFile("rich")])]), new VFile("Gay"), new VFile("suck")];

function VFile(name){

    this.name = name;
    this.type = 1;

}

function VFolder(name, subs){

    this.name = name;
    this.type = 0;
    this.subs = subs;

}

function displaySubFolders(folders, parentElement){

    for(var i = 0;i < folders.length;i++){

        var label = document.createElement("div");
        label.className = "label";
        label.innerText = folders[i].name;
        parentElement.appendChild(label);
        if(!folders[i].type){
            //label.style.backgroundColor = "blue";
            var subfoldercontainer = document.createElement("div");
            subfoldercontainer.className = "subLabelContainer";
            parentElement.appendChild(subfoldercontainer);
            label.innerText = "> " + folders[i].name;
            label.addEventListener("click", function(e){
                if(subfoldercontainer.style.display == "block"){
                    subfoldercontainer.style.display = "none";
                    this.innerText = "> " + this.innerText.substring(2);
                }else{
                    subfoldercontainer.style.display = "block";
                    this.innerText = "v " + this.innerText.substring(2);
                }
            });
            displaySubFolders(folders[i].subs, subfoldercontainer);
        }

    }

}

function main(){

    displaySubFolders(files, document.getElementById("treeBrowserContainer"));

}