const player = GetPlayer();

function callAssistant() {
    var userInput = player.GetVar("userInput"); // Retrieve the user input from Storyline
    console.log("callAssistant function started with input:", userInput); // Log the input
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:3000/activate-assistant?input=${encodeURIComponent(userInput)}`, true);
    xhr.withCredentials = true;

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Assistant Response:", xhr.responseText);
                player.SetVar("aiOutput", xhr.responseText); // Set the response to aiOutput variable
            } else {
                console.error("Failed to get a response, status code:", xhr.status);
            }
        }
    };

    xhr.onerror = function() {
        console.error("Network error occurred");
    };

    xhr.send();
}

callAssistant(); // Ensure this is triggered appropriately
