window.onload = function(){tastyCodeFileSystem = new TastyCodeFileSystem(main)};
var tastyCodeFileSystem;

function main(){

    

}

class TastyCodeFileSystem{

    constructor(callback){

        var dbrequest = indexedDB.open("TastyCodeDatabase");
        var tastyCodeFileSystemObjectReference = this;
    
        dbrequest.onupgradeneeded = function(e){

            tastyCodeFileSystemObjectReference.db = e.target.result;
            tastyCodeFileSystemObjectReference.db.createObjectStore("files", {"keyPath": "uuid"});
            tastyCodeFileSystemObjectReference.db.createObjectStore("projects", {"keyPath": "uuid"});
    
        }

        dbrequest.onsuccess = function(e){

            tastyCodeFileSystemObjectReference.db = e.target.result;
            callback();
    
        }

    }
    
    addProject(project){
        project.modifiedDate = Date.now();
        this.db.transaction("projects", "readwrite").objectStore("projects").put(project);
    }

    getProject(uuid, callback){
        this.db.transaction("projects", "readwrite").objectStore("projects").get(uuid).onsuccess = function(e){
            callback(e.target.result);
        }
    }

    updateProject(uuid, callback){
        var tastyCodeFileSystemObjectReference = this;
        this.getProject(uuid, function(project){
            callback(project);
            tastyCodeFileSystemObjectReference.addProject(project);
        });
    }

    deleteProject(uuid){
        var tastyCodeFileSystemObjectReference = this;
        this.getProject(uuid, function(project){
            project.files.forEach(function(fileUUID){
                tastyCodeFileSystemObjectReference.deleteFile(fileUUID);
            });
        });
        this.db.transaction("projects", "readwrite").objectStore("projects").delete(uuid);
    }

    addFile(file){
        var tastyCodeFileSystemObjectReference = this;
        file.modifiedDate = Date.now();
        this.db.transaction("files", "readwrite").objectStore("files").put(file);
        if(file.project != ""){
            this.getProject(file.project, function(project){
                if(project != undefined){
                    project.modifiedDate = file.modifiedDate;
                    tastyCodeFileSystemObjectReference.db.transaction("projects", "readwrite").objectStore("projects").put(project);
                }
            });
        }
    }

    getFile(uuid, callback){
        this.db.transaction("files", "readwrite").objectStore("files").get(uuid).onsuccess = function(e){
            callback(e.target.result);
        }
    }

    updateFile(uuid, callback){
        var tastyCodeFileSystemObjectReference = this;
        this.getFile(uuid, function(file){
            callback(file);
            tastyCodeFileSystemObjectReference.addFile(file);
        });
    }

    deleteFile(uuid){
        var tastyCodeFileSystemObjectReference = this;
        this.getFile(uuid, function(file){
            if(file.project != ""){
                tastyCodeFileSystemObjectReference.getProject(file.project, function(project){
                    if(project != undefined){
                        project.modifiedDate = Date.now();
                        tastyCodeFileSystemObjectReference.db.transaction("projects", "readwrite").objectStore("projects").put(project);
                    }
                });
            }
            tastyCodeFileSystemObjectReference.db.transaction("files", "readwrite").objectStore("files").delete(uuid);
        });
    }

    close(){
        this.db.close();
    }

}

class TastyCodeFileSystemFile{

    constructor(title, data, project = ""){
        this.title = title;
        this.data = data;
        this.project = project;
        this.uuid = UUID.createUUID();
        this.creationDate = Date.now();
        this.modifiedDate = Date.now();
    }

    setProject(uuid){
        this.project = uuid;
    }

}

class TastCodeFileSystemProject{

    constructor(title, files = []){
        this.title = title;
        this.files = files;
        this.uuid = UUID.createUUID();
        this.creationDate = Date.now();
        this.modifiedDate = Date.now();
    }

    addFile(file){
        this.modifiedDate = Date.now();
        if(typeof(file) == "string"){
            this.files.push(file);
        }else{
            file.setProject(this.uuid);
            this.files.push(file.uuid);
        }
    }

    removeFile(uuid){
        this.modifiedDate = Date.now();
        this.files = this.files.filter(function(fileUUID){
            return uuid != fileUUID;
        });
    }

}

class UUID{

    static createUUID(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}