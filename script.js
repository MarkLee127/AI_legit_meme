const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const generateAIImageButton = document.getElementById('generateAIImage');
const downloadMemeButton = document.getElementById('downloadMeme');

// DeepAI API 키 설정 (반드시 본인의 API 키를 입력하세요)
const DEEPAI_API_KEY = "e186246f-574b-42b0-8c42-f76298debf8f"; // 여기에 DeepAI API 키 입력
const mascotPrompt = "Blue mascot with checkmark in creative style"; // 마스코트 설명

// AI 이미지 생성 함수
async function generateAIImage(prompt) {
    try {
        const response = await fetch("https://api.deepai.org/api/text2img", {
            method: "POST",
            headers: {
                "Api-Key": DEEPAI_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `text=${prompt}`,
        });

        const data = await response.json();
        if (data.output_url) {
            return data.output_url; // 생성된 이미지 URL 반환
        } else {
            throw new Error(data.error || "AI 이미지 생성에 실패했습니다.");
        }
    } catch (error) {
        console.error("이미지 생성 중 오류 발생:", error);
        alert("AI 이미지 생성에 실패했습니다. 다시 시도해주세요.");
    }
}

// 캔버스에 AI 이미지 로드
async function generateMemeWithAI() {
    const prompt = `${mascotPrompt}`; // 마스코트에 스타일을 추가하는 프롬프트
    const imageUrl = await generateAIImage(prompt);

    if (imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous"; // CORS 문제 방지
        img.onload = () => {
            canvas.width = img.width > 500 ? 500 : img.width;
            canvas.height = img.height > 500 ? 500 : img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 텍스트 추가
            ctx.font = '30px Impact';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';

            // 상단 텍스트
            const topText = topTextInput.value.toUpperCase();
            ctx.fillText(topText, canvas.width / 2, 50);
            ctx.strokeText(topText, canvas.width / 2, 50);

            // 하단 텍스트
            const bottomText = bottomTextInput.value.toUpperCase();
            ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
            ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
        };
        img.src = imageUrl;
    }
}

// 밈 다운로드 함수
function downloadMeme() {
    const link = document.createElement('a');
    link.download = 'legit-meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 버튼 이벤트 설정
generateAIImageButton.addEventListener('click', generateMemeWithAI);
downloadMemeButton.addEventListener('click', downloadMeme);
