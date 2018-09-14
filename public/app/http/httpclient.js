var HttpClient = (function(){

    var response = function(xmlHttp, success, error) {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (typeof success === "function") {
                success(xmlHttp.responseText);
            }
        }else if(typeof error === "function" && (xmlHttp.status > 299 || xmlHttp.status < 200)){
            error(xmlHttp.responseText);    
        }
    }
    
    var get = function(url, success, error){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
        xmlHttp.onreadystatechange = function(){
            response(xmlHttp, success, error);
        }
    }

    var post = function(url, data, success, error){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var par = (data) ? JSON.stringify(data) : "";
        xmlHttp.send(par);
        xmlHttp.onreadystatechange = function(){
            response(xmlHttp, success, error);
        }
    }

    return {
        get: get,
        post: post
    };
})();

