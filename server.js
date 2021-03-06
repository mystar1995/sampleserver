var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const cors = require('cors');
const {exec} = require('child_process');
const absolute_url = "/opt/janus/share/janus/recordings/";
const BoxSDK = require('box-node-sdk');
const config = require('./config_china.json');
var request = require('request');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var multer = require('multer');

var sdk = new BoxSDK(config.boxAppSettings);

//var sdk = BoxSDK.getPreconfiguredInstance(config);
var client = sdk.getAppAuthClient('enterprise',config.enterpriseID);
//var userclient = sdk.getAppAuthClient('user','13950271693');
var userclient = sdk.getAppAuthClient('user','14423179306');

app.use(bodyparser.json({
    urlencoded:false
}))
app.use(cors());

var upload = multer({dest:'uploads/'});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-timebase"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.static('/opt/janus/share/janus/recordings'));

app.get("/convert",function(req,res){
    console.log("sudo bash convert.sh " + absolute_url  + req.query.filename + " " + absolute_url + req.query.convertname + "-record.mp4");
	exec("sudo bash convert.sh " + absolute_url  + req.query.filename + " " + absolute_url + req.query.convertname + "-record.mp4",(err,stdout,stderr)=>{

	});
})

app.get("/getfile",function(req,res){
    if(req.query.fileid)
    {
        // let key = {
        //     key: config.boxAppSettings.appAuth.privateKey,
        //     passphrase: config.boxAppSettings.appAuth.passphrase
        //   };
        // let user_id = "13950271693";

        // let authenticationUrl = "https://api.box.com/oauth2/token";
        // let claims = {
        //     iss: config.boxAppSettings.clientID,
        //     sub: user_id,
        //     box_sub_type: "user",
        //     aud: authenticationUrl,
        //     jti: crypto.randomBytes(64).toString("hex"),
        //     exp: Math.floor(Date.now() / 1000) + 45
        //   };

        //   let keyId = config.boxAppSettings.appAuth.keyID;

        //     let headers = {
        //     'algorithm': 'RS512',
        //     'keyid': keyId,
        //     }

        //     let assertion = jwt.sign(claims, key, headers);


        // // var client = sdk.getAppUserTokens("13950271693",null,function(err,response){
        // //     res.send(response);
        // // })

        // //res.send(authorization_url);
        // request.post('https://api.box.com/oauth2/token/',{headers:{"Content-Type":'application/x-www-form-urlencoded'},formData:{"grant_type":'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion,"client_id":config.boxAppSettings.clientID,"client_secret":config.boxAppSettings.clientSecret}},function(err,response,body){
        //     if(!err)
        //     {
        //         res.send(body);
        //     }
        //     else
        //     {
        //         res.send(err);
        //     }
        // })
        // client.files.getReadStream(req.query.fileid,null,function(error,stream){
        //     if(error){
        //         console.log(error);
        //     }
        //     res.send(stream);
        // })
        // client.users.get('me',null).then(serviceAccount=>{
        //     res.send(serviceAccount.login);
        // })

        
        userclient.files.getDownloadURL(req.query.fileid).then(downloadurl=>{
            res.redirect(downloadurl);
        }).catch(err=>res.send(err));

        // res.redirect('https://api.box.com/2.0/files/' + req.query.fileid + '/content?access_token=' + config.developer_token);
    }
    else
    {
        res.send({success:false});
    }
})

app.post('/uploadfile',upload.array('files',12),async(req,res)=>{
    var files = [];
    console.log(req.files);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    for(let item in req.files )
    {
        let fileobj = await uploadfile(req.files[item]);

        files.push(fileobj.entries[0].id);
    }

    res.send(files);
})

app.get('/token',function(req,res){
    userclient.exchangeToken(['item_upload','item_delete']).then(tokeninfo=>{
        res.send(tokeninfo);
    })
})
function uploadfile(file)
{
    return new Promise((resolve,reject)=>{
        var stream = fs.createReadStream(file.path);
        var extension = file.originalname.split('.');

        userclient.files.uploadFile('123549414785',file.filename + '.' + extension[extension.length - 1],stream,{replace:true}).then(file=>resolve(file)).catch(err=>console.log(err))
        //userclient.files.getChunkedUploader('123549414785',Math.max(file.size,20000000),file.filename,stream).then(uploader=>{console.log("upload started"); uploader.start(); }).then(file=>{ console.log(file);resolve(file);}).catch(err=>console.log(err))
    })
}

const httpserver = require('http').createServer(app);

const io = require('socket.io')(httpserver);

io.on('connect',socket=>{
    console.log('connected');

    socket.on('subscribe',function(data){
        console.log(data);
        socket.room = data.room;
        socket.connected = true;
        io.emit('subscribe',{room:data.room});
    })

    socket.on('unsubscribe',function(data){
        console.log(data);
        io.emit('unsubscribe',{room:data.room});
    })

    socket.on('disconnect',function(){
        if(socket.room)
        {
            socket.connected = false;
            io.emit('unsubscribe',{room:socket.room});    
        }
        
    })

    socket.on('reactionchange',function(data){
        console.log(data);
        io.emit('reactionchange',data);
    })

    socket.on('sendmessage',function(msg){
        io.emit('sendmessage',msg);
    })

    socket.on('addreaction',function(msgid){
        io.emit('addreaction',msgid);
    })
})

httpserver.listen(5000, () => {
    console.log('HTTP Server running on port 5000');
});
