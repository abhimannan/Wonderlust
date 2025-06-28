// this file is used to access the cloudinary cloud for storing the data in cloud

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configaration of cloud variables - accessing the data from cloudanary cloud platform
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

// below code from the multer-storage-cloudanary package
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust_DEV',
    allowredFormats : ["png","jpg","jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage,
}