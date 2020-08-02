var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const cors = require('cors');

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

app.listen(5000, () => {
    console.log('HTTP Server running on port 5000');
});