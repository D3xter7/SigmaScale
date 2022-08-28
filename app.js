const { ReadlineParser } = require('@serialport/parser-readline')
const serialPort = require('serialport');                  
var express = require("express");
var app = express();
var path = require('path');
var router = express.Router();
app.use(express.static(path.join(__dirname, 'public')));

router.get("/",function(req,res){
  res.sendFile(__dirname + '/views/index.html');
});

router.get('/getWeight', (req, res)=>{
      
    serialPort.SerialPort.list().then((ports, error) => {
    var mxg = '';
    var portPath = '';
    if(error){
console.log(error);
    }
    else if(ports.length !== 0){
        ports.forEach(function(port) {
            console.log('Port Reading...');
        if(port.productId === '2303'){
            // 2303
            portPath = port.path;
            const getPort = new serialPort.SerialPort({ path: portPath, baudRate: 2400 }); // 2400
            getPort.on('open', ()=>{
               const parser = getPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
            mxg = 'Getting Data From Weight Machine';
            console.log('Sending Data');
            parser.on('data', (data)=>{
                
                res.writeHeader(200, {"Content-Type": "text/plain"});  
                res.write(JSON.stringify({weight: data}));
                console.log('Data Sent: ' + data);
                getPort.close((err)=>{
                if(!err){
                    console.log('Port Closed');
                    res.end();
                    return;

                }
                console.log(err);
            });
            });
            });
             
            
        } else{
            mxg = 'Machine Not Found';
        }
        
    });
    } else{
        mxg = 'No COM Port Detected';
        res.end();
    }
    console.log(mxg);
  });   

});

app.use("/",router);

app.listen(8080,function(){
  console.log("Live at Port 8080");
});

 