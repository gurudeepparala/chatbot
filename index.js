'use strict'
const express = require('express')
const bodyparser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

let token = "<Your-APP-TOKEN-Here>"

app.get('/', function(req, res) {
	res.send("Hi! I am a chatbot.")
})

app.get('/webhook/', function(req,res) {
	if(req.query['hub.verify_token'] === "<Your-WEB-HOOK-TOKEN-Here>") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if(event.message && event.message.text){
			let text = event.message.text
			if(event.message.text == "Hi"){
				sendText(sender, "Hi! How are you?")	
			}else if(event.message.text == "I am fine. You?"){
				sendText(sender, "Great!")
			}else if(event.message.text == "What can you help me with?"){
				sendText(sender, "I am useless as of now.")
			}
			
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text){
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message: messageData
		}
	}, function(error, response, body){
		if(error){
			console.log("Sending Error")
		} else if(response.body.error){
			console.log("Response Body Error:" + response.body.error.message)
		}
	})
}

app.listen(app.get('port'), function(){
	console.log("running: port")
})