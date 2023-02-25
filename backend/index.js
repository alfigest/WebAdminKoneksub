import express from 'express'
import routes from './routes/index.js'
import cors from 'cors'
import auth from './auth.js'
import * as firebase from "firebase/app"
import { db, firebaseConfig } from './config/database.js'
import compression from 'compression'
import path from 'path'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()
const upload = multer({ storage: multer.memoryStorage() })


firebase.initializeApp(firebaseConfig)

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use('/api/v1/', routes);
app.get('/auth', auth, (req, res) => {
  res.json({ message: "You are authorized to access" })
})


app.listen(5000, () => console.log('Server is running on port 5000'));

