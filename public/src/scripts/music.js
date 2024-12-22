const musicBtn = document.body.querySelector('.music-btn');
const videoBtn = document.body.querySelector('.video-btn');
const imageBtn = document.body.querySelector('.image-btn');
const authBtn = document.body.querySelector('.auth-btn');
const authBtnMain = document.body.querySelector('#auth');

musicBtn.addEventListener('click', btnClickHandler);
videoBtn.addEventListener('click', btnClickHandler);
imageBtn.addEventListener('click', btnClickHandler);
authBtn.addEventListener('click', btnClickHandler);

// style="background-color: #c8c8c8; cursor: not-allowed"

function btnClickHandler(event){
    const src = event.currentTarget.getAttribute('data-src');
    if(src){
        window.location.href = src;
    }
}

async function getMusic(){
    const response = await fetch('/api/music');

    if(!response.ok) throw Object.assign(response, new Error());

    const data = await response.json();
    return data;
}

async function getImage(){
    const response = await fetch('/api/images');

    if(!response.ok) throw Object.assign(response, new Error());

    const data = await response.json();
    return data;
}

async function getVideos(){
    const response = await fetch('/api/videos');

    if(!response.ok) throw Object.assign(response, new Error());

    const data = await response.json();
    return data;
}

authBtnMain && authBtnMain.addEventListener('click', async () => {
    const login = document.body.querySelector('#login').value;
    const password = document.body.querySelector('#password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Включаем отправку и установку cookie
            body: JSON.stringify({ login, password }),
        });

        if (response.ok) {
            alert('Авторизация прошла успешно!');
            location.href = '/pages/music.html';
        } else {
            alert('Ошибка авторизации: Подсказка пароль и логин root');
            console.error(response);
        }
    } catch (error) {
        alert('Ошибка сети');
    }
});


function createMusicNode(music){
    const musicContainer = document.createElement('div');
    const musicTitle = document.createElement('span');
    const musicNode = document.createElement('audio');
    musicContainer.classList.add('music-wrapper');

    musicTitle.textContent = music.title
    musicNode.src = music.path;
    musicNode.controls = true;
    musicContainer.appendChild(musicTitle);    
    musicContainer.appendChild(musicNode);

    return musicContainer;
}

function createImageNode(image){
    const musicNode = document.createElement('img');
    musicNode.classList.add('image-preview');
    musicNode.src = image.path;
    return musicNode;
}

function createVideoNode(video){
    const videoNode = document.createElement('video');
    videoNode.controls = true;
    videoNode.classList.add('video-preview');
    videoNode.src = video.path;
    return videoNode;
}

async function appendMusic(){
    try{
        const allMusic = await getMusic();
        musicBtn.setAttribute('disabled', true);
        musicBtn.style = 'background-color: #c8c8c8; cursor: not-allowed';
        
        allMusic.forEach(item => {
            const musicNode = createMusicNode(item);
            document.body.querySelector('content > main').appendChild(musicNode);
        })
    }
    catch(err){
        if(err.status === 401){
            alert('Вы не авторизованы');
            location.href = '/pages/auth.html';
        }
    }
}

async function appendImage(){
    try{
        const allImage = await getImage();
        imageBtn.setAttribute('disabled', true);
        imageBtn.style = 'background-color: #c8c8c8; cursor: not-allowed';
        
        allImage.forEach(item => {
            const musicNode = createImageNode(item);
            document.body.querySelector('content > main').appendChild(musicNode);
        })
    }
    catch(err){
        if(err.status === 401){
            alert('Вы не авторизованы');
            location.href = '/pages/auth.html';
        }
    }
}

async function appendVideos(){
    try{
        const allVideos = await getVideos();
        videoBtn.setAttribute('disabled', true);
        videoBtn.style = 'background-color: #c8c8c8; cursor: not-allowed';
        
        allVideos.forEach(item => {
            const musicNode = createVideoNode(item);
            document.body.querySelector('content > main').appendChild(musicNode);
        })
    }
    catch(err){
        if(err.status === 401){
            alert('Вы не авторизованы');
            location.href = '/pages/auth.html';
        }
    }
}

window.onload = function(){
    const location = window.location.href;

    if(location.includes('music.html')){
        return appendMusic();
    }

    if(location.includes('images.html')){
        return appendImage();
    }

    if(location.includes('videos.html')){
        return appendVideos();
    }

    if(location.includes('auth.html')){
        return;
    }
}