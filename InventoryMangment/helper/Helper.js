import Helper from './Helper';
import axios from 'axios';

export default {
    postUrl: (url,json)=> {
        //Make sure json doean't have undefined values, becuase server script will not catch it.
        for(var key in json) {
            var value = json[key];
            if (typeof value==="undefined") {
                json[key]="";
            }
        }
        let data = {
            method: 'POST',
            credentials: 'same-origin',
            body: json,
            headers: {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
            }
        };
        
        return Helper.timeout(
            axios.post(url,data,{

            })
            //fetch(url,data).then(res=>res).then(data=>{
            //console.log(data);
            //debugger;
            //return data;
        );
    },

    timeout: (promise)=> {
        return new Promise((resolve,reject)=> {
          setTimeout(()=> {
            reject("Server is not responding.. Please try again");
          }, 15000)
          promise.then(resolve, reject)
        })
      },
}