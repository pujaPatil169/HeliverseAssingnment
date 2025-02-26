const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'hotel-booking',
      use_filename: true,
      unique_filename: false
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

const deleteImage = async (url) => {
  try {
    const publicId = url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`hotel-booking/${publicId}`);
  } catch (error) {
    throw new Error('Image deletion failed');
  }
};

module.exports = {
  uploadImage,
  deleteImage
};
