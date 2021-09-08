const Ticker = require('./modules/ticker');

let count = 0;

process.on("tick", async()=>{
    count++;
    console.log(count);

    if (count >= 10) {
        await ticker.emit("stop");
    }
})

let ticker = new Ticker(process);
ticker.start();