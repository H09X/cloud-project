const CLIENT_ID = '317568144806-ior04rcrarhqen3jru2g06spi19vt3vl.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCZ08vaCREHsmbj7g-_Ny8JDYro5JPOQZQ';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function handleClientLoad() {
    console.log("Loading Google API client...");
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    console.log("Initializing Google API client...");
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      console.log("Google API client initialized.");
      gapi.auth2.getAuthInstance().signIn().then(() => {
        console.log("User signed in.");
        document.getElementById('fileInput').addEventListener('change', handleFileSelect);
      });
    }, (error) => {
      console.error("Error during client initialization:", JSON.stringify(error, null, 2));
    });
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    console.log("File selected:", file);
    uploadFile(file);
  }

  function uploadFile(file) {
    const metadata = {
      'name': file.name,
      'mimeType': file.type
    };

    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    console.log("Uploading file...");
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
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