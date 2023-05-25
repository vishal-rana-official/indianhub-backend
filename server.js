const express = require('express')
const connection = require('./db')
const cors = require('cors')
const Video = require('./Image')
const cloudinary = require('./cloudinary')
const bodyParser = require('body-parser')
const upload = require('./multer')

const app = express()

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors())
app.use(express.json())
const port = 8080

connection()

app.get('/videoDetail', async (req, res) => {
    try {
        const { id } = req.query
        const response = await Video.findById(id)
        res.status(200).json({ message: "success", response })
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/all', async (req, res) => {
    try {
        const { page } = req.query;
        const pageSize = 20
        const skip = (page - 1) * pageSize
        const response = await Video.find().skip(skip).limit(pageSize)
        const totalVideos = await Video.countDocuments()
        const count = response.length
        res.status(200).json({ response, count, totalVideos })

    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/topvideos', async (req, res) => {
    try {
        const { page } = req.query;
        const pageSize = 20
        const skip = (page - 1) * pageSize
        const response = await Video.find().sort({ views: -1 }).skip(skip).limit(pageSize)
        const totalVideos = await Video.countDocuments()
        const count = response.length
        res.status(200).json({ response, count, totalVideos })

    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/latestvideos', async (req, res) => {
    try {
        const { page } = req.query;
        const pageSize = 20
        const skip = (page - 1) * pageSize
        const response = await Video.find().sort({ latest: -1 }).skip(skip).limit(pageSize)
        const totalVideos = await Video.countDocuments()
        const count = response.length
        res.status(200).json({ response, count, totalVideos })

    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/category', async (req, res) => {
    try {
        const { category, page } = req.query
        const pageSize = 20
        const skip = (page - 1) * pageSize
        let response
        if (category === 'all') {
            response = await Video.find({}).skip(skip).limit(pageSize)
            const totalVideos = await Video.countDocuments()
            const count = response.length
            return res.status(200).json({ response, count, totalVideos })
        } else {
            response = await Video.find({ category: category }).skip(skip).limit(pageSize)
            const totalVideos = await Video.countDocuments({category: category})
            const count = response.length
            return res.status(200).json({ response, count, totalVideos })
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const { image, videoTitle, category, views, latest } = req.body
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "video",
        })
        console.log(result.url)
        const result2 = await cloudinary.uploader.upload(image, {
            folder: "sample_images"
        })
        console.log(res.url)
        const createdVideo = await Video.create({
            imageUrl: result2.url,
            videoTitle: videoTitle,
            videoUrl: result.url,
            category: category,
            latest: latest,
            views: views
        })
        return res.status(200).json({ msg: 'video uploaded', createdVideo })

    } catch (error) {
        res.status(500).json(error)
    }
})

app.listen(port, () => {
    console.log(`server connected to http://localhost:${port}`)
})

