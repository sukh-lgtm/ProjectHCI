const express = require('express');
const fs = require('fs').promises;
const fs1 = require('fs');
const path = require('path');
const app = express();
const cors = require("cors")
const multer = require('multer');
const {formToJSON} = require("axios");
const taggedPicturesFile = './taggedPictures.json';

app.use(express.json())
app.use(cors())

const imagesDir = path.join(__dirname, '../library_images');
const deletedImagesDir = path.join(__dirname, '../deleted_images');
const jsonFilePath = path.join(__dirname, 'taggedPictures.json');
const albumsJSON = path.join(__dirname, '../api/albums.json');


app.get('/test', (req, res) => {
    res.status(200).send("Test successful")
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../library_images/');
    },
    filename: function (req, file, cb) {
        // Append a timestamp to ensure unique filenames
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname.split('.')[0];
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


let isReadingOrWriting = false;

async function writeTaggedJson(pictureData) {
    await waitForReadOrWrite();
    isReadingOrWriting = true;
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(pictureData, null, 2));
        console.log('JSON file generated successfully.');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
    isReadingOrWriting = false;
    console.log("Done writing");
}

async function readTaggedImages() {
    await waitForReadOrWrite();
    isReadingOrWriting = true;
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        console.log('Data read successfully.');
        return data;
    } catch (err) {
        console.error('Error reading taggedImages.json:', err);
        return "";
    } finally {
        isReadingOrWriting = false;
    }
}

function waitForReadOrWrite() {
    return new Promise(resolve => {
        const checkReadOrWrite = () => {
            if (!isReadingOrWriting) {
                resolve();
            } else {
                setTimeout(checkReadOrWrite, 100); // Check again after a short delay
            }
        };
        checkReadOrWrite();
    });
}


function appendToTaggedPictures() {
    fs1.readdir(imagesDir,  (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
        } else {
            fs1.readFile(jsonFilePath, async (err, data) => {
                if (err) {
                    console.error('Error reading tagged pictures file:', err);
                } else {
                    const pictures = {};
                    if (data.length !== 0) {
                        const taggedPictures = JSON.parse(data);
                        files.forEach(file => {
                            if (!taggedPictures.pictures.hasOwnProperty(file)) {
                                const extension = path.extname(file);
                                pictures[file] = {
                                    Path: `/library_images/${file}`,
                                    Name: '',
                                    Location: '',
                                    Date: '',
                                    Tags: []
                                };
                            } else {
                                pictures[file] = {
                                    Path: taggedPictures.pictures[file].Path,
                                    Name: taggedPictures.pictures[file].Name,
                                    Location: taggedPictures.pictures[file].Location,
                                    Date: taggedPictures.pictures[file].Date,
                                    Tags: taggedPictures.pictures[file].Tags
                                };
                            }
                        });

                        const pictureData = {pictures};

                        await writeTaggedJson(pictureData)
                    } else {
                        files.forEach(file => {
                            pictures[file] = {
                                Path: `/library_images/${file}`,
                                Name: '',
                                Location: '',
                                Date: '',
                                Tags: []
                            };
                        });
                        const pictureData = {pictures};

                        await writeTaggedJson(pictureData)
                    }

                }
            });
        }
    })
}





