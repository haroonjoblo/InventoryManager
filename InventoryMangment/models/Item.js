import Model from './Model';

class Item extends Model {
    constructor(id,name,description,quantity,price,user_id) {
		super();
		this.id=id;
		this.name=name;
		this.description=description;
		this.quantity=quantity;
		this.price=price;
		this.user_id=user_id;
    }

    getTableName() {
        return "Items";
    }

	static getAll() {
		return (new Item()).getAll();
	}

    // static getAllByUsername(username) {
    //     return (new Entry()).getAllBy([{name:"Username",value:username}]);
    // }

    // static getUnique(username,entryName) {
    //     return (new Entry()).getAllBy([{name:"Username",value:username},{name:"EntryName",value:entryName}]);
    // }

    // updateUnique(username,entryName) {
    //     return this.update([{name:"Username",value:username},{name:"EntryName",value:entryName}]);
    // }

    // deleteUnique(username,entryName) {
    //     return this.delete([{name:"Username",value:username},{name:"EntryName",value:entryName}]).then(res=>{
    //         if (res.result) {
    //             var password = new Password();
    //             return password.deleteWithEntry(entryName,username);
    //         } else {
    //             throw (res.msg);
    //         }
    //     });
    // }
}

export default Item;