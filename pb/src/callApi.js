const baseurl = (process.env.NODE_ENV === 'production' ? 'https://webappscrabbleclub.azurewebsites.net/api/Values' : 'https://localhost:55557/api/Values');

/**
 * Get chat messages
 * @param {string} chattype GAMECHAT (game), CLASSIC (lobby), or SURVIVAL (lobby)
 * @param {int} chatnumber Chat number required for GAMECHAT only
 * @returns Either {number: <int>, msgs[]: {name: <string>, msg: <string>, time: <int>}} or {error: <string>}
 * @async
 */
export async function callGetChat(chattype, chatnumber) {
    let url = chattype === 'GAMECHAT' ? `${baseurl}/chat/getchat?number=${chatnumber}` : `${baseurl}/chat/getlobbychat?type=${chattype}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Send chat message, get back updated chat data
 * @param {int} number Chat number required to identify the chat
 * @param {string} name The name of the person sending the message
 * @param {string} msg The message to send
 * @returns Either {number: <int>, msgs[]: {name: <string>, msg: <string>, time: <int>}} or {error: <string>}
 * @async
 */
 export async function callSendChat(number, name, msg) {
    let url = `${baseurl}/chat/chatmessage?number=${number}&name=${name}&msg=${msg}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Determine which words are invalid
 * @param {string[]} words A word array
 * @param {bool} isJumbleMode True if word letters can be in any order
 * @returns {string[]} The words that are not in the lexicon
 * @async
 */
 export async function determineInvalidWords(words, isJumbleMode) {
    let url = isJumbleMode ?
        `${baseurl}/NWL2023/jumble/getinvalidwords?words=${words}` 
    :
        `${baseurl}/NWL2023/getinvalidwords?words=${words}`; // Server handles case insensitive logic
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.value;
}
/**
 * Send a player move and get back updated game data
 * @param {int} number The game number
 * @param {bool} isPass Is it a pass?
 * @param {bool} isExchange Is it an exchange?
 * @param {string} letters The letters to exchange if exchanging, blank to change all letters
 * @param {string} mainword The main word played, blanks as lower case letter otherwise upper case
 * @param {string} extrawords A comma separated list of extra words formed by the play
 * @param {string} coords The coords
 * @param {int} syncCheck The number of moves made. Server checks this against what server has to avoid reprocessing a move.
 * @returns The updated game data or an error
 */
export async function callMakeMove(number, isPass, isExchange, letters, mainword, extrawords, coords, syncCheck) {
    let url =`${baseurl}/pb/makemove?number=${number}&isPass=${isPass}&isExchange=${isExchange}&letters=${letters}&mainWord=${mainword}&extraWords=${extrawords}&coords=${coords}&syncCheck=${syncCheck}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Get game data
 * @param {int} number The game number
 * @returns Game data or an error, json format
 * @async
 */
 export async function callGetGame(number) {
    let url =`${baseurl}/pb/getgame?number=${number}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Get game list
 * @returns Game list or an error, json format
 * @async
 */
 export async function callGetGameList() {
    let url =`${baseurl}/pb/listgames`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        return {gamelist: jdata.value, error: false};
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Create new game
 * @param {string}  name Player name
 * @param {int} rackSize   Rack size
 * @param {bool} isJumbleMode In jumble mode words can be played with letters in any order
 * @returns Game data or an error, json format
 * @async
 */
export async function callCreateGame(name, rackSize, isJumbleMode) {
    let url = `${baseurl}/pb/creategame?name=${name}&rackSize=${rackSize}&isJumbleMode=${isJumbleMode}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Join game
 * @param {int} number The game number
 * @param {string} name The player name
 * @returns Game data or an error, json format
 * @async
 */
 export async function callJoinGame(number, name) {
    let url =`${baseurl}/pb/joingame?number=${number}&name=${name}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}

/**
 * Start game two
 * @param {int} number The game number
 * @returns Game data or an error, json format
 * @async
 */
 export async function callStartGameTwo(number) {
    let url =`${baseurl}/pb/startgametwo?number=${number}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}

/**
 * Delete game
 * @param {int} number The game number
 * @returns Updated game list or an error, json format
 * @async
 */
 export async function callDeleteGame(number) {
    let url =`${baseurl}/pb/deletegame?number=${number}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
