import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/music', express.static('music'));
app.use('/videos', express.static('videos'));
app.use('/images', express.static('images'));

app.use(express.json({limit: '20mb'}));
app.use(cookieParser()); // Подключаем cookie-parser

const router = express.Router();

function authCookie(req, res, next) {
    const authCookie = req.cookies['auth'];
    if (authCookie) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

// Маршрут для авторизации
router.post('/login', (req, res) => {
    const { login, password } = req.body;

    // Проверяем логин и пароль
    if (login === 'root' && password === 'root') {
        // Устанавливаем cookie
        res.cookie('auth', 'true', { httpOnly: true, secure: false }); // secure: true для HTTPS
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

//музыка
router.get('/music', authCookie, async (req, res) => {
    const allMusicFiles = await fs.readdir('music');
    const musicWithPath = allMusicFiles.map(file => ({
        title: file.split('.')[0],
        path: `/music/${file}`
    }));

    res.status(200).send(musicWithPath);
});

//видео
router.get('/videos', authCookie, async (req, res) => {
    const allPhotos = await fs.readdir('videos');
    const allPhotosWithPath = allPhotos.map(file => ({
        title: file.split('.')[0],
        path: `/videos/${file}`
    }));

    res.status(200).send(allPhotosWithPath);
});

//картинки
router.get('/images', authCookie, async (req, res) => {
    const allPhotos = await fs.readdir('images');
    const allPhotosWithPath = allPhotos.map(file => ({
        title: file.split('.')[0],
        path: `/images/${file}`
    }));

    res.status(200).send(allPhotosWithPath);
});

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});