var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const cors = require('cors');
const {exec} = require('child_process');
const absolute_url = "/opt/janus/share/janus/recordings/";

app.use(bodyparser.json({
    urlencoded:false
}))
app.use(cors());
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
})

httpserver.listen(5000, () => {
    console.log('HTTP Server running on port 5000');
});