// Endpoint to fetch images
app.get('/fetch-images', (req, res) => {
    // Read the images directory and send the list of image filenames to the client
    res.header("Access-Control-Allow-Origin", "*");
    fs1.readdir(imagesDir, (err, files) => {
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

// Endpoint to fetch deleted images
app.get('/fetch-deleted-images', (req, res) => {
    // Read the images directory and send the list of image filenames to the client
    res.header("Access-Control-Allow-Origin", "*");
    fs1.readdir(deletedImagesDir, (err, files) => {
        if (err) {
            console.error('Error reading deleted images directory:', err);
            res.status(500).json({ error: 'Error reading deleted images directory' });
        } else {
            const images = files.map(file => ({
                id: file, // You can use a unique identifier for each image, such as the filename
                src: `http://localhost:3000/deleted_images/${file}` // Construct the URL for each image
            }));
            res.json({ images });
        }
    });
});

// Endpoint to fetch albums
app.get('/fetch-albums', (req, res) => {
    // Read the albums json and send the list of albums to the client

    const fileJSON = JSON.parse(fs1.readFileSync(albumsJSON))
    const fileWithLocalhostPathJSON = fileJSON.albums;
    for (album of fileWithLocalhostPathJSON) {
        for (image of album.images) {
            image.src = "http://localhost:3000/" + image.src;
        }
    }
    if(!fileWithLocalhostPathJSON) {
        res.status(500).json({ error: 'Error reading albums json' });
    }
    else {
        res.json(fileWithLocalhostPathJSON)
    }

});

app.use(express.static('..'))

// Endpoint to move images
app.post('/delete-images', (req, res) => {
    // Assuming the client sends a list of image filenames to move
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
        let albumsFile = JSON.parse(fs1.readFileSync(albumsJSON))
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
        fs1.writeFileSync(albumsJSON, JSON.stringify(albumsFileNew, null, 2));
    });

    //go through albums, if there are any albums that are "empty", make sure to delete the album itself (i.e., don't copy it)
    let albumsFile = JSON.parse(fs1.readFileSync(albumsJSON))
    let albumsFileNew = JSON.parse('{"albums": []}')
    for (let i = 0; i < albumsFile.albums.length; i++) { 
        console.log("album: " + albumsFile.albums[i].title + " size: " + albumsFile.albums[i].images.length)
        if(albumsFile.albums[i].images.length > 0) {
            albumsFileNew.albums.push({
                title: albumsFile.albums[i].title,
                images: albumsFile.albums[i].images
            });
        }
    }
    fs1.writeFileSync(albumsJSON, JSON.stringify(albumsFileNew, null, 2));

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

    appendToTaggedPictures()
});

app.post('/create-album', (req, res) => {
    // Check if files are present in the request
    if (!req.body.imageFilenames || req.body.imageFilenames.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }
    if(req.body.newAlbumName == "") {
        return res.status(400).json({ error: 'Invalid album name.' });
    }

    try {
        //first, open the file in read only mode, to extract information about current albums
        fileJSON = JSON.parse(fs1.readFileSync(albumsJSON));

        for (album of fileJSON.albums) {
            if (album.title == req.body.newAlbumName) {
                return res.status(400).json({ error: "Album name already exists." })
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

        //now, truncate the file, and write the new JSON, which includes the newly created album
        fs1.writeFileSync(albumsJSON, JSON.stringify(fileJSON, null, 2))

        // Respond with success message and list of uploaded files
        return res.status(200).json({ message: 'Album created successfully' });
    } catch (err) {
        fs1.writeFileSync(albumsJSON, '{ "albums": [] }')
        return res.status(400).json({ error: `error creating album: ` + err });
    }

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.post('/currentImageTags', async (req, res) => {
    const {images} = req.body;
    console.log("Received current images tags request")
    const data = await readTaggedImages()
    let jsonData;
    try {
        jsonData = JSON.parse(data);
        const pictureData = jsonData.pictures
        const pictures = {};
        images.forEach(image => {
            pictures[image] = {
                Path: pictureData[image].Path,
                Name: pictureData[image].Name,
                Location: pictureData[image].Location,
                Date: pictureData[image].Date,
                Tags: pictureData[image].Tags
            };

        })
        res.status(200).json(pictures)
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


app.post('/updateSeparateTags', async (req, res) => {
    const separateImageTagJson = req.body
    let currImgTags;
    const data = await readTaggedImages()
    try {
        // Parsing existing data
        if (data.length !== 0) {
            currImgTags = JSON.parse(data).pictures;
            for (const imageFile in separateImageTagJson) {
                currImgTags[imageFile] = separateImageTagJson[imageFile]
            }

            const pictureData = {"pictures": currImgTags};

            await writeTaggedJson(pictureData)
        }
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        res.status(500).json({error: 'Internal Server Error'});
    }
    res.status(200).json("done")
});


app.post('/updateCommonTags', async (req, res) => {
    const {images, Location, Date, Tags} = req.body;

    const data = await readTaggedImages()

    let jsonData;
    try {
        // Parsing existing data
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        res.status(500).json({error: 'Internal Server Error'});
        return;
    }

    const allPictures = jsonData.pictures
    images.forEach(image => {
        if(Location.length > 0){
            allPictures[image].Location = Location
        }

        if(Date.length > 0){
            allPictures[image].Date = Date
        }
        if(jsonData.pictures[image].Tags.length !== 0){
            const mergedTags = [...Tags, ...jsonData.pictures[image].Tags];
            allPictures[image].Tags = Array.from(new Set(mergedTags));
        }
        else{
            allPictures[image].Tags = Tags
        }
    });

    const pictureData = {"pictures": allPictures}

    await writeTaggedJson(pictureData)

    res.status(200).json("done")
});

app.post('/deleteTag', async (req, res) => {
    const {images, tag} = req.body;

    const data = await readTaggedImages()

    let jsonData;
    try {
        // Parsing existing data
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        res.status(500).json({error: 'Internal Server Error'});
        return;
    }

    const allPictures = jsonData.pictures

    images.forEach(image => {
        const currTags = [...jsonData.pictures[image].Tags];
        const currTagsSet = new Set(currTags)
        currTagsSet.delete(tag)
        allPictures[image].Tags = Array.from(new Set(currTagsSet));
    })


    const pictureData = {"pictures": allPictures}

    await writeTaggedJson(pictureData)

    res.status(200).json("done")
});

appendToTaggedPictures()