// 오디오 객체들
let buttonClickAudio = null;
let storyAudio = null;
let gameAudio = null;
let clearAudio = null;

// 버튼 클릭 사운드 재생
function playButtonSound() {
    try {
        // 오디오 객체를 재사용하거나 새로 생성
        if (!buttonClickAudio) {
            buttonClickAudio = new Audio('sound/button_click.mp3');
            buttonClickAudio.volume = 1.0; // 볼륨 조절 (0.0 ~ 1.0)
        }
        
        // 현재 재생 중이면 처음부터 다시 재생
        buttonClickAudio.currentTime = 0;
        buttonClickAudio.play().catch(error => {
            // 오디오 재생 실패 시 무시 (사용자 상호작용 없이 재생 시도 등)
            console.log('Audio play failed:', error);
        });
    } catch (error) {
        console.log('Audio error:', error);
    }
}

// 스토리 배경음악 재생
function playStoryMusic() {
    try {
        // 게임 음악이 재생 중이면 중지
        if (gameAudio && !gameAudio.paused) {
            gameAudio.pause();
            gameAudio.currentTime = 0;
        }
        
        // 스토리 음악 재생
        if (!storyAudio) {
            storyAudio = new Audio('sound/story.mp3');
            storyAudio.volume = 0.5;
            storyAudio.loop = true; // 반복 재생
        }
        
        storyAudio.currentTime = 0;
        storyAudio.play().catch(error => {
            console.log('Story audio play failed:', error);
        });
    } catch (error) {
        console.log('Story audio error:', error);
    }
}

// 게임 배경음악 재생
function playGameMusic() {
    try {
        // 스토리 음악이 재생 중이면 중지
        if (storyAudio && !storyAudio.paused) {
            storyAudio.pause();
            storyAudio.currentTime = 0;
        }
        
        // 게임 음악 재생
        if (!gameAudio) {
            gameAudio = new Audio('sound/game.mp3');
            gameAudio.volume = 0.5;
            gameAudio.loop = true; // 반복 재생
        }
        
        gameAudio.currentTime = 0;
        gameAudio.play().catch(error => {
            console.log('Game audio play failed:', error);
        });
    } catch (error) {
        console.log('Game audio error:', error);
    }
}

// 클리어 사운드 재생
function playClearSound() {
    try {
        // 게임 음악이 재생 중이면 중지
        if (gameAudio && !gameAudio.paused) {
            gameAudio.pause();
            gameAudio.currentTime = 0;
        }
        
        // 클리어 사운드 재생 (반복 없음)
        if (!clearAudio) {
            clearAudio = new Audio('sound/clear.mp3');
            clearAudio.volume = 0.5;
        }
        
        clearAudio.currentTime = 0;
        clearAudio.play().catch(error => {
            console.log('Clear audio play failed:', error);
        });
    } catch (error) {
        console.log('Clear audio error:', error);
    }
}