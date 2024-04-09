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
const pictureSaleFilePath = path.join(__dirname, 'PictureSale.json');


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


let isReadingOrWritingTagFile = false;
let isReadingOrWritingSellFile = false

async function writeTaggedJson(pictureData) {
    await waitForReadOrWriteToTag();
    isReadingOrWritingTagFile = true;
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(pictureData, null, 2));
        console.log('JSON file generated successfully.');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
    isReadingOrWritingTagFile = false;
    console.log("Done writing");
}

async function readTaggedImages() {
    await waitForReadOrWriteToTag();
    isReadingOrWritingTagFile = true;
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        console.log('Data read successfully.');
        return data;
    } catch (err) {
        console.error('Error reading taggedImages.json:', err);
        return "";
    } finally {
        isReadingOrWritingTagFile = false;
    }
}

function waitForReadOrWriteToSell() {
    return new Promise(resolve => {
        const checkReadOrWrite = () => {
            if (!isReadingOrWritingSellFile) {
                resolve();
            } else {
                setTimeout(checkReadOrWrite, 100); // Check again after a short delay
            }
        };
        checkReadOrWrite();
    });
}

async function writeSellJson(pictureData) {
    await waitForReadOrWriteToSell();
    isReadingOrWritingSellFile = true;
    try {
        await fs.writeFile(pictureSaleFilePath, JSON.stringify(pictureData, null, 2));
        console.log('JSON file generated successfully.');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
    isReadingOrWritingSellFile = false;
    console.log("Here: " , pictureData)
    console.log("Done writing");
}

async function readSellImages() {
    await waitForReadOrWriteToSell();
    isReadingOrWritingSellFile = true;
    try {
        const data = await fs.readFile(pictureSaleFilePath, 'utf8');
        console.log('Data read successfully.');
        return data;
    } catch (err) {
        console.error('Error reading taggedImages.json:', err);
        return "";
    } finally {
        isReadingOrWritingSellFile = false;
    }
}

function waitForReadOrWriteToTag() {
    return new Promise(resolve => {
        const checkReadOrWrite = () => {
            if (!isReadingOrWritingTagFile) {
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


app.post('/getImageUrls', (req, res) => {
    // Read the images directory and send the list of image filenames to the client
    const {imageList} = req.body
    console.log(imageList)
    res.header("Access-Control-Allow-Origin", "*");
    fs1.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            res.status(500).json({ error: 'Error reading images directory' });
        } else {
            const imageUrls = files
                .filter(file => imageList.includes(file))
                .map(file => ({
                    id: file, // You can use a unique identifier for each image, such as the filename
                    src: `http://localhost:3000/library_images/${file}` // Construct the URL for each image
                }));
            console.log(imageUrls)
            return res.status(200).json(imageUrls);
        }
    });
});


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

    appendToTaggedPictures()
});

// app.post('/submit-sale-info', async (req, res) => {
//     const pictureInfo = req.body;
//
//     try {
//         let currentData=[];
//         if (fs.existsSync(pictureSaleFilePath)) {
//             const existingData = await fs.promises.readFile(pictureSaleFilePath, 'utf-8');
//             currentData = JSON.parse(existingData);
//         }
//
//         currentData.push(...pictureInfo);
//
//         await fs.promises.writeFile(pictureSaleFilePath, JSON.stringify(currentData, null, 2));
//         res.status(200).json({ message: 'Picture posted for sale successfully.' });
//     }
//     catch (error) {
//         console.error("Failed to submit picture for sale.", error);
//         res.status(500).json({error: "An error occured while submitting picture for sale."});
//     }
// });

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

app.post('/updateSellInfo', async (req, res) => {
    const imageSellJson = req.body
    let currImgTags;
    const data = await readSellImages()
    try {
        // Parsing existing data
        if (data.length !== 0) {
            currImgTags = JSON.parse(data).pictures;
            for (const imageFile in imageSellJson) {
                currImgTags[imageFile] = imageSellJson[imageFile]
            }

            const pictureData = {"pictures": currImgTags};

            await writeSellJson(pictureData)
        }
        else{
            const pictureData = {"pictures": imageSellJson};

            await writeSellJson(pictureData)
        }
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        res.status(500).json({error: 'Internal Server Error'});
    }
    res.status(200).json("updated sell info")
});

app.get('/getListings', async (req, res) => {
    let currImgListings;
    const data = await readSellImages()
    try {
        // Parsing existing data
        if (data.length !== 0) {
            currImgListings = JSON.parse(data).pictures;

            console.log(currImgListings)
            return res.status(200).json(currImgListings)
        }
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        res.status(500).json({error: 'Internal Server Error'});
    }
    return res.status(200).json("done")
});


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

app.post('/getImagesByTags', async (req, res) => {
    const searchTags = req.body
    const data = await readTaggedImages()

    let jsonData;
    try {
        // Parsing existing data
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing JSON from taggedImages.json:', parseErr);
        return res.status(500).json({error: 'Internal Server Error'});
    }

    const imageKeys = Object.keys(jsonData.pictures);
    const matchingImages = imageKeys.filter(key => {
        const image = jsonData.pictures[key];
        return searchTags.every(tag => image.Tags.includes(tag));
    });
    console.log(matchingImages);

    fs1.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            return res.status(500).json({ error: 'Error reading images directory' });
        } else {
            const imageUrls = files
                .filter(file => matchingImages.includes(file))
                .map(file => ({
                    id: file, // You can use a unique identifier for each image, such as the filename
                    src: `http://localhost:3000/library_images/${file}` // Construct the URL for each image
                }));
            console.log(imageUrls)
            return res.status(200).json(imageUrls);
        }
    });
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

app.post('/deleteListing', async (req, res) => {
    const {image} = req.body;

    const data = await readSellImages()

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

    console.log("All picts: " , allPictures)

    delete allPictures[image];

    console.log("All picts: asdtert " , allPictures)

    const pictureData = {"pictures": allPictures}

    await writeSellJson(pictureData)

    res.status(200).json("done")
});
