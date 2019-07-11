var app = require('express')();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

const Schema = mongoose.Schema;

const collectionName = new Schema({
	name:{
		type: String
	},
	email:{
		type: String,
        unique: true,//checks for other data / same
        trim: true, //trims unneeded white space
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
		required: [true, 'Email is required']
	},
	password:{
		type: String,
		required: [true, 'Password is required']
	},
	
	phoneNumber:{
		type: String
	},
	Address:{
		type: String
	},
	role:{
		type: String,
		required: [true, 'Role should be defined']
	}
});

const MyModel = mongoose.model('testCollection', collectionName);

var db = mongoose.connect('mongodb://krishna:Krishna1@ds349587.mlab.com:49587/user', { useNewUrlParser: true })

app.get('/test', function(req, res){
	MyModel.find({}, function (err, docs) {
	  console.log(err, docs)
	  if(docs === null){
		res.send('No Data');
	  }
	  else{
	  	res.send(docs);  
	  }
	});
})

app.post('/signUp', function(req, res){
console.log(req.body)
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		// Store hash in your password DB.
	test = new MyModel();
	test.name = req.body.Name;
	test.role = req.body.Role;
	test.email = req.body.Email;
		test.password = hash;
	test.phoneNumber = req.body.phoneNumber;
	test.Address = req.body.Address;
	console.log(test);
	test.save(function (err, data) {
		if(err){
			console.log(err);
			if(err.errors){
				let errorsArray = Object.keys(err.errors);
				res.send(err.errors[errorsArray[0]].message)
			}
			else{
				res.send(["doesnot work"]);
			}
			//send only a single validation error
		}
		else{
			res.send(["Succesfully stored data"])
		}
	});
	});
	
})

app.post('/logIn', function(req, res){

		MyModel.findOne({ email: req.body.Email }, function(err, docs){
			let returnData = {
				    "name": docs.name,
					"role": docs.role,
					"email": docs.email,
					"phoneNumber": docs.phoneNumber,
					"Address": null,
			}
			if(err){
					res.send(['Problem with Database']);
			}
			else{
				
					bcrypt.compare(req.body.password, docs.password, function(err, data) {
						if(data){ 
							res.send([returnData]);
						}
						else{
							res.send(["Wrong Credentials"]);
						}
					});
			}
		})
})

app.get('/usersList', function(req, res){
	MyModel.find({role: 'Editor'}, function (err, docs) {
	  console.log(err, docs)
	  if(docs === null){
		res.send(['No Data']);
	  }
	  else{
	  	res.send(docs);  
	  }
	});
})

app.listen(3010, function(){
	console.log('running at 3010 port')
})