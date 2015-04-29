var recognizer = new webkitSpeechRecognition();
recognizer.lang = "en";

recognizer.onresult = function(event) //Fetches voice command
{
    if (event.results.length > 0) {
        var result = event.results[event.results.length-1];
        if(result.isFinal) 
        {
            processSpeech(result[0].transcript);
        }
    }  
};

function startRecord()  //Starts recording when voice button is pressed
{
    recognizer.start();
}

function processSpeech(sentence)
{
    document.getElementById('voice-command').innerHTML = "Voice Command: '"+sentence+"'."; //Display the voice command in text form
    
    var words = sentence.split(" ");    //Parse the sentence into words

    if(words.length >= 2 && words[0] == "find" )    //Find user and places according to command
    {
        setSelectedType(capitalize(trimS(words[1])));
        
        if(words.length >= 4 && words[2] == "near" )
        {
            setSelectedUser(capitalize(words[3]));
        }
    }
}

function trimS(str) //Trim the trailing 's' from type, i.e. returns 'hospital' for 'hospitals'
{
    if(str[str.length - 1] == 's')
    {
        return str.substring(0, str.length - 1);
    }
    return str;
}

function capitalize(str)    //Capitalizes the first letter, i.e. returns 'Hospital' for 'hospital'
{
    return str && str[0].toUpperCase() + str.slice(1);
}

document.getElementById('voice-button').addEventListener('click', startRecord);
