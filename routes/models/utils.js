var connectedUsersSocketSessionIDList = {};

function addNewUserSocketSession(userName, sessionID) {
    connectedUsersSocketSessionIDList[userName] = sessionID;
    console.error("Utils Connected User's sessionID: "+ connectedUsersSocketSessionIDList[userName] + " length: "+ Object.keys(connectedUsersSocketSessionIDList).length);
}

function getUserSessionID(userName) {
    console.log("getID: ", connectedUsersSocketSessionIDList[userName]+ "usersName: "+ userName);
    return connectedUsersSocketSessionIDList[userName];
}

function getAllConnectedUsersSession() {
    console.log("Utils.js: ", connectedUsersSocketSessionIDList);
    return connectedUsersSocketSessionIDList;
}

module.exports={addNewUserSocketSession: addNewUserSocketSession, getUserSessionID:getUserSessionID, getAllConnectedUsersSession: getAllConnectedUsersSession}