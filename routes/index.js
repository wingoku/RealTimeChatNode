var express = require('express');
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

    switch(tag) {
        case "yolo":
            console.log("switch statment yolo");
            break;

        case "validateUserInfo":
            validUserLogin(data, callbackFunction);
            break;

        case "chatRequest":
            sendChatRequestToSpecifiedUser(data, callbackFunction);
            break;

        case 'chatRequestConfirmation':
            if(data['isChatRequestAccepted'] == true) {
                console.log("Index.js, chatRequestAccepted", {chatAccepted: true, sessionID:utils.getUserSessionID(data['requester'])});
                callbackFunction('chatRequestConfirmation', {chatAccepted: true, sessionID:utils.getUserSessionID(data['requester'])}, false);
            }
            else{
                callbackFunction('chatRequestConfirmation', {chatAccepted: false, sessionID:utils.getUserSessionID(data['requester'])}, false);
            }
            break;

        default:
            callbackFunction("sendMessageToClient", data, true);
            break;
    }
}

function sendChatRequestToSpecifiedUser(data, callbackFunction) {
    console.error("Index.js requestedUesrsNme:"+ data['requestedUserName'] + " allSessionID: ", utils.getAllConnectedUsersSession());
    var requestedUserSessionID = utils.getUserSessionID(data['requestedUserName']);
    console.error("requestedUsersID: ", requestedUserSessionID);
    if(requestedUserSessionID) {
        var info = {requester: data['requester'], socketIdOfRequestedUser: requestedUserSessionID};
        callbackFunction("chatRequest", info, false); // to send the request to the specified user, we need to know his socket id
    }
}

function validUserLogin(data, callbackFunction) {
    console.log("userName in Index.js: ", data);

    utils.readConnectedUsersListFromDisk(data, onConnectedUserNamesListRetreived, callbackFunction);
}

function onConnectedUserNamesListRetreived(clientData, connectUserNamesList, callbackFunction) {
    console.log("userName: "+ clientData['userName']+ " in list: "+connectUserNamesList.indexOf(clientData['userName']));
    if(connectUserNamesList.indexOf(clientData['userName']) > -1)
        onUserNameValidationCompleted(false, clientData, "", callbackFunction);
    else {
        onUserNameValidationCompleted(true, clientData, connectUserNamesList, callbackFunction);
    }
}

function onUserNameValidationCompleted(isUserNameValid, clientData, previouslyConnectedUsersList, callbackToWWW_sendMessageToClientBySockets) {
    if (isUserNameValid) {
        console.log("Index.js: valid: "+clientData['sessionID']);
        callbackToWWW_sendMessageToClientBySockets("userInfoValidatedFromServer", {response: 'success', connectedUsersList: previouslyConnectedUsersList, sessionID: clientData['sessionID']}, false);
        utils.persistTheConnectedUserNameToDisk(clientData['userName']);
        utils.addNewUserSocketSession(clientData['userName'], clientData['sessionID']);
    }
    else
        callbackToWWW_sendMessageToClientBySockets("userInfoValidatedFromServer", {response:'failure', connectedUsersList:'failure: User Name Taken', sessionID: clientData['sessionID']}, false);
}

module.exports = {router: router, handleSockets:handleSockets};