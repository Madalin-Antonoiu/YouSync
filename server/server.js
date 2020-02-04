const Express = require("express")(); //constructor (inst. of var app =express())
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);


Socketio.on("connection", socket => {

    // If connected & playing - Server console logs - socket.on
    socket.on("disconnect", data => {
        console.log(socket.id.substring(0,6) + ' disconnected.')

        Socketio.emit('disconnect', {
            id: "💥"  + socket.id,
            action: "left room.",
            timestamp: socket.handshake.time
        })

    })
    socket.on("playing", data => {
        console.log(socket.id.substring(0,6) + ' is watching.') // log here socket.handshake.time 
            //.slice to make it shorter in client
        Socketio.emit('playing', {
                id: socket.id.substring(0,6),
                action: "is watching.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    socket.on("ready", data => {
        console.log( socket.id.substring(0,6) + "'s player is ready.") // log here

        Socketio.emit("ready", {
                id: socket.id.substring(0,6),
                action: "joined and his player is ready.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    socket.on("ended", data => {
        console.log(socket.id + 'ended watching.') // log here socket.handshake.time 
            //.slice to make it shorter in client
        Socketio.emit('ended', {
                id: socket.id.substring(0,6),
                action: "ended watching.",
                timestamp: socket.handshake.time
            }) // send to all clients
    })
    socket.on('play_all', data => {

        console.log('I command all players play now!');

        Socketio.emit('play_all', {
                id: socket.id.substring(0,6),
                action: "is playing a video for all.",

            }) // send to all clients

    });
    socket.on('pause_all', data => {

        console.log('I command all players to pause now!');

        Socketio.emit('pause_all', {
             id: socket.id.substring(0,6),
            action: "has paused the video for everyone.",

        })

    });
    socket.on('backToStart_all', data => {

        console.log('Let`s Go Back To Start Guys!');

        Socketio.emit('backToStart_all', {
           id: socket.id.substring(0,6),
            action: "Back to start y'all!",
        })

    });
    socket.on('forwardFive_all', data => {

        console.log("Forward by 5 y'all!");

        Socketio.emit('forwardFive_all', {
            action: "Forward by 5 y'all!",
        })

    });
    socket.on('mute_all', data => {

        Socketio.emit('mute_all', {
                id: socket.id.substring(0,6),
                action: "Muted guys!",

            }) // send to all clients

    });
    socket.on('unmute_all', data => {

        Socketio.emit('unmute_all', {
                id: socket.id.substring(0,6),
                action: "Unmuted guys!",

            }) // send to all clients

    });
    socket.on('changeSong_all', youtubeId  => {
        socket.youtubeId = youtubeId;
        //console.log(youtubeId) Check is ok!

        Socketio.emit('changeSong_all', {
            id: socket.id.substring(0,6),
            action: "changed the video to this",
            videoid: socket.youtubeId
        })

    });  

    socket.on('paused', value => {

        socket.currentTime = value.toString().substr(0, value.toString().length - 4);//cut last 4 digits and make it string
        
        console.log(socket.currentTime  + " " + socket.id )

        Socketio.emit('paused', {
                id: socket.id.substring(0,6),
                action: "paused at",
                currentTime: socket.currentTime,
                timestamp: socket.handshake.time
                 //remove last 3 digits
            }) // send to all clients

    });






    // socket.on('little_newbie', username => {
    //     socket.username = username;
    //     console.log(socket.username + " " + socket.id + ' is speaking to me! ');

    //     Socketio.emit('little_newbie', {
    //             id: socket.username + " " + socket.id,
    //             action: "has joined the room <3.",
    //             timestamp: socket.handshake.time
    //         }) // send to all clients

    // });
});






Http.listen(3000, () => {
    console.log("Listening at :3000")
});