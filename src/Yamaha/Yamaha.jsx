/* 
For XML reference and to extend, see
https://github.com/christianfl/av-receiver-docs
https://www.openhab.org/addons/bindings/yamahareceiver/ 
https://github.com/BirdAPI/yamaha-network-receivers/blob/master/yamaha_xml.py

*/

class Yamaha {
  constructor(ip) {
    this.ready = false;
    this.ip = ip;
    this.lastVolumeChange = new Date().getTime();

    this.APICall = (body, callback) => {
      fetch(
        "http://10.0.0.71:8080/http://10.0.0.68:80/YamahaRemoteControl/ctrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: body,
        }
      )
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          if (callback) {
            callback(data);
          }
        });
    };

    this.setMediaCenter = () => {
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV5</Input_Sel></Input></Main_Zone></YAMAHA_AV>'
      );
    };

    this.getVolume = () => {
      return this.APICall(
        '<YAMAHA_AV cmd="GET"><Main_Zone><Volume><Lvl>GetParam</Lvl></Volume></Main_Zone></YAMAHA_AV>',
        (text) => {
          text = text.replace(/<[^>]*>/g, "");
          text = text.replace("1dB", "");
          return text;
        }
      );
    };

    this.setAppleTV = () => {
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV4</Input_Sel></Input></Main_Zone></YAMAHA_AV>'
      );
    };

    this.volumeUp = () => {
      this.APICall(
        '<YAMAHA_AV cmd="GET"><Main_Zone><Volume><Lvl>GetParam</Lvl></Volume></Main_Zone></YAMAHA_AV>',
        (text) => {
          text = text.replace(/<[^>]*>/g, "");
          text = text.replace("1dB", "");
          var newVolume = parseInt(text) + 5;
          this.APICall(
            '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Lvl><Val>' +
              newVolume.toString() +
              "</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>"
          );
        }
      );
    };

    this.volumeDown = () => {
      this.APICall(
        '<YAMAHA_AV cmd="GET"><Main_Zone><Volume><Lvl>GetParam</Lvl></Volume></Main_Zone></YAMAHA_AV>',
        (text) => {
          text = text.replace(/<[^>]*>/g, "");
          text = text.replace("1dB", "");
          var newVolume = parseInt(text) - 5;
          this.APICall(
            '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Lvl><Val>' +
              newVolume.toString() +
              "</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>"
          );
        }
      );
    };

    this.powerOn = () => {
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>On</Power></Power_Control></Main_Zone></YAMAHA_AV>'
      );
    };
  }
}

export { Yamaha };
