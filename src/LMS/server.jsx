import '@capacitor-community/http';
import $ from "jquery";

class LMS {

    constructor(IP){
        this.IP = IP;
        this.request(["",["listen", "1"]]);
    }

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
            success : () => {if (callback) { console.log(form_data); callback(form_data) } },
            
        }).done( (r) => console.log(r ));
    
    }

    albumArtwork(trackID) {
        if (trackID) {
            return this.IP+'/music/'+trackID.toString()+'/cover.jpg'
        }
        return '';

    }

    getTrack(trackID) {
        return this.IP+ '/music/' + trackID.toString() +'/download/.flac';
    }
}

export { LMS }