import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { register, login, getProfile, listUsers } from './controllers/userController';
import { authenticate } from './middleware/auth';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

app.use(express.json());

app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/users', authenticate, listUsers);
app.get('/users/me', authenticate, getProfile);

// Servir arquivos estáticos da pasta atual (onde está index.html)
app.use(express.static(path.join(__dirname)));

// Endpoint raiz que serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
