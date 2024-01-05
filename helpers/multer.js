const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'image' || file.fieldname === 'document') {
        cb(null, true);
      }
    },
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB upload limit
    fileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx', 'xls', 'ppt'], // Allowed extensions
    //Allowed mimetypes
    type: [
        'image/*',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Modern Word (.docx)
        'application/vnd.ms-excel', // Microsoft Excel (.xls)
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Modern Excel (.xlsx)
        'application/vnd.ms-powerpoint', // Microsoft PowerPoint (.ppt)
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // Modern PowerPoint (.pptx)
        'application/vnd.oasis.opendocument.text', // OpenDocument Text (.odt)
        'application/vnd.oasis.opendocument.spreadsheet', // OpenDocument Spreadsheet (.ods)
        'application/vnd.oasis.opendocument.presentation', // OpenDocument Presentation (.odp)
        'application/rtf', // Rich Text Format (.rtf)
        'application/zip', // ZIP Archive (.zip)
        'application/x-rar-compressed' // RAR Archive (.rar)
      ], 
  });
  

module.exports = { upload }