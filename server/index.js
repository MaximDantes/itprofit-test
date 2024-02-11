/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { validators } from '../src/scripts/validation.js'

const PORT = process.env.PORT || 9090

const app = express()
app.use(express.json())
app.use(express.static('public'))

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

const status = {
    success: 'success',
    error: 'error',
}

app.listen(PORT, () => {
    console.log(`Server is started on ${PORT} port`)
})

app.get('/api/ping', (req, res) => {
    res.send({
        status: status.success,
        message: 'Server is ready',
    })
})

app.post('/api/message', (req, res) => {
    const { name, email, phone, message } = req.body

    const errors = {}
    for (let key in req.body) {
        const error = validators[key](req.body[key])

        if (error) errors[key] = error
    }

    const isSuccess = Math.random() > 0.5
    if (!isSuccess) {
        errors.email = 'Invalid email'
    }

    if (Object.keys(errors).length !== 0) {
        res.status(400)
        res.send({
            status: status.error,
            fields: errors,
        })
    } else {
        res.status(200)
        res.send({
            status: status.success,
            message: `message: ${name} ${email} ${phone} ${message}`,
        })
    }
})

app.post('/api/registration', (req, res) => {
    const isSuccess = Math.random() > 0.5

    if (isSuccess) {
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})
