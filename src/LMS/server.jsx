import $ from "jquery";

class LMS {

    request(params, callback) {
        
        var form_data = { 
            'id' :1,
            'method' : 'slim.request',
            'params' : params,
            }
        $.post({
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            
            async: true,
            url: '/jsonrpc.js',
            data: JSON.stringify(form_data),
            dataType: 'json',
            success : (r) => {if (callback) { callback(r) } },
            
        });
    
    }

    getTrack(trackID) {
        return '/music/' + trackID.toString() +'/download/.flac';
    }
}

export { LMS }