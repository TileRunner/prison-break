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
 * Determine whether a word is in the slur-expunged ENABLE2K lexicon, case insensitive
 * @param {string} word A word
 * @returns Whether the word is in the lexicon
 * @async
 */
 export async function isWordValid(word) {
    let url = `${baseurl}/ENABLE2K/exists?word=${word}`; // Server handles case insensitive logic
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.value;
}
/**
 * Send a player move and get back updated game data
 * @param {int} number The game number
 * @param {string} name The player name
 * @param {string} type The type of move (VALID, PHONY, PASS, TIMEOUT)
 * @param {string} word The word
 * @returns The updated game data or an error
 */
export async function callMakeMove(number, name, type, word) {
    let url =`${baseurl}/pb/makemove?number=${number}&name=${name}&type=${type}&word=${word}`;
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
 * @returns Game data or an error, json format
 * @async
 */
export async function callCreateGame(name, rackSize) {
    let url = `${baseurl}/pb/creategame?name=${name}&rackSize=${rackSize}`;
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
