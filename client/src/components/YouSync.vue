<template>
	<div id="YouSync">

		<youtube id="player"
			ref="youtube" 
			:video-id="videoId" 
			:player-vars="playerVars"
			@ready="ready" 
			@playing="playing" 
			@paused="paused"
			@ended="ended"	
		></youtube>

		<div id="youtubeLogs">
			<div id="bar"> 
				<span id="whatfor">Youtube Logs</span>
				
				<div id="red"></div>
				<div id="yellow"></div>
				<div id="green"></div>
			</div>
			<ul class="list-container" v-chat-scroll > 
				<li 
						v-for="(event, i) in events" :key="`${i}-${event.id}`"
						ref="playingPaused"
				
				> 
					<span class="id">{{event.id}} </span>  <!-- .substring(0, 8)-->
					<span :class="{'play': event.action.includes('is playing'), 
						'pause': event.action.includes('paused at'), 
						'': event.action == 'joined room.', 
						'leftRoom': event.action == 'left room.',
						'endView' : event.action == 'ended watching.',
										
										}"
						> {{event.action}}
					</span>   

                    <a style="color: lightblue" 
                    class="videoid" 
                    v-if="event.videoid" 
                    :href="'https://www.youtube.com/watch?v='+event.videoid"
                    target="_blank"
                    rel="noopener noreferrer"
                    >link</a>

                    <span v-if="event.currentTime">{{event.currentTime}} </span>
                    <!--<span v-if="event.playCurrentTime">{{event.playCurrentTime}} </span> -->
		
					<span v-if="event.senderCurrentTime">{{event.senderCurrentTime}} </span>
					<!-- <span ref="fromNow" >{{ event.timestamp  }}</span>   Future reference, or local component-->
					<dynamic-from-now class="timestamp" :interval="60000"></dynamic-from-now>
				</li>
			</ul>
			<!--<button id="clear" >Delete</button> <! @click="clearLogs"-->
		</div>
				
		<div class="youtubeControls"> 
				<!-- <button @click="playVideo">Play</button> Hidden from view now
				<button @click="pauseVideo">Pause</button>
				<button @click="seekTo">Seek To</button> -->
				<button @click="playAll">Play All</button>
				<button @click="pauseAll">Pause All</button>
				<button @click="backToStart">FromStart All</button>
				<button @click="seekOnOthers">Sync with Me</button>
				<!--<button @click="randomKPop">RandomKPop</button>-->
				<button @click="changeSong">Change Video</button>
				<input ref="youtubeIdInput" v-model="youtubeId" placeholder="Enter Youtube ID">
                <button @click="muteAll">Mute All</button>
                <button @click="unmuteAll">Unmute All</button>
				<!-- <p>Message is: {{ youtubeId }}</p>   -->
		</div>

	</div>
</template>

