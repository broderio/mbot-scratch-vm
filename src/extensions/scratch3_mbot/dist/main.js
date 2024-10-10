var MBotAPI;(()=>{"use strict";var e={d:(t,s)=>{for(var n in s)e.o(s,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:s[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{MBot:()=>r,config:()=>n});class s{constructor(e=null,t=null,s=null,n=null){this.data=e,this.channel=t,this.dtype=s,this.rtype=n}encode(){let e="invalid";99===this.rtype?e="init":1===this.rtype?e="publish":0===this.rtype?e="request":2===this.rtype?e="response":3===this.rtype?e="subscribe":4===this.rtype?e="unsubscribe":-98===this.rtype&&(e="error");let t={type:e};return null!==this.channel&&(t.channel=this.channel),null!==this.dtype&&(t.dtype=this.dtype),null!==this.data&&(t.data=this.data),JSON.stringify(t)}decode(e){if(void 0===(e=JSON.parse(e)).type)return;let t=e.type;t="request"===t?0:"publish"===t?1:"response"===t?2:"error"===t?-98:"init"===t?99:-99;let s=null,n=null,r=null;void 0!==e.channel&&(s=e.channel),void 0!==e.data&&(n=e.data),void 0!==e.dtype&&(r=e.dtype),this.channel=s,this.data=n,this.dtype=r,this.rtype=t}}const n={LCM_ADDRESS:"udpm://239.255.76.67:7667?ttl=1",ODOMETRY:{channel:"MBOT_ODOMETRY",dtype:"pose2D_t"},RESET_ODOMETRY:{channel:"MBOT_ODOMETRY_RESET",dtype:"pose2D_t"},CONTROLLER_PATH:{channel:"CONTROLLER_PATH",dtype:"path2D_t"},MOTOR_VEL_CMD:{channel:"MBOT_VEL_CMD",dtype:"twist2D_t"},LIDAR:{channel:"LIDAR",dtype:"lidar_t"},SLAM_MAP:{channel:"SLAM_MAP",dtype:"occupancy_grid_t"},SLAM_POSE:{channel:"SLAM_POSE",dtype:"pose2D_t"}};class r{constructor(e="localhost",t=5005){this.address="ws://"+e+":"+t,this.ws_subs={}}_read(e){let t=new s(null,e,null,0);return new Promise(((n,r)=>{const o=new WebSocket(this.address);o.onopen=e=>{o.send(t.encode())},o.onmessage=t=>{let a=new s;a.decode(t.data),o.close(),-98===a.rtype?r("MBot API Error: "+a.data+" on channel: "+e):2!==a.rtype&&r("MBot API Error: Can't parse response on channel: "+e),n(a)},o.onerror=e=>{r("MBot API Error: MBot Bridge Server connection error.")}}))}publish(e,t,n){let r=new s(e,t,n,1);const o=new WebSocket(this.address);o.onopen=e=>{o.send(r.encode()),o.close()},o.onerror=e=>{console.error("MBot API Error: MBot Bridge Server connection error.")}}subscribe(e,t){let n=new s(null,e,null,3);return this.ws_subs[e]?Promise.resolve():new Promise(((r,o)=>{this.ws_subs[e]=new WebSocket(this.address),this.ws_subs[e].onopen=t=>{this.ws_subs[e].send(n.encode()),r()},this.ws_subs[e].onmessage=e=>{let n=new s;n.decode(e.data),t(n)},this.ws_subs[e].onerror=t=>{this.ws_subs[e]=null,o("MBot API Error: Cannot subscribe to channel "+channel)},this.ws_subs[e].onclose=()=>{this.ws_subs[e]=null}}))}unsubscribe(e){return void 0===this.ws_subs[e]||null===this.ws_subs[e]?Promise.resolve():this.ws_subs[e].readyState===WebSocket.CONNECTING?Promise.reject(new Error("Cannot unsubscribe while connecting")):new Promise((t=>{this.ws_subs[e].readyState===WebSocket.OPEN?(this.ws_subs[e].onclose=()=>{this.ws_subs[e]=null,t()},this.ws_subs[e].close()):(this.ws_subs[e]=null,t())}))}readData(e){return new Promise(((t,s)=>{this._read(e).then((e=>{t(e.data)})).catch((e=>{s(e)}))}))}readHostname(){return this.readData("HOSTNAME")}readChannels(){return this.readData("CHANNELS")}readOdometry(){return new Promise(((e,t)=>{this._read(n.ODOMETRY.channel).then((t=>{const s=[t.data.x,t.data.y,t.data.theta];e(s)})).catch((e=>{t(e)}))}))}drive(e,t,s){let r={vx:e,vy:t,wz:s};this.publish(r,n.MOTOR_VEL_CMD.channel,n.MOTOR_VEL_CMD.dtype)}}MBotAPI=t})();
module.exports = { MBotAPI };
