const Express = require("express")(); //constructor (inst. of var app =express())
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
const sessionsMap = {}

//Socketio.emit - sends to all, including sender
//socket.broadcast.emit - sends to all BUT sender
//socket.emit - sends back to sender only

Socketio.on("connection", socket => {

    //Get data from both clients
    // Socketio.emit('created');
    // socket.on('created', value => {
        
    //     socket.currentTime = value; // 1. Get the currentTime of the Sender into socket.xx
        
        
    //     //Broadcast to all sockets but Sender!
    //     Socketio.emit('seekOnOthers', {
    //         action: "Sender says go to this moment : ",
    //         senderCurrentTime: socket.senderCurrentTime // 2. Broadcast (send  to others) in the form of senderCurrentTime
    //     })

    // });

    //The magic !
    socket.on("getCurrentTime", value => {
        
        socket.currentTime = value;   //parseFloat(value.toFixed(3));//round to 3 digits only and keep it number
        socket.state = "at";
        //from broadcast which would seek only to others
       socket.broadcast.emit('getCurrentTime', { // obtain only other client's data, not mine 
               id: socket.id.substring(0,6),
               action: socket.state ,
               currentTime: socket.currentTime,
               timestamp: socket.handshake.time
        }) 
    
        // No longer needed to show up here and bloat the server
        //    if (socket.currentTime !== 0.000){
        //     console.log(socket.id.substring(0,6) + " " + socket.state + " " +  socket.currentTime)
        //     } 
 
    });







    socket.on('seekOnOthers', value => {
        
        socket.senderCurrentTime = value; // 1. Get the currentTime of the Sender into socket.xx
        
        console.log("Go to my moment, brothers!");
        //Broadcast to all sockets but Sender!
        Socketio.emit('seekOnOthers', {
            action: "Sender says go to this moment : ",
            senderCurrentTime: socket.senderCurrentTime // 2. Broadcast (send  to others) in the form of senderCurrentTime
        })

    });
    socket.on('getCurrentState', value => {
        
        socket.senderCurrentTime = value; // 1. Get the currentTime of the Sender into socket.xx
        
        console.log("Go to my moment, brothers!");
        //Broadcast to all sockets but Sender!
        Socketio.emit('getCurrentState', {
            action: "I am a sibling and my current state is : ",
            timestamp: socket.handshake.time
        })

    });


    socket.on("playing", value => {
        
        socket.currentTime = value.toFixed(3)//round to 3 digits only
        socket.state = "playing";
       //async!
       //Each socket.currentTime contains the currentTime
       //Got to separate values for client 1 and  client2 here on in Client
       console.log( socket.id.substring(0,6) + " " + socket.state + " " +  socket.currentTime)
        //So other knows my player state, my client doesnt need to know my client, only other(s)
       socket.broadcast.emit('playing', {
               id: socket.id.substring(0,6),
               action: socket.state ,
               currentTime: socket.currentTime,
               timestamp: socket.handshake.time
                //remove last 3 digits
           }) // send to all clients
   
    });




    socket.on('paused', value => {

        socket.currentTime = value.toFixed(3)//round to 3 digits only
        socket.state = "paused";

        //console.log(socket.id.substring(0,6)  + 'paused ' + socket.currentTime  )

        socket.broadcast.emit('paused', {
                id: socket.id.substring(0,6),
                action: socket.state,
                currentTime: socket.currentTime,
                timestamp: socket.handshake.time
                 //remove last 3 digits
            }) // send to all clients

    });


    socket.on("buffering", data => {
        socket.state = "buffering";

        console.log(socket.id + " " + socket.state ) // log here socket.handshake.time 
            //.slice to make it shorter in client
        socket.broadcast.emit('buffering', {
                id: socket.id.substring(0,6),
                action: socket.state ,
                timestamp: socket.handshake.time
            }) // send to all clients
    })




    // If connected & playing - Server console logs - socket.on
    socket.on("disconnect", data => {

        socket.state = "disconnected";
        console.log(socket.id.substring(0,6) + ' disconnected.')

        Socketio.emit('disconnect', {
            id: "💥"  + socket.id,
            action:  socket.state,
            timestamp: socket.handshake.time
        })

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

    socket.on('backToStart_all', data => {

        console.log('Let`s Go Back To Start Guys!');

        Socketio.emit('backToStart_all', {
           id: socket.id.substring(0,6),
            action: "Back to start y'all!",
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

    socket.on('play_all', value => {

        socket.currentTime = value.toFixed(3);//cut last 4 digits and make it string
        
        //console.log(socket.id.substring(0,6)  + 'paused ' + socket.currentTime  )

        Socketio.emit('play_all', {
                id: socket.id.substring(0,6),
                action: "is playing for all from",
                currentTime: socket.currentTime,
                timestamp: socket.handshake.time
                 //remove last 3 digits
            }) // send to all clients



    });
    socket.on('pause_all', value => {

        socket.currentTime = value.toFixed(3);//cut last 4 digits and make it string
        
        //console.log(socket.id.substring(0,6)  + 'paused ' + socket.currentTime  )

        Socketio.emit('pause_all', {
                id: socket.id.substring(0,6),
                action: "has paused for everyone at",
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