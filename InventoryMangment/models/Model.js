import Helper from '../helper/Helper';

class Model {
    ToJSON (text) {
        try {
            return JSON.parse(text);
        } catch(ex) {
            throw {
                result:'error',
                msg:"server error, please try again .."
            }
        }
    }

    getPostUrl(){
		return "http://appsgo.store/actions/"+"dbactions2.php?t="+this.getTableName();
	}
	
	getTableName() {
        return "model";
	}
    

    getOnlineModelAttributes() {
        var attrs= Object.keys(this).filter(key=>!key.startsWith("LOCAL_")).reduce((obj,key)=>{
            if(this[key]){
                obj[key]=this[key];
            } else {
                obj[key]="";
            } 
            return obj;
        },{});        
        return attrs;
    }

    getLocalModelAttributes() {
        return Object.keys(this).filter(key=>key.startsWith("LOCAL_")).reduce((obj,key)=>{obj[key]=this[key]; return obj;},{});        
    }

    getModelAttributesWithoutUndefinedValues() {
        var attrs= Object.keys(this).reduce((obj,key)=>{
            if (typeof this[key]==='undefined') {
                obj[key]="";
            } else {
                obj[key]=this[key]; 
            }
            return obj;
        },{});        
        return attrs;
    }

	getAll() {
        var postUrl = this.getPostUrl() + "&type=ga";
		return Helper.postUrl(postUrl,{...this.getOnlineModelAttributes()}).then(res=>{
			let s1=res.data;
			let s2={result:s1.result,
				data:this.ToJSON(s1.data)};
			return s2;
		}).catch(err=>{
			return {result:false,msg:err};});
    }
    
    getAllBy(params,orderBy={}) {
        var postUrl = this.getPostUrl() + "&type=gab";
		return Helper.postUrl(postUrl,{params:params,...this.getOnlineModelAttributes(),orderBy:orderBy}).then(res=>{
			try {
				let s=res.data;
				if (s.result==="ok") {
					//create instance and retun it to map it and be able to use model functions such as update.
					var instances=[];
					this.ToJSON(s.data).forEach(en => {
						let instance = this.createInstanceByParameter(en);
						instances.push(instance);
					});
					return {result:true,data:instances}; 
				} else {
					return {result:false,msg:s.msg};
				}
			} catch (ex){
				return {result:false,msg:'server error, please try again'};
			}
		}).catch(err=>{
				return {result:false,msg:err};
		});
    }

	insert() {
        
        var postUrl = this.getPostUrl() + "&type=i";
		return Helper.postUrl(postUrl,{...this.getOnlineModelAttributes()}).then(res=>{
				try {
					let s=res.data;
					if (s.result==="ok") {
						return {result:true,data:this.ToJSON(s.data)};
					} else {
						return {result:false,msg:s.msg};
					}
				} catch (ex){
					return {result:false,msg:'server error, please try again'};
				}
		});
    }

    update(params) {
        var postUrl = this.getPostUrl() + "&type=u";
		return Helper.postUrl(postUrl,{params:params,...this.getOnlineModelAttributes()}).then(res=>{
				try {
					let s=res.data;
					if (s.result==="ok") {
						return {result:true,data:this.ToJSON(s.data)};
					} else {
						return {result:false,msg:s.msg};
					}
				} catch (ex){
					return {result:false,msg:'server error, please try again'};
				}
		});
    }

    updateList(params,values) {
        var postUrl = this.getPostUrl() + "&type=u";
		return Helper.postUrl(postUrl,{params:params,...values,...u}).then(res=>{
				try {
					let s=res.data;
					if (s.result==="ok") {
						return {result:true,data:this.ToJSON(s.data)};
					} else {
						return {result:false,msg:s.msg};
					}
				} catch (ex){ 
					return {result:false,msg:'server error, please try again'};
				}
		});
    }

    delete(params) {
        var postUrl = this.getPostUrl()+"&type=d";
            var header={params:params,...this.getOnlineModelAttributes()};
            return Helper.postUrl(postUrl,header).then(res=>{
                    try {
                        let s=res.data;
                        if (s.result==="ok") {
                            return {result:true,data:this.ToJSON(s.data)};
                        } else {
                            return {result:false,msg:s.msg};
                        }
                    } catch (ex){
                        return {result:false,msg:'server error, please try again'};
                    }
            });
    }

    createInstanceByParameter(en) {
        let instance = new this.constructor();
        for(var key in en) {
            if(key in instance) {
                instance[key]=en[key];
            }
        }        
        return instance;
    }

}



export default Model;