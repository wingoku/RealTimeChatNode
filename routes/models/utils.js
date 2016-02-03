var fs = require('fs');

var connectedUsersSocketSessionIDList = {};

function addNewUserSocketSession(userName, sessionID) {
    connectedUsersSocketSessionIDList[userName] = sessionID;
    console.error("Utils Connected User's sessionID: "+ connectedUsersSocketSessionIDList[userName] + " length: "+ Object.keys(connectedUsersSocketSessionIDList).length);
}

function removeUserWithSessionID(sessionID) {
    //todo: remove from the connectUsersList and remove it from the file as well
}

function getUserSessionID(userName) {
    console.log("getID: ", connectedUsersSocketSessionIDList[userName]+ "usersName: "+ userName);
    return connectedUsersSocketSessionIDList[userName];
}

function getAllConnectedUsersSession() {
    console.log("Utils.js: ", connectedUsersSocketSessionIDList);
    return connectedUsersSocketSessionIDList;
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

function readConnectedUsersListFromDisk(clientData, onConnectedUserNamesListRetreived, callbackFunction) {
    fs.readFile('connectedUsersList.txt', function(err, data) {

        if(err)
            console.error('Error Occured writing file: ', err);

        onConnectedUserNamesListRetreived(clientData, data.toString(), callbackFunction);
    });
}

module.exports={addNewUserSocketSession: addNewUserSocketSession, getUserSessionID:getUserSessionID, getAllConnectedUsersSession: getAllConnectedUsersSession,
    readConnectedUsersListFromDisk: readConnectedUsersListFromDisk, persistTheConnectedUserNameToDisk:persistTheConnectedUserNameToDisk,
    removeUserWithSessionID: removeUserWithSessionID};