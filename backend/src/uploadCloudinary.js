const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

const doUpload = (publicId, req, res, next) => {
	const uploadStream = cloudinary.uploader.upload_stream(result => {    	
         // capture the url and public_id and add to the request
         req.fileurl = result.url
         req.fileid = result.public_id
         next()
	}, { public_id: req.username+publicId+(new Date().getTime())})


	// multer can save the file locally if we want
	// instead of saving locally, we keep the file in memory
	// multer provides req.file and within that is the byte buffer

	// we create a passthrough stream to pipe the buffer
	// to the uploadStream function for cloudinary.
	const s = new stream.PassThrough()
    if(req.file===undefined){
        s.end(req.files['image'][0].buffer)
    }else{
        s.end(req.file.buffer)
    }
	s.pipe(uploadStream)
	s.on('end', uploadStream.end)
	// and the end of the buffer we tell cloudinary to end the upload.
}

/*const uploadImage = (publicId) => (req, res, next) => {
    multer().single('image')(req, res, () =>
        doUpload(publicId, req, res, next))
}*/
const uploadImage = (publicId) => (req, res, next) => {
    // Check if Content-Type is 'multipart/form-data'
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        multer().fields([{ name: 'image' }, { name: 'text' }])(req, res, (error) => {
            // Handle image upload
            if (req.files && req.files['image'][0]) {
                doUpload(publicId, req, res, next);
            }
        });
    } else {
        // Handle JSON payload
        next();
    }
};

module.exports = uploadImage;

