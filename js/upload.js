const CLIENT_ID = '';
const API_KEY = '';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';


let tokenClient;
let accessToken = null;

function handleClientLoad() {
    console.log("Loading Google API client...");
    gapi.load('client', initClient);
}

function initClient() {
    console.log("Initializing Google API client...");
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    }).then(() => {
        console.log("Google API client initialized.");
        setupTokenClient();
    }, (error) => {
        console.error("Error during client initialization:", JSON.stringify(error, null, 2));
    });
}

function setupTokenClient() {
    console.log("Setting up token client...");
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            console.log("Token client callback triggered.");
            if (tokenResponse.error) {
                console.error("Error in token response:", tokenResponse.error);
                return;
            }
            accessToken = tokenResponse.access_token;
            console.log("Access token acquired:", accessToken);
            document.getElementById('fileInput').addEventListener('change', handleFileSelect);
        },
    });
}

function handleAuthClick() {
    console.log("Requesting access token...");
    tokenClient.requestAccessToken();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    console.log("File selected:", file);
    uploadFile(file);
}

function uploadFile(file) {
    if (!accessToken) {
        console.error("Error: Access token is not available.");
        return;
    }

    const metadata = {
        'name': file.name,
        'mimeType': file.type,
        'parents': ['YOUR_FOLDER_ID'] 
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {
        type: 'application/json'
    }));
    form.append('file', file);

    console.log("Uploading file...");
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + accessToken
        }),
        body: form,
    }).then((response) => {
        console.log("Upload response received.");
        return response.json();
    }).then((data) => {
        console.log("File uploaded successfully:", data);
        alert('File uploaded successfully!');
    }).catch((error) => {
        console.error("Error during file upload:", error);
    });
}

handleClientLoad();