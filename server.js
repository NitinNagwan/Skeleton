require('dotenv').config()
const express = require('express')
const cors = require("cors")
const mongoose = require('mongoose')
const logger = require('./logger')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const router = require('./routes/index')
const httpLogger = require('./httpLogger')
const url = `mongodb+srv://nitinnagwan:${process.env.MONGO_PASSWORD}@cluster0.zh7hk.mongodb.net/?retryWrites=true&w=majority`

const PORT = process.env.PORT || 4000
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


mongoose.set("useCreateIndex", true);

const conn = mongoose.connection

conn.once('open', () =>{
    console.log('connected....')
})

const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "node API's",
            version: '1.0.0',
            description: "A simple express Api"
        },
        servers:[
            {
                url: "http://localhost:4000"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = express()
app.use(httpLogger)
app.use("/api",swaggerUI.serve, swaggerUI.setup(specs))

app.use(cors())
app.use(express.json())

app.use('/v1/api', router)

try{
    app.listen(PORT, ()=>{
       logger.info(`Listening on port: ${PORT}`)
    })
}catch(err){
    console.log(err)
}