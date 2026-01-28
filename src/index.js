const express = require("express")
require("dotenv").config();

const app = express()
const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
    res.send({
        message: 'Home'
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`)
})