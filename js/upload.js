document.getElementById('uploadButton').addEventListener('click', async (event) => {
    event.preventDefault();
    await uploadFiles();
});

async function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Please select a file.');
        return;
    }

    for (const file of files) {
        const fileName = file.name;
        const mimeType = file.type || 'application/octet-stream';
        const fileContent = await readFileAsBase64(file);

        const payload = {
            Records: [{
                fileName: fileName,
                fileContent: fileContent,
                mimeType: mimeType
            }]
        };

        console.log('Payload:', payload);

        try {
            await sendToLambda(payload);
        } catch (error) {
            console.error('Error uploading file:', fileName, error);
            alert('There was an error uploading the file: ' + fileName);
        }
    }
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function sendToLambda(payload) {
    try {
        const response = await fetch('https://spxagiyh5f.execute-api.us-east-1.amazonaws.com/prod/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Network response was not ok:', errorText);
            throw new Error('Network response was not ok: ' + errorText);
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('Files uploaded successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to upload files: ' + error.message);
        throw error;
    }
}