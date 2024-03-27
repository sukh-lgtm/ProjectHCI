const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require("cors")

app.use(express.json())
app.use(cors())

const imagesDir = path.join(__dirname, '../library_images');
const deletedImagesDir = path.join(__dirname, '../deleted_images');
const jsonFilePath = path.join(__dirname, 'taggedPictures.json');


app.get('/test', (req, res) => {
    console.log("Successful")
    res.status(200).send("Test successful")
})

function generatePicturesJSON() {
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
        } else {
            const pictures = files.map(file => {
                const name = file.split('.')[0];
                const extension = path.extname(file);
                return {
                    name: name,
                    path: `/library_images/${file}`,
                    location: '',
                    date: '',
                    tags: []
                };
            });
            const data = { pictures };
            fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log('JSON file generated successfully.');
                }
            });
        }
    });
}

generatePicturesJSON();

// Endpoint to fetch images
app.get('/fetch-images', (req, res) => {
    // Read the images directory and send the list of image filenames to the client
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            res.status(500).json({ error: 'Error reading images directory' });
        } else {
            const images = files.map(file => ({
                id: file, // You can use a unique identifier for each image, such as the filename
                src: `http://localhost:3000/library_images/${file}` // Construct the URL for each image
            }));
            res.json({ images });
        }
    });
});
app.use(express.static('..'))

// Endpoint to move images
app.post('/delete-images', (req, res) => {
    // Assuming the client sends a list of image filenames to move
    console.log(req.body.imageFilenames)
    const imageFilenames = req.body.imageFilenames;

    // Move each image to the 'delete_images' folder
    imageFilenames.forEach(filename => {
        const sourcePath = path.join(imagesDir, filename);
        const destPath = path.join(deletedImagesDir, filename);

        fs.rename(sourcePath, destPath, err => {
            if (err) {
                console.error(`Error moving ${filename}: ${err}`);
            } else {
                console.log(`${filename} moved successfully to delete_images folder.`);
            }
        });
    });

    res.status(200).send("Images moved successfully.");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});