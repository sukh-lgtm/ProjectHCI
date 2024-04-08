const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require("cors")
const multer = require('multer');

app.use(express.json())
app.use(cors())

const imagesDir = path.join(__dirname, '../library_images');
const deletedImagesDir = path.join(__dirname, '../deleted_images');
const jsonFilePath = path.join(__dirname, 'taggedPictures.json');
const pictureSaleFilePath = path.join(__dirname, 'PictureSale.json');


app.get('/test', (req, res) => {
    console.log("Successful")
    res.status(200).send("Test successful")
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../library_images/');
    },
    filename: function (req, file, cb) {
        // Append a timestamp to ensure unique filenames
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


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

    // Move each image to the 'delete_images' folder8
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

app.post('/upload', upload.array('files'), (req, res) => {
    // Check if files are present in the request
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    // Process uploaded files
    const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        path: file.path
    }));

    // Respond with success message and list of uploaded files
    res.status(200).json({ message: 'Files uploaded successfully', uploadedFiles });
});

app.post('/submit-sale-info', async (req, res) => {
    const pictureInfo = req.body;

    try {
        let currentData=[];
        if (fs.existsSync(pictureSaleFilePath)) {
            const existingData = await fs.promises.readFile(pictureSaleFilePath, 'utf-8');
            currentData = JSON.parse(existingData);
        }

        currentData.push(...pictureInfo);

        await fs.promises.writeFile(pictureSaleFilePath, JSON.stringify(currentData, null, 2));
        res.status(200).json({ message: 'Picture posted for sale successfully.' });
    }
    catch (error) {
        console.error("Failed to submit picture for sale.", error);
        res.status(500).json({error: "An error occured while submitting picture for sale."});
    }
}); 

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});