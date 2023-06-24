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
      fetch(this.ip + "/YamahaRemoteControl/ctrl", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: body,
      });
    };
    this.volume = -300;

    this.setMediaCenter = () => {
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV5</Input_Sel></Input></Main_Zone></YAMAHA_AV>'
      );
    };

    this.setAppleTV = () => {
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>AV4</Input_Sel></Input></Main_Zone></YAMAHA_AV>'
      );
    };

    this.volumeUp = () => {
      var new_volume = this.volume + 5;
      this.volume += 5;
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Lvl><Val>' +
          new_volume.toString() +
          "</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>"
      );
    };

    this.volumeDown = () => {
      var new_volume = this.volume - 5;
      this.volume -= 5;
      this.APICall(
        '<YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Lvl><Val>' +
          new_volume.toString() +
          "</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>"
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
