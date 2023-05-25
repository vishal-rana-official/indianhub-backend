const mongoose = require('mongoose')

const connection = async () => {
    const mongoURi = 'mongodb+srv://vishalrana:vishal101@cluster0.ao850z6.mongodb.net/'
    await mongoose.connect(mongoURi, { dbName: "indianhub" }, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('mongodb connected successfully')
}

module.exports = connection  