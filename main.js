window.onload = main;

function main(){

    var dbReq = window.indexedDB.open("TastyCodeDBDemo", 1);
    var db;

    dbReq.onsuccess = function(e){

        db = dbReq.result;
        filesTransaction = db.transaction("files", "readwrite");

        filesTransaction.onerror = function(e){

            console.log("it got fucked");

        }

        filesTransaction.onsuccess = function(e){

            console.log("it worked");

        }

        fileStore = filesTransaction.objectStore("files");
        writeRequest = fileStore.add({"fileID": "asdfasd", "data": "gay"});
        writeRequest.onsuccess = function(e){

            console.log("the addition worked");
            db.close();

        }

        writeRequest.onerror = function(e){

            console.log("the addition failed");

        }

    }

    dbReq.onerror = function(e){

        console.log("gtfo");

    }

    dbReq.onupgradeneeded = function(e){

        db = e.target.result;
        db.createObjectStore("files", {"keyPath": "fileID"});
        db.createObjectStore("projects", {"keyPath": "projectID"});

    }

}