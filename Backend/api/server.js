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
const albumsJSON = path.join(__dirname, '../api/albums.json');


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

// Endpoint to fetch albums
app.get('/fetch-albums', (req, res) => {
    // Read the albums json and send the list of albums to the client
    fs.readFile(albumsJSON, (err, file) => {
        if (err) {
            console.error('Error reading albums JSON: ', err);
            res.status(500).json( {error: 'Error reading albums JSON'});
        }
        else {
            const fileJSON = JSON.parse(file.toString());
            const fileWithLocalhostPathJSON = fileJSON.albums;
            for (album of fileWithLocalhostPathJSON) {
                for (image of album.images) {
                    image.src = "http://localhost:3000/" + image.src;
                }
            }
            res.json(fileWithLocalhostPathJSON);
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

        //for each image to be deleted, remove it from any albums it is in
        let albumsFile = JSON.parse(fs.readFileSync(albumsJSON))
        let albumsFileNew = JSON.parse('{"albums": []}')

        //copying albumsFile into albumsFileNew, but only if we are NOT deleting the image
        for (let i = 0; i < albumsFile.albums.length; i++) { 
            albumsFileNew.albums.push({
                title: albumsFile.albums[i].title,
                images: []
            })
            for (let j = 0; j < albumsFile.albums[i].images.length; j++) {
                if (filename !== albumsFile.albums[i].images[j].fileName) {
                    albumsFileNew.albums[i].images.push(albumsFile.albums[i].images[j])
                }
            }
        }
        fs.writeFileSync(albumsJSON, JSON.stringify(albumsFileNew, null, 2));
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

app.post('/create-album', (req, res) => {
    // Check if files are present in the request
    if (!req.body.imageFilenames || req.body.imageFilenames.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }
    if(req.body.newAlbumName == "") {
        return res.status(400).json({ error: 'Invalid album name.' });
    }

    //first, open the file in read only mode, to extract information about current albums
    const promiseReadAlbum = new Promise((resolve, reject) => {
        fs.readFile(albumsJSON, (err, file) => {
                if (err) {
                    console.error('Error reading albums JSON: ', err);
                    res.status(500).json( {error: 'Error reading albums JSON'});
                    reject();
                }
                else {
                    fileJSON = JSON.parse(file.toString());
                    //check for duplicate album title before creating new album
                    for (album of fileJSON.albums) {
                        if(album.title == req.body.newAlbumName) {
                            res.status(400).json( {error: "Album name already exists."})
                            reject();
                        }
                    }
                    let newAlbum = {
                        title: req.body.newAlbumName,
                        images: req.body.imageFilenames.map(imageName => ({
                            fileName: imageName, //construct image name
                            src: `library_images/${imageName}`, // Construct the URL for each image
                            location: "",
                            date: "",
                            tags: []
                            })),
                    };
                    fileJSON.albums.push(newAlbum);
                    resolve(fileJSON);
                }
            });
        });

    //now, truncate the file, and write the new JSON, which includes the newly created album
    promiseReadAlbum.then((val) => {
        fs.open(albumsJSON, "w", (err, file) => {
            if(err) {
                console.error('Error when adding new album to albums JSON: ', err)
                res.status(500).json( {error: 'Error writing to albums JSON'});
            }
            else {
                fs.write(file, JSON.stringify(val, null, 2), (err, bytes) => {
                    if(err) 
                        console.error(err);
                });

                // Respond with success message and list of uploaded files
                res.status(200).json({ message: 'Album created successfully' });
            }
        });
    });

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});