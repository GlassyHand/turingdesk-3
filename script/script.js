// 게임 상태 관리
const gameState = {
    currentStage: 1,
    correctCount: 0,
    wrongCount: 0,
    unlockedStages: [1], // 기본적으로 1days만 열림
    minCorrectToUnlock: 15, // 다음 스테이지 해제를 위한 최소 정답 수
    usedImages: [] // 현재 스테이지에서 사용된 이미지 목록
};




// localStorage에서 진행도 로드
function loadProgress() {
const saved = localStorage.getItem('turingDeskProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        gameState.unlockedStages = progress.unlockedStages || [1];
        // 스테이지 버튼 업데이트
        updateStageButtons();}}

// 진행도 저장
function saveProgress() {
    localStorage.setItem('turingDeskProgress', JSON.stringify({
        unlockedStages: gameState.unlockedStages
    }));}

// 화면 전환
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 스테이지 버튼 업데이트
function updateStageButtons() {
    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`stage-${i}`);
        if (gameState.unlockedStages.includes(i)) {
            btn.classList.remove('locked');
            btn.textContent = `${i} DAYS`;
        } else {
            btn.classList.add('locked');
            btn.textContent = '???';
        }
    }
}

// 스테이지 스토리 표시
let currentStoryIndex = 0;
let currentStory = [];

function showStory(stage) {
    // 스토리 배경음악 재생
    playStoryMusic();
    
    const storyText = document.getElementById('story-text');
    const characterPortrait = document.getElementById('character-portrait');
    const characterName = document.getElementById('character-name');
    const story = stories[stage] || [];
    currentStory = story;
    currentStoryIndex = 0;

    function displayNextLine() {
        if (currentStoryIndex < currentStory.length) {
            const dialogue = currentStory[currentStoryIndex];
            
            // 대사 표시
            if (typeof dialogue === 'string') {
                // 기존 형식 (문자열만 있는 경우)
                storyText.textContent = dialogue;
                characterName.textContent = '';
                characterPortrait.classList.remove('senior', 'player');
            } else {
                // 새로운 형식 (화자 정보 포함)
                storyText.textContent = dialogue.text;
                const character = characters[dialogue.speaker];
                if (character) {
                    characterName.textContent = character.name;
                    // 기본 클래스 설정
                    let portraitClasses = 'character-portrait ' + dialogue.speaker;
                    
                    // 표정 클래스 추가 (senior 또는 player)
                    if (dialogue.expression) {
                        portraitClasses += ' ' + dialogue.expression;
                    }
                    
                    characterPortrait.className = portraitClasses;
                }
            }
            
            currentStoryIndex++;
        } else {
            // 스토리 종료, 게임 시작
            // 스토리 음악 중지 후 게임 음악 재생
            if (storyAudio && !storyAudio.paused) {
                storyAudio.pause();
                storyAudio.currentTime = 0;
            }
            startGame(stage);
        }
    }

    // 초기 표시
    displayNextLine();

    // Next 버튼 이벤트 재설정
    const nextBtn = document.getElementById('story-next-btn');
    nextBtn.onclick = displayNextLine;
}

// 랜덤 이름 생성
const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
const lastNames = ['민준', '서준', '도윤', '예준', '시우', '주원', '하준', '지호', '건우', '준서', '현우', '지훈', '우진', '선우', '연우', '서연', '서윤', '지우', '서현', '민서', '하은', '윤서', '지유', '채원', '지원'];

function generateRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName}${lastName}`;}

// 출신지 데이터 (광역자치단체별로 분류)
const locations = {
    '강원특별자치도': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
    '경기도': ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
    '경상남도': ['거제시', '거창군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'],
    '경상북도': ['경산시', '경주시', '고령군', '구미시', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'],
    '광주광역시': ['광산구', '광주광역시 남구', '광주광역시 동구', '광주광역시 북구', '광주광역시 서구'],
    '대구광역시': ['군위군', '대구광역시 남구', '달서구', '달성군', '대구광역시 동구', '대구광역시 북구', '대구광역시 서구', '수성구', '대구광역시 중구'],
    '대전광역시': ['대덕구', '대전광역시 동구', '대전광역시 서구', '대전광역시 유성구', '대전광역시 중구'],
    '부산광역시': ['강서구', '금정구', '기장군', '부산광역시 남구', '부산광역시 동구', '동래구', '부산진구', '부산광역시 북구', '사상구', '사하구', '부산광역시 서구', '수영구', '연제구', '영도구', '부산광역시 중구', '해운대구'],
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '서울특별시 중구', '중랑구'],
    '세종특별자치시': ['세종시'],
    '울산광역시': ['울산광역시 남구', '울산광역시 동구', '울산광역시 북구', '울주군', '울산광역시 중구'],
    '인천광역시': ['강화군', '계양구', '인천광역시 동구', '미추홀구', '남동구', '부평구', '인천광역시 서구', '연수구', '옹진군', '인천광역시 중구'],
    '전라남도': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
    '전북특별자치도': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'],
    '충청남도': ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'],
    '충청북도': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시', '충주시']
};

// 랜덤 출신지 생성
function generateRandomLocation(stage) {
    const rule = getStageRule(stage);
    
    // 거부할 출신지가 설정되어 있고, 확률에 맞으면 거부할 출신지 선택
    let isBlockedProvince = false;
    if (rule.blockedProvinces.length > 0 && rule.blockedProvinceProbability > 0) {
        isBlockedProvince = Math.random() < rule.blockedProvinceProbability;
    }
    
    let province, city;
    if (isBlockedProvince) {
        // 거부할 출신지 중 랜덤 선택
        const blockedProvince = rule.blockedProvinces[Math.floor(Math.random() * rule.blockedProvinces.length)];
        province = blockedProvince;
        city = locations[province][Math.floor(Math.random() * locations[province].length)];
    } else {
        // 허용된 지역 출신
        const provinces = Object.keys(locations);
        // 거부할 출신지 제외한 지역 중 선택
        const allowedProvinces = provinces.filter(p => !rule.blockedProvinces.includes(p));
        province = allowedProvinces[Math.floor(Math.random() * allowedProvinces.length)];
        city = locations[province][Math.floor(Math.random() * locations[province].length)];
    }
    
    // 시/군/구만 반환 (광역자치단체는 제외)
    return {
        city: city,
        province: province
    };
}

// 랜덤 만료기한 생성
function generateRandomExpiry(stage) {
    // 기본값: 항상 2100~2200 범위
    let startYear = 2100;
    let endYear = 2200;
    
    const rule = getStageRule(stage);
    
    // 3일차에서만 특별 처리
    if (stage === 3 && rule.blockedExpiryYear) {
        // 7% 확률로 금지 만료기한 생성 (2100~2125)
        if (Math.random() < 7/100) {
            startYear = 2100;
            endYear = rule.blockedExpiryYear; // 2125
        } else {
            // 나머지는 정상 만료기한 (2126~2200)
            startYear = 2126;
            endYear = 2200;
        }
    }
    // 1일차, 2일차, 4일차, 5일차는 2100~2200 전체 범위
    
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    
    return `${year}.${monthStr}.${dayStr}`;
}

// 현재 캐릭터 데이터
let currentCharacter = null;

// 캐릭터 이미지 목록 (normal과 robot으로 분류)
const characterImages = {
    normal: [
        'characters/1-normal.png',
        'characters/2-normal.png',
        'characters/3-normal.png',
        'characters/4-normal.png',
        'characters/5-normal.png',
        'characters/6-normal.png',
        'characters/7-normal.png',
        'characters/8-normal.png',
        'characters/9-normal.png',
        'characters/10-normal.png',
        'characters/11-normal.png',
        'characters/12-normal.png',
        'characters/13-normal.png',
        'characters/14-normal.png',
        'characters/15-normal.png',
        'characters/16-normal.png'
    ],
    robot: [
        'characters/1-robot1.png',
        'characters/1-robot2-arm.png',
        'characters/2-robot1.png',
        'characters/3-robot1-arm.png',
        'characters/3-robot2.png',
        'characters/4-robot1.png',
        'characters/4-robot2.png',
        'characters/5-robot1-arm.png',
        'characters/5-robot2.png',
        'characters/6-robot1.png',
        'characters/6-robot2.png',
        'characters/7-robot1-arm.png',
        'characters/7-robot2.png',
        'characters/8-robot1.png',
        'characters/9-robot1.png',
        'characters/10-robot1.png',
        'characters/10-robot2.png',
        'characters/11-robot1.png',
        'characters/11-robot2-arm.png',
        'characters/12-robot1.png',
        'characters/12-robot2-arm.png',
        'characters/13-robot1.png',
        'characters/14-robot1.png',
        'characters/14-robot2.png',
        'characters/15-robot1.png',
        'characters/15-robot2-arm.png',
        'characters/16-robot1.png',
        'characters/16-robot2-arm.png'
    ]
};

// 랜덤 캐릭터 이미지 선택 (중복 방지)
function getRandomCharacterImage(stage) {
    const rule = getStageRule(stage);
    const robotProbability = rule.robotProbability;
    
    const category = Math.random() < robotProbability ? 'robot' : 'normal';
    const allImages = characterImages[category];
    
    // 사용되지 않은 이미지만 필터링
    const availableImages = allImages.filter(img => !gameState.usedImages.includes(img));
    
    // 사용 가능한 이미지가 없으면 리셋 (모든 이미지를 사용한 경우)
    const images = availableImages.length > 0 ? availableImages : allImages;
    
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    
    // 사용된 이미지 목록에 추가
    if (!gameState.usedImages.includes(selectedImage)) {
        gameState.usedImages.push(selectedImage);
    }
    
    return {
        image: selectedImage,
        isRobot: category === 'robot'
    };
}

// 새 캐릭터 생성
function generateNewCharacter() {
    const currentStage = gameState.currentStage;
    
    // 랜덤 캐릭터 이미지 선택
    const characterData = getRandomCharacterImage(currentStage);
    
    // 출신지 생성
    const locationData = generateRandomLocation(currentStage);
    
    // 만료기한 생성
    const expiry = generateRandomExpiry(currentStage);
    
    // isHuman 판단: robot이거나 거부할 출신지면 reject해야 함 (isHuman = false)
    const rule = getStageRule(currentStage);
    const isBlockedProvince = rule.blockedProvinces.includes(locationData.province);
    
// 만료기한 체크 (3일차 이상에서 2100~2125 범위면 출입금지)
let isBlockedExpiry = false;
if (currentStage >= 3 && rule.blockedExpiryYear) {
    const expiryYear = parseInt(expiry.split('.')[0]);
    // 2100 이상 2125 이하이면 출입금지
    isBlockedExpiry = expiryYear >= 2100 && expiryYear <= rule.blockedExpiryYear;
}

// 대화 이상 확률 체크 (isDialogueBlocked 결정)
let isDialogueBlocked = false;
if (rule.blockedTalkProbability && rule.blockedTalkProbability > 0) {
    isDialogueBlocked = Math.random() < rule.blockedTalkProbability;
}

// ✅ 최종 isHuman 판단: 네 가지 조건 모두 '통과'해야 isHuman = true
let isHuman = !characterData.isRobot      // 1. 로봇 이미지가 아니고
              && !isBlockedProvince   // 2. 금지된 출신지가 아니고
              && !isBlockedExpiry     // 3. 금지된 만료기한이 아니고
              && !isDialogueBlocked;  // 4. 대화 차단 상태도 아니어야 함
    
    currentCharacter = {
        name: generateRandomName(),
        origin: locationData.city,
        province: locationData.province,
        expiry: expiry,
        isHuman: isHuman,
        standingImage: characterData.image,
        isDialogueBlocked: isDialogueBlocked // 대화에서 이상하게 할지 여부
    };
    
    // 화면 업데이트
    document.getElementById('id-name').textContent = currentCharacter.name;
    document.getElementById('id-origin').textContent = currentCharacter.origin;
    document.getElementById('id-expiry').textContent = currentCharacter.expiry;
    
    // 말풍선 초기화 (새 캐릭터로 넘어갈 때)
    const bubblesContainer = document.getElementById('dialogue-bubbles');
    if (bubblesContainer) {
        bubblesContainer.innerHTML = '';
    }
    
    // 캐릭터 스탠딩 이미지 표시
    const characterStanding = document.getElementById('character-standing');
    const spritePlaceholder = document.querySelector('.sprite-placeholder');
    if (characterStanding) {
        characterStanding.style.backgroundImage = `url('img/${currentCharacter.standingImage}')`;
        characterStanding.classList.add('visible');
        // 플레이스홀더 숨기기
        if (spritePlaceholder) {
            spritePlaceholder.style.display = 'none';
        }
    }
    
    // 프로필 이미지 업데이트 (캐릭터 이미지 파일명에서 숫자 추출)
    const profileImage = document.getElementById('character-profile');
    if (profileImage) {
        // 예: "characters/1-normal.png" -> "1", "characters/3-robot1.png" -> "3"
        const match = currentCharacter.standingImage.match(/(\d+)/);
        if (match) {
            const characterNumber = match[1];
            profileImage.src = `img/cha_profile/${characterNumber}-profile.jpg`;
            profileImage.style.display = 'block';
        } else {
            profileImage.style.display = 'none';
        }
    
    }
}   


// 게임 시작
function startGame(stage) {
    // 게임 배경음악 재생
    playGameMusic();
    
    gameState.currentStage = stage;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.usedImages = []; // 스테이지 시작 시 사용된 이미지 목록 초기화
    
    // 게임 화면 업데이트
    document.getElementById('current-day').textContent = stage;
    document.getElementById('score').textContent = '0';
    document.getElementById('correct-count').textContent = '0';
    document.getElementById('wrong-count').textContent = '0';
    
    // 지도 섹션 표시/숨김 (스테이지 규칙에 따라)
    const rule = getStageRule(stage);
    const mapSection = document.getElementById('map-section');
    const dialogueSection = document.getElementById('dialogue-section');
    
    // 대화 선택지 섹션 표시/숨김 (3일차부터)
    if (dialogueSection) {
        if (stage >= 3) {
            dialogueSection.style.display = 'flex';
        } else {
            dialogueSection.style.display = 'none';
        }
    }
    
    if (mapSection) {
        if (rule.hasMap) {
            mapSection.style.display = 'block';
            // 지도가 아직 초기화되지 않았다면 초기화
            setTimeout(() => {
                if (!map) {
                    initMap();
                }
                // 2일차일 때 강원도 강조 표시
                if (stage === 2 && typeof showRegionHighlight === 'function') {
                    setTimeout(() => {
                        showRegionHighlight(['강원특별자치도']);
                    }, 300);
                } 
                // 3일차일 때 강원도, 부산, 울산 강조 표시
                else if (stage === 3 && typeof showRegionHighlight === 'function') {
                    setTimeout(() => {
                        showRegionHighlight(['강원특별자치도', '부산광역시', '울산광역시']);
                    }, 300);
                } 
                // 다른 스테이지에서는 강조 숨김
                else if (typeof hideRegionHighlight === 'function') {
                    hideRegionHighlight(['강원특별자치도', '부산광역시', '울산광역시']);
                }
            }, 100);
        } else {
            mapSection.style.display = 'none';
            // 지도 제거
            if (map) {
                map.remove();
                map = null;
            }
        }
    } else {
        // 지도가 이미 초기화된 경우에도 지역 강조 업데이트
        if (map && typeof showRegionHighlight === 'function' && typeof hideRegionHighlight === 'function') {
            if (stage === 2) {
                showRegionHighlight(['강원특별자치도']);
                hideRegionHighlight(['부산광역시', '울산광역시']);
            } else if (stage === 3) {
                showRegionHighlight(['강원특별자치도', '부산광역시', '울산광역시']);
            } else {
                hideRegionHighlight(['강원특별자치도', '부산광역시', '울산광역시']);
            }
        }
    }
    
    // 메모 이미지 변경 (스테이지에 따라)
    const memoImg = document.getElementById('memo-img');
    if (memoImg) {
        if (stage >= 2 && stage <= 5) {
            memoImg.src = `img/memo${stage}.png`;
        } else {
            memoImg.src = 'img/memo.png';
        }
    }
    
    showScreen('game-screen');
    
    // 첫 캐릭터 생성
    generateNewCharacter();
}

// 게임 종료 및 정산
function endGame(correct, wrong) {
    gameState.correctCount = correct;
    gameState.wrongCount = wrong;
    
    // 정산 화면 업데이트
    document.getElementById('result-correct').textContent = correct;
    document.getElementById('result-wrong').textContent = wrong;
    document.getElementById('result-total').textContent = correct + wrong;
    
    // 다음 스테이지 해제 확인
    const unlockMessage = document.getElementById('unlock-message');
    const currentStage = gameState.currentStage;
    
    if (currentStage < 5 && correct >= gameState.minCorrectToUnlock) {
        const nextStage = currentStage + 1;
        if (!gameState.unlockedStages.includes(nextStage)) {
            gameState.unlockedStages.push(nextStage);
            saveProgress();
            unlockMessage.textContent = `STAGE ${nextStage} UNLOCKED!`;
            unlockMessage.classList.add('show');
        } else {
            unlockMessage.classList.remove('show');
        }
    } else if (currentStage < 5 && correct < gameState.minCorrectToUnlock) {
        unlockMessage.textContent = `다음 스테이지를 해금하기 위해선 맞춘 횟수가 ${gameState.minCorrectToUnlock}번 이상이 되어야 합니다.`;
        unlockMessage.classList.add('show');
    } else {
        unlockMessage.classList.remove('show');
    }
    
    // 클리어 사운드 재생
    playClearSound();
    
    showScreen('result-screen');
}

// 진행도 리셋
function resetProgress() {
    const confirmMessage = "지금까지 저장된 진행 상황이 전부 초기화됩니다. 진행도를 리셋하시겠습니까?";
    
    if (confirm(confirmMessage)) {
        // localStorage 초기화
        localStorage.removeItem('turingDeskProgress');
        
        // 모든 localStorage 항목 삭제 (캐시 완전 삭제)
        localStorage.clear();
        
        // 페이지 새로고침
        location.reload();
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 진행도 로드
    loadProgress();
    
    // 메인 화면 -> 스테이지 선택
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('stage-select-screen');
    });
    
    // 스테이지 선택 -> 메인 화면
    document.getElementById('back-to-main-btn').addEventListener('click', () => {
        showScreen('main-screen');
    });
    
    // 리셋 버튼
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetProgress();
    });
    
    // 스테이지 버튼 클릭
    document.querySelectorAll('.stage-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // e.currentTarget을 사용하여 버튼 요소를 확실히 가져옴
            const button = e.currentTarget;
            const stage = parseInt(button.dataset.stage);
            if (gameState.unlockedStages.includes(stage)) {
                showScreen('story-screen');
                showStory(stage);
            }
        });
    });
    
    // 통과 버튼
    document.getElementById('pass-btn').addEventListener('click', () => {
        if (!currentCharacter) return;
        
        playButtonSound();
        
        const isCorrect = currentCharacter.isHuman;
        if (isCorrect) {
            gameState.correctCount++;
        } else {
            gameState.wrongCount++;
        }
        
        updateGameStats();
        generateNewCharacter();
    });
    
    // 거부 버튼
    document.getElementById('reject-btn').addEventListener('click', () => {
        if (!currentCharacter) return;
        
        playButtonSound();
        
        const isCorrect = !currentCharacter.isHuman;
        if (isCorrect) {
            gameState.correctCount++;
        } else {
            gameState.wrongCount++;
        }
        
        updateGameStats();
        generateNewCharacter();
    });
    
  

    
    // 게임 통계 업데이트 함수
    function updateGameStats() {
        document.getElementById('correct-count').textContent = gameState.correctCount;
        document.getElementById('wrong-count').textContent = gameState.wrongCount;
        document.getElementById('score').textContent = gameState.correctCount - gameState.wrongCount;
        
        // 테스트용: 20명 처리 후 게임 종료
        const total = gameState.correctCount + gameState.wrongCount;
        if (total >= 20) {
            setTimeout(() => {
                endGame(gameState.correctCount, gameState.wrongCount);
            }, 500);
        }
    }
    
    // 정산 화면 -> 재시도
    document.getElementById('retry-btn').addEventListener('click', () => {
        const stage = gameState.currentStage;
        showScreen('story-screen');
        showStory(stage);
    });
    
    // 정산 화면 -> 스테이지 선택
    document.getElementById('stage-select-result-btn').addEventListener('click', () => {
        updateStageButtons();
        showScreen('stage-select-screen');
    });
    
    // 나가기 버튼 이벤트 리스너
    const exitGameBtn = document.getElementById('exit-game-btn');
    const exitStoryBtn = document.getElementById('exit-story-btn');
    const exitDialog = document.getElementById('exit-confirm-dialog');
    const exitConfirmYes = document.getElementById('exit-confirm-yes');
    const exitConfirmNo = document.getElementById('exit-confirm-no');
    
    // 나가기 버튼 클릭 시 다이얼로그 표시
    if (exitGameBtn) {
        exitGameBtn.addEventListener('click', () => {
            exitDialog.classList.add('active');
        });
    }
    
    if (exitStoryBtn) {
        exitStoryBtn.addEventListener('click', () => {
            exitDialog.classList.add('active');
        });
    }
    
    // 예 버튼 클릭 시 스테이지 선택 화면으로 이동
    if (exitConfirmYes) {
        exitConfirmYes.addEventListener('click', () => {
            exitDialog.classList.remove('active');
            showScreen('stage-select-screen');
        });
    }
    
    // 아니오 버튼 클릭 시 다이얼로그 닫기
    if (exitConfirmNo) {
        exitConfirmNo.addEventListener('click', () => {
            exitDialog.classList.remove('active');
        });
    }
    
    // 대화 선택지 버튼 이벤트 리스너
    const dialogueButtons = document.querySelectorAll('.dialogue-btn');
    dialogueButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const option = e.target.getAttribute('data-option');
            handleDialogueOption(option);
        });
    });
    
// 대화 선택지 처리 함수 (수정)
function handleDialogueOption(option) {
    if (!currentCharacter) return;
    
    playButtonSound();
    
    // 3일차 이상에서만 작동
    const currentStage = gameState.currentStage;
    if (currentStage < 3) return;
    
    // 🌟🌟🌟 수정된 핵심 로직 🌟🌟🌟
    // 대화가 이상한지 여부는 isDialogueBlocked 값으로만 판단합니다.
    const isTalkingNormal = !currentCharacter.isDialogueBlocked;
    
    let response = '';
    
    if (option === '1') {
        // "1. 안녕하세요?"
        if (isTalkingNormal) { // isDialogueBlocked가 false일 때 (정상 대화)
            // 정상적인 대답
            const responses = [
                '오늘 날씨가 참 좋네요',
                '반가워요',
                '제발 들어가게 해주세요'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        } else { // isDialogueBlocked가 true일 때 (이상 대화)
            // 이상한 대답
            const responses = [
                '안- 하 - 요 -',
                '안녕, 안녕? 안녕? 녀녀녀녀녀녀녀녕!',
                '직, 지지직, 안녕, 지지직...'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }
    } else if (option === '2') {
        // "2. 당신 모습에 이상한 게 보여요."
        if (isTalkingNormal) { // isDialogueBlocked가 false일 때 (정상 대화)
            // 정상적인 대답
            const responses = [
                '무슨 소리세요? 아무것도 없는데요.',
                '제 얼굴에 뭐라도 묻은 건가요?',
                '잘 모르겠는데요...'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        } else { // isDialogueBlocked가 true일 때 (이상 대화)
            // 이상한 대답
            const responses = [
                '뭐-ㄹㅏ---',
                '무엇? 무엇? 무엇? 무?',
                '지지직, 지지지지지직....'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }
    } else if (option === '3') {
        // "3. 출신지가  어딘가요?"
        if (isTalkingNormal) { // isDialogueBlocked가 false일 때 (정상 대화)
            // 정상적인 대답 (출신지 말하기)
            response = `${currentCharacter.origin}에서 왔어요.`;
        } else { // isDialogueBlocked가 true일 때 (이상 대화)
            // 이상한 대답
            const responses = [
                '지지지지지직, 지지지지지지직-',
                '어디더라, 직, 어디, 어디, 어....',
                '지지직, 끼이이익- 지직-'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // 말풍선에 대답 표시
    showDialogueBubble(response);
}
    
    // 말풍선 표시 함수
    function showDialogueBubble(text) {
        const bubblesContainer = document.getElementById('dialogue-bubbles');
        if (!bubblesContainer) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'dialogue-bubble';
        bubble.textContent = text;
        
        bubblesContainer.appendChild(bubble);
        
        // 말풍선이 너무 많아지면 스크롤 가능하도록
        bubblesContainer.scrollTop = bubblesContainer.scrollHeight;
    }
    
    // 말풍선 초기화 함수 (새 캐릭터 생성 시 호출)
    function clearDialogueBubbles() {
        const bubblesContainer = document.getElementById('dialogue-bubbles');
        if (bubblesContainer) {
            bubblesContainer.innerHTML = '';
        }
    }
    
    // 다이얼로그 배경 클릭 시 닫기
    if (exitDialog) {
        exitDialog.addEventListener('click', (e) => {
            if (e.target === exitDialog) {
                exitDialog.classList.remove('active');
            }
        });
    }
});