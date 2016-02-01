var express = require('express');
var fs = require('fs');
var app = express();
var router = express.Router();
var http = require('http');
var utils = require('../routes/models/utils');

var socket;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WinGoku ChatRoom' });
});

function handleSockets(tag, data, callbackFunction) {
  //console.error(tag, "received in index.js: " + data);

  if(tag === "userInfo") {
      validUserLogin(data, callbackFunction);
  }
  else
      if(tag === "chatRequest") {
            console.error("chat request");
            sendChatRequestToSpecifiedUser(data);
        }
      else
        callbackFunction("sendMessageToClient", data, true);
}

function sendChatRequestToSpecifiedUser(data, callbackFunction) {
    console.error("requestedUesrsNme:"+ data['requestedUserName'] + " allSessionID: "+ utils.getAllConnectedUsersSession());
    var requestedUserSessionID = utils.getUserSessionID(data['requestedUserName']);
    console.error("requestedUsersID: ", requestedUserSessionID);
    if(requestedUserSessionID) {
        var info = {requester: data['requester'], socketIdOfRequestedUser: requestedUserSessionID};
        callbackFunction("chatRequestFromAUser", info, false); // to send the request to the specified user, we need to know his socket id
    }
}

function validUserLogin(data, callbackFunction) {
    console.log("userName in Index.js: ", data);

    readConnectedUsersListFromDisk(data, callbackFunction);
}

function onConnectedUserNamesListRetreived(clientData, connectUserNamesList, callbackFunction) {
    console.log("userName: "+ clientData['userName']+ " in list: "+connectUserNamesList.indexOf(clientData['userName']));
    if(connectUserNamesList.indexOf(clientData['userName']) > -1)
        onUserNameValidationCompleted(false, clientData, "", callbackFunction);
    else {
        //var temp = connectUserNamesList.replace( /,/g, '_');
        onUserNameValidationCompleted(true, clientData, connectUserNamesList, callbackFunction);
    }
}

function onUserNameValidationCompleted(isUserNameValid, clientData, previouslyConnectedUsersList, callbackToWWW_sendMessageToClientBySockets) {
    //console.log("userName validatio completed: "+ isUserNameValid);
    if (isUserNameValid) {
        console.log("Index.js: valid: "+clientData['sessionID']);
        callbackToWWW_sendMessageToClientBySockets("userInfoValidatedFromServer", {response: 'success', connectedUsersList: previouslyConnectedUsersList, sessionID: clientData['sessionID']}, false);
        persistTheConnectedUserNameToDisk(clientData['userName']);
        utils.addNewUserSocketSession(clientData['userName'], clientData['sessionID']);
    }
    else
        callbackToWWW_sendMessageToClientBySockets("userInfoValidatedFromServer", {response:'failure', connectedUsersList:'failure: User Name Taken', sessionID: clientData['sessionID']}, false);
}

function persistTheConnectedUserNameToDisk(userName) {
    fs.openSync('connectedUsersList.txt', 'r+', function(err) {
        if(err) {
          //console.error("error in opening the file: "+ err);
        }
    });

    fs.appendFile('connectedUsersList.txt', userName+",", function(err) {
        //if(err)
          //console.error('Error Occured writing file: ', err);
    });
}

function readConnectedUsersListFromDisk(clientData, callbackFunction) {
  //console.log("enter Read method");

  fs.readFile('connectedUsersList.txt', function(err, data) {
    //console.log("read callbacj: "+ typeof(data));
   // if(err)
      //console.error('Error Occured writing file: ', err);

    //console.log("dataFromDisk: "+ data);
      onConnectedUserNamesListRetreived(clientData, data.toString(), callbackFunction);
  });
}

module.exports = {router: router, handleSockets:handleSockets};