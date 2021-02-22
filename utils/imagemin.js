const fs = require('fs').promises;
const { unlink } = fs;
const path = require('path');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
})

async function minifyImages(req, res, next) {
    const { file } = req;

    try {
        const files = await imagemin([`tmp/${file.filename}`], {
            destination: 'public/images',
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                quality: [0.6, 0.8]
            })
            ]
        })
        const [ava] = files;

        await cloudinary.uploader.upload(ava.destinationPath, function (error, result) {
            req.avatarURL = result.secure_url;
        });

        await unlink(req.file.path);
        await unlink(path.join(__dirname, `/../public/images/${file.filename}`))
        
        next();
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports = minifyImages