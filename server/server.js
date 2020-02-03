const Express = require("express")(); //constructor (inst. of var app =express())
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
// const nsp = Socketio.of('/room1');
//var moment = require('moment'); // It should run on client to update the times ;) 
// io.socket/ io is default /, or Socketio in our case with broadcast all /

// Only for the Canvas game
var position = {
        x: 200,
        y: 200
    }
    // end of it

Socketio.on("connection", socket => {
    
    socket.emit("position", position) // As in pos line5, emits to one client

    // If connected & playing - Server console logs - socket.on
    socket.on("disconnect", data => {
        console.log( socket.id + ' disconnected.')

        Socketio.emit('disconnect', {
            id: "💥"  + socket.id,
            action: "left room.",
            timestamp: socket.handshake.time
        })

    })
    socket.on("playing", data => {
        console.log(socket.id + ' started watching.') // log here socket.handshake.time 
            //.slice to make it shorter in client
        Socketio.emit('playing', {
                id: socket.id,
                action: "started watching.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    socket.on("paused", data => {
        console.log(socket.id + 'paused.') // log here

        Socketio.emit('paused', {
                id: socket.id, //socket.username + " " 
                action: "paused.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    socket.on("ready", data => {
        console.log(socket.id + "'s player is ready.") // log here

        Socketio.emit("ready", {
                id:  socket.id,
                action: "'s player is ready.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    socket.on("ended", data => {
        console.log(socket.id + 'ended watching.') // log here socket.handshake.time 
            //.slice to make it shorter in client
        Socketio.emit('ended', {
                id:  socket.id,
                action: "ended watching.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    // socket.on('little_newbie', username => {
    //     socket.username = username;
    //     console.log(socket.username + " " + socket.id + ' is speaking to me! ');

    //     Socketio.emit('little_newbie', {
    //             id: socket.username + " " + socket.id,
    //             action: "has joined the room <3.",
    //             timestamp: socket.handshake.time
    //         }) // send to all clients

    // });
    socket.on('play_all', data => {

        console.log('I command all players play now!');

        Socketio.emit('play_all', {

                action: "Get Playing guys!",

            }) // send to all clients

    });
    socket.on('pause_all', data => {

        console.log('I command all players to pause now!');

        Socketio.emit('pause_all', {

            action: "Get A Short Break guys!",

        })

    });
    socket.on('backToStart_all', data => {

        console.log('Let`s Go Back To Start Guys!');

        Socketio.emit('backToStart_all', {
            action: "Back to start y'all!",
        })

    });
    socket.on('forwardFive_all', data => {

        console.log("Forward by 5 y'all!");

        Socketio.emit('forwardFive_all', {
            action: "Forward by 5 y'all!",
        })

    });
    socket.on('changeSong_all', youtubeId  => {
        socket.youtubeId = youtubeId;
        //console.log(youtubeId) Check is ok!

        Socketio.emit('changeSong_all', {
            id: socket.youtubeId,
            action: "Change song y'all clients! - CustomID",
        })

    });
	

    socket.on('move', data => {
        switch (data) {
            case "left":
                position.x -= 5 //position = position -5 
                    //Socketio emits to all clients, whereas socket.emit will emit to just that 1 socket
                Socketio.emit("position", position) //we want to update the position on ALL clients
                break;

            case "right":
                position.x += 5 //position = position -5 
                    //Socketio emits to all clients, whereas socket.emit will emit to just that 1 socket
                Socketio.emit("position", position) //we want to update the position on ALL clients
                break;

            case "up":
                position.y -= 5 //position = position -5 
                    //Socketio emits to all clients, whereas socket.emit will emit to just that 1 socket
                Socketio.emit("position", position) //we want to update the position on ALL clients
                break;

            case "down":
                position.y += 5 //position = position -5 
                    //Socketio emits to all clients, whereas socket.emit will emit to just that 1 socket
                Socketio.emit("position", position) //we want to update the position on ALL clients
                break;
        }
    })


});






Http.listen(3000, () => {
    console.log("Listening at :3000")
});