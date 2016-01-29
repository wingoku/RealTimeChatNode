var express = require('express');
var fs = require('fs');
var app = express();
var router = express.Router();
var http = require('http');

var socket;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WinGoku ChatRoom' });
});

function handleSockets(tag, data, callbackFunction) {
  console.error(tag, "received in index.js: " + data);

  if(tag === "userInfo") {
      validUserLogin(data, callbackFunction);
  }
  else
      if(tag === "chatRequest") {
            sendChatRequestToSpecifiedUser(data);
        }
      else
        callbackFunction("sendMessageToClient", data, true);
}

function sendChatRequestToSpecifiedUser(data, callbackFunction) {
    callbackFunction("chatRequestFromAUser", data, false); // to send the request to the specified user, we need to know his socket id
}

function validUserLogin(data, callbackFunction) {
    console.log("userName: "+ data);

    readConnectedUsersListFromDisk(data, callbackFunction);
}

function onConnectedUserNamesListRetreived(userName, connectUserNamesList, callbackFunction) {
    if(connectUserNamesList.indexOf(userName) > -1)
        onUserNameValidationCompleted(false, "", "", callbackFunction);
    else
        onUserNameValidationCompleted(true, ","+userName, connectUserNamesList, callbackFunction);
}

function onUserNameValidationCompleted(isUserNameValid, newlyConnectedUserName, previouslyConnectedUsersList, callbackToWWW_sendMessageToClientBySockets) {
    if (isUserNameValid) {
        callbackToWWW_sendMessageToClientBySockets("userInfoValidatedFromServer", {response: 'success', connectedUsersList: previouslyConnectedUsersList}, true);
        persistTheConnectedUserNameToDisk(newlyConnectedUserName);
    }
    else
        callbackToWWW_sendMessageToClientBySockets("userInfoValidatedFromServer", {response:'failure', connectedUsersList:newlyConnectedUserName}, true);
}

function persistTheConnectedUserNameToDisk(userName) {
    fs.openSync('connectedUsersList.txt', 'r+', function(err) {
        if(err) {
          console.error("error in opening the file: "+ err);
        }
    });

    fs.appendFile('connectedUsersList.txt', userName+",", function(err) {
        if(err)
          console.error('Error Occured writing file: ', err);
    });

}

function readConnectedUsersListFromDisk(userName, callbackFunction) {
  console.log("enter Read method");

  fs.readFile('connectedUsersList.txt', function(err, data) {
    console.log("read callbacj: "+ typeof(data));
    if(err)
      console.error('Error Occured writing file: ', err);

    console.log("dataFromDisk: "+ data);
      onConnectedUserNamesListRetreived(userName, data.toString(), callbackFunction);
  });
}

module.exports = {router: router, handleSockets:handleSockets};