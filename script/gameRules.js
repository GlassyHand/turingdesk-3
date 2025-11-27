// 게임 스테이지별 규칙 설정
const gameRules = {
    // 1days: 지도 없음, 외관만 확인
    1: {
        name: "1days",
        hasMap: false,
        robotProbability: 0.5, // 1:1 비율
        blockedProvinces: [], // 거부할 출신지 없음
        blockedProvinceProbability: 0, // 거부할 출신지 확률 없음
        blockedTalkProbability: 0 // 대화 이상 확률 없음
    },
    
    // 2days: 지도 있음, 강원특별자치도 출신 거부
    2: {
        name: "2days",
        hasMap: true,
        robotProbability: 1/3, // 1/3 확률로 robot
        blockedProvinces: ['강원특별자치도'], // 강원특별자치도 출신 거부
        blockedProvinceProbability: 0.37, // 37% 확률로 거부할 출신지 등장
        blockedTalkProbability: 0 // 대화 이상 확률 없음
    },
    
    // 3days: 지도 있음, 강원도/부산/울산 출입금지, 만료기한 2125 이하 출입금지
    3: {
        name: "3days",
        hasMap: true,
        robotProbability: 20/100, // 20% 확률로 robot
        blockedProvinces: ['강원특별자치도', '부산광역시', '울산광역시'], // 강원도, 부산, 울산 출입금지
        blockedProvinceProbability: 20/100, // 20% 확률로 거부할 출신지 등장
        blockedExpiryYear: 2125, // 2125 이하 만료기한 출입금지
        blockedTalkProbability: 15/100 // 대화 이상 확률
    },
    
    // 4days: 지도 있음, 거부할 출신지 설정 필요
    4: {
        name: "4days",
        hasMap: true,
        robotProbability: 15/100, // 15% 확률로 robot
        blockedProvinces: [], // 거부할 출신지 (추가 필요)
        blockedProvinceProbability: 0, // 거부할 출신지 확률 (추가 필요)
        blockedTalkProbability: 1/10 // 대화 이상 확률
    },
    
    // 5days: 지도 있음, 거부할 출신지 설정 필요
    5: {
        name: "5days",
        hasMap: true,
        robotProbability: 15/100, // 15% 확률로 robot
        blockedProvinces: [], // 거부할 출신지 (추가 필요)
        blockedProvinceProbability: 0, // 거부할 출신지 확률 (추가 필요)
        blockedTalkProbability: 1/10 // 대화 이상 확률
    }
};

// 스테이지별 규칙 가져오기
function getStageRule(stage) {
    return gameRules[stage] || gameRules[1]; // 기본값은 1days 규칙
}