<script>
	/* eslint-disable */
	import io from 'socket.io-client'; 


	export default {
		name: 'YouSync',
		data(){
			return {
						socket: {},
						playerVars: {
							'rel': 0,
                            // 'controls': 0
      					},
						context: 0,
						position :{x: 0, y: 0},
						videoId: 'q0hyYWKXF0Q',
						events: [],
						username: "",
						youtubeId: "2S24-y0Ij3Y", //2S24-y0Ij3Y
						randomkpop:[],
                        currentTime: ""

						//seekTo
						// seconds: "35",
						// allowSeekAhead : true,
			}
		},
		created(){
           
			this.socket = io("http://localhost:3000/"); // http://192.168.100.3:3000/" "http://localhost:3000/" Client socket to > server adress / Gitpod change 
		},
		mounted(){
			this.socket.on('seekOnOthers', data => {  
				this.events.push(data) //1. Write to dom - Check
				//console.log('I was ordered to seek to ' + " " + data.senderCurrentTime) 2. Test in log - Check
				//Works now - Seek forward
				this.player.seekTo(data.senderCurrentTime, true); // 3. Siblings seek to sender time
				
				//This kind of stuff on return
				//this.player.seekTo(value.emitterCurrentTime, true);



				//this.events.push(data);
				//     this.currentTime.push(data.currentTime)
				//      this.player.seekTo(currentTime[0], true);
				//    // console.log(this.currentTime)  
				//    // this.currentTime=[];
			
			})
			



			this.socket.on('pause_all', data => {  
				this.events.push(data);
				this.player.pauseVideo();
			})
			this.socket.on('play_all', data => {  
				this.events.push(data);
				this.player.playVideo();
			})

			//Shutting this off for it is annoying atm
			//var username = prompt('What\'s your username?');

			//if (username){ 

				// this.socket.emit('little_newbie', username);

				// Sectia primire de catre Client inapoi de la server
			this.socket.on('disconnect', data => {  
					
				this.events.push(data);

			})
			// I can do click on player playing/ paused after
			this.socket.on('ready', data => {  
					this.events.push(data); //write to array, which will output to dom with v-for
			})
			this.socket.on('ended', data => {  
					this.events.push(data); //write to array, which will output to dom with v-for
			})

			this.socket.on('backToStart_all', data => {  

				//Works now - Seek forward
				//this.player.seekTo(5, true);
				this.events.push(data);
				this.player.seekTo(0, true);
					
			})

			this.socket.on('mute_all', data => {  
			
				this.player.mute()
				this.events.push(data);
			})
			this.socket.on('unmute_all', data => { 
				this.player.unMute()
				this.events.push(data);
			})
			this.socket.on('changeSong_all', data => {  

				//console.log( 'This comes from mounted' + this.youtubeId)	
				//So this socket gets but not all.. the pbolem is in Socketio emit!
				this.player.loadVideoById(data.videoid, 0, "large")
				this.events.push(data);
				//console.log(data.youtubeId); This check is OK!
		
			})
			this.socket.on('playerCurrentTime', data => { 

				this.player.getCurrentTime().then(value => {
					console.log('This is on:'+value)
					
				});
				//You could so something here to set all players same currentTime
				this.events.push(data);
			})


			// this.socket.on('little_newbie', data => {  
			// 	this.events.push(data); //write to array, which will output to dom with v-for
			// })

			//}

			//setInterval(this.getNow, 5000);//refs are available only after mounted

		},
		computed: {
			player() {
					return  this.$refs.youtube.player
				}
			},
		methods: {
				seekOnOthers(){
					// Get Sender current time and pass it along seekOnOthers
					this.player.getCurrentTime().then(value => {
						console.log('This is on:'+value)
						this.socket.emit("seekOnOthers", value)
					});
					
				},
				ready (event) {
						this.player = event.target;
						console.log('Player is ready.')
						this.socket.emit("ready");
				},
				ended (){
					console.log('Yay. You`ve stayed until the end . Video ended!')
					this.socket.emit("ended");
				}, 
				playVideo() {
					this.player.playVideo()
				},
				pauseVideo(){
					this.player.pauseVideo()
				},
				// seekTo(){
				// 	this.player.seekTo(5 , true)
				// },
				playAll(){
					this.socket.emit("play_all")
				},
				pauseAll(){
					this.socket.emit("pause_all")
				},
				backToStart(){
						this.socket.emit("backToStart_all")
				},
				muteAll(){
					this.socket.emit("mute_all")
				},
				unmuteAll(){
					this.socket.emit("unmute_all")
				},
				changeSong(){
					// console.log(this.youtubeId); OK check
					
					// TO DO - Determine if playlist and play it all!

					//Determine if typed a full link or just ID
					if  (this.youtubeId.includes("www.youtube.com/watch")){
						this.socket.emit("changeSong_all", this.$youtube.getIdFromUrl(this.youtubeId))
						//this.$refs.youtubeIdInput.value="";
					} else {
						this.socket.emit("changeSong_all", this.youtubeId)
						//this.$refs.youtubeIdInput.value="";
					}

					
						
						//console.log(this.youtubeId)	
						//So it can access data () with this
				},
				//1. When detects playing/ pausing, send to server
				playing () {

					this.player.getCurrentTime().then(value => {
						// Do something with the value here
						//console.log('See'+ value)
						this.socket.emit("playing", value)
					});
							
				},
				paused () {
					
					this.player.getCurrentTime().then(value => {
						// Do something with the value here
						//console.log('I paused at '+ value)
						this.socket.emit("paused", value)
					});

				},


			},
		}
	</script>

	<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
		#youtubeLogs{

		}
		#player{
			margin: 0 auto;
		}

		ul.list-container  {
			list-style-type: none;
			font-size: 14px;
			height: 150px;
			width:400px;
			margin:0;
			overflow-y: auto;
			background-color: #33485E;
			color:#ffffff;
			padding: 12px;
			border-radius: 0px 0px 8px 8px;
		}
		.timestamp{
			opacity: 0.75;
			font-size:12px;
			color: #ffffff;
			font-weight: 400;
			padding-left:3px;
		float: right;
		}

		/*MacOs Terminal*/ 

	#bar {
			text-align: center;
			width: 424px;
			height: 25px;
			background-color: #DAD9D9;
			margin: 0 ;
			font-family: monospace;
			padding: auto;
			float: none;
			border-radius: 5px;
			position: relative;
	}
	#red {
			background-color: #E94B35;
			border-radius: 100%;
			width: 15px;
			height: 15px;
			margin: 0 auto;
			left: -200px;
			bottom: -20%;
			position:relative;
	}
	#yellow {
			background-color: #f0f000;
			border-radius: 100%;
			width: 15px;
			height: 15px;
			margin: 0 auto;
			left: -180px;
			bottom: 40%;
			position:relative;
			display: block;
	}
	#green {
			background-color: #1AAF5C;
			border-radius: 100%;
			width: 15px;
			height: 15px;
			margin: 0 auto;
			left: -160px;
			bottom: 99%;
			position:relative;
			display: block;
	}
		#whatfor{
			position: absolute;
			height: 15px;
			left: 170px;
			top: 5px;
		}
		.youtubeControls button{
			background-color:indianred;
		}
		/* .youtubeControls {} */
		#clear{
			float: right;
		}

		.play{
			color: #00ff00;
		}
		.pause{
				color: #f1f227;
		}
		.id {
			color: #be90d4;
		}
		.leftRoom{
			text-decoration: line-through;

		}
		.endView{
			color: #ff6347
		}

	</style>
