import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try importing mistral logic
try:
    from mistral_inference.model import Transformer
    from mistral_inference.generate import generate
    from mistral_common.tokens.tokenizers.mistral import MistralTokenizer
    from mistral_common.protocol.instruct.messages import UserMessage
    from mistral_common.protocol.instruct.request import ChatCompletionRequest
    MISTRAL_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Mistral dependencies not fully installed or available: {e}")
    MISTRAL_AVAILABLE = False


app = FastAPI(
    title="Numerology AI Pipeline",
    description="Optimized AI Engine for Numerology Analysis using Mistral.",
    version="1.0.0"
)

class NumerologyRequest(BaseModel):
    name: str
    birth_year: int
    birth_month: int
    birth_day: int
    life_path_number: Optional[int] = None
    born_essence: Optional[int] = None
    question: Optional[str] = "내 성격과 향후 운세를 알려줘"

class NumerologyResponse(BaseModel):
    summary: str
    deep_analysis: str
    lucky_colors: List[str]
    lucky_numbers: List[int]

class OmniverseRequest(BaseModel):
    name: str
    saju_data: str
    ziwei_data: str
    astrology_data: str
    question: Optional[str] = "세 가지 관점을 종합하여 나의 숙명과 향후 나아갈 길을 알려줘"

class OmniverseResponse(BaseModel):
    summary: str
    deep_analysis: str
    lucky_elements: List[str]

# AI Engine handling Mistral inference
class MistralEngine:
    def __init__(self, model_path: str = "./weights"):
        self.tokenizer = None
        self.model = None
        self.is_loaded = False
        
        if MISTRAL_AVAILABLE and os.path.exists(model_path) and os.listdir(model_path):
            try:
                logger.info(f"Loading mistral model from {model_path}...")
                self.tokenizer = MistralTokenizer.from_file(os.path.join(model_path, "tokenizer.model.v3"))
                self.model = Transformer.from_folder(model_path)
                self.is_loaded = True
                logger.info("Mistral model loaded successfully.")
            except Exception as e:
                logger.error(f"Error loading model: {e}")

    def generate_analysis(self, prompt: str) -> str:
        if not self.is_loaded:
            # Fallback mock specifically tailored for the combination if no weights are present
            return f"(Mistral 가중치가 없으므로 시뮬레이션 합니다.)\n\nAI 핵심 통찰: 운명수와 본질수의 충돌과 화합이 당신을 매우 독창적인 캐릭터로 만듭니다. {prompt[:30]}... 라는 질문에 대해, 당신의 내면 에너지를 극대화하는 것이 정답입니다."

        try:
            completion_request = ChatCompletionRequest(messages=[UserMessage(content=prompt)])
            tokens = self.tokenizer.encode_chat_completion(completion_request).tokens
            # Bump max_tokens to 2048 for the massive Omniverse analysis
            out_tokens, _ = generate([tokens], self.model, max_tokens=2048, temperature=0.7, eos_id=self.tokenizer.instruct_tokenizer.tokenizer.eos_id)
            result = self.tokenizer.instruct_tokenizer.tokenizer.decode(out_tokens[0])
            return result
        except Exception as e:
            return f"Error generation: {e}"

engine = MistralEngine()

def calculate_life_path(year: int, month: int, day: int) -> int:
    def sum_digits(n: int) -> int:
        while n > 9 and n not in (11, 22, 33):
            n = sum(int(d) for d in str(n))
        return n
    
    y = sum_digits(year)
    m = sum_digits(month)
    d = sum_digits(day)
    return sum_digits(y + m + d)

@app.post("/api/v1/analyze", response_model=NumerologyResponse)
async def analyze_numerology(req: NumerologyRequest):
    logger.info(f"Received analysis request for {req.name}")
    
    lp = req.life_path_number or calculate_life_path(req.birth_year, req.birth_month, req.birth_day)
    be = req.born_essence or calculate_life_path(req.birth_year, req.birth_month, req.birth_day) # In real logic, BE has different calculation
    
    prompt = f"""
    당신은 세계 최고의 수비학자이자 타로 마스터입니다.
    이름: {req.name}
    생년월일: {req.birth_year}년 {req.birth_month}월 {req.birth_day}일
    운명수(Life Path Number): {lp}
    본질수(Born Essence Number): {be}
    
    질문: {req.question}
    
    위 정보를 바탕으로, 운명수 {lp}(외면적 기질과 인생의 방향)와 본질수 {be}(내면적 자아와 무의식적 동기)가 만났을 때 발생하는 81가지 고유한 화학 작용에 착안하여, 다른 운명수 조합과 완전히 차별화되는 이 조합만의 유니크한 통찰력(장단점, 성향, 연애운, 재물운)을 상세하게 작성해 주십시오. 
    """
    
    llm_output = engine.generate_analysis(prompt)
    
    return NumerologyResponse(
        summary=f"{req.name}님의 운명수 {lp}와 본질수 {be} 조합에 특화된 AI 요약입니다.",
        deep_analysis=llm_output,
        lucky_colors=["블랙", "네이비", "다크그린"],
        lucky_numbers=[lp, be, (lp+be)%9 + 1]
    )

@app.post("/api/v1/omniverse", response_model=OmniverseResponse)
async def analyze_omniverse(req: OmniverseRequest):
    logger.info(f"Received omniverse analysis request for {req.name}")
    
    prompt = f"""
    당신은 세계 최고의 명리학자, 자미두수 대가, 그리고 서양 점성술의 권위자입니다.
    이름: {req.name}
    
    [사주팔자 분석결과 요약]
    {req.saju_data}
    
    [자미두수 명반 요약]
    {req.ziwei_data}
    
    [서양 점성술 요약]
    {req.astrology_data}
    
    의뢰인의 질문: {req.question}
    
    위 3가지 서로 다른 예측 프레임워크(명리학, 자미두수, 서양 점성술) 데이터를 모두 종합하여, 이 세 가지 시선이 교차하는 지점에서 발견되는 의뢰인만의 고유한 우주적 에너지, 숙명, 장단점, 그리고 미래를 개척하기 위한 궁극적인 조언을 아주 깊이 있는 통찰력으로 작성해 주십시오. 구체적이고 전문적인 어휘를 사용하되 일반인도 감동할 수 있도록 작성하세요.
    """
    
    llm_output = engine.generate_analysis(prompt)
    
    if not engine.is_loaded:
        llm_output = f"(Mistral 가중치가 없으므로 시뮬레이션 합니다.)\n\n[초월적 옴니버스 분석]\n\n사주의 일간 에너지와 자미두수 명궁의 주성, 그리고 점성술의 상승궁/태양별자리가 완벽하게 교차하는 지점을 발견했습니다. 당신은 세상을 이끄는 강한 리더십과 내면의 깊은 철학적 성찰을 동시에 지닌 인물입니다. 동서양의 별과 에너지가 모두 당신의 잠재력을 가리키고 있습니다.\n\n질문하신 '{req.question[:20]}...' 에 대해, 다가오는 1년은 당신의 토대(Grounding)를 다지기에 최고의 시기입니다."

    return OmniverseResponse(
        summary=f"사주, 자미두수, 점성술을 모두 관통하는 {req.name}님만의 초월적 종합 분석입니다.",
        deep_analysis=llm_output,
        lucky_elements=["별의 인도자", "푸른 불꽃", "황금 동전"]
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "mistral_available": MISTRAL_AVAILABLE}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
