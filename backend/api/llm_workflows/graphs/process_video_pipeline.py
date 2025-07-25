from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from langgraph.graph import START, END, StateGraph
from typing import List, TypedDict

load_dotenv()

openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

llm = ChatOpenAI(
    openai_api_key=openrouter_api_key,
    model="deepseek/deepseek-r1-0528-qwen3-8b:free",
    openai_api_base="https://openrouter.ai/api/v1",
)

prompt = ChatPromptTemplate.from_messages([
  ("system", """
You are an expert analyst who given a transcript follows the instructions gievn below

1. Extract the key questions being discussed in the transcript.
2. For each question:
    - Is the answer given in the transcript correct or misleading?
    - Provide a short commentary:
        - ✅ If correct, explain briefly.
        - ❌ If wrong, say why (factually wrong / biased / oversimplified / outdated / misleading).
3. Find the exact span of the transcript text where the answer is discussed.
    - Return the **start and end character index** of the entire evidence you used to justify the commentary (not timestamps).
    - Make sure they are perfect **based on the original transcript string** you received. 
    - Dont add any text or descriptions
        
Respond in JSON format like:
[
  {{
    "question": "...",
    "answer_agreement": true/false,
    "commentary": "...",
    "start_index": 453,
    "end_index": 892
  }},
  ...
]
"""),
("human", "{transcript}")
])

chain = prompt | llm

class AgentState(TypedDict):
    transcript: str
    ai_response: str

def generate_response(state: AgentState) -> AgentState:
    response = chain.invoke({"transcript": state["transcript"]})
    state["ai_response"] = response.content
    return state

graph = StateGraph(AgentState)

graph.add_node("video_processor", generate_response)
graph.add_edge(START, "video_processor")
graph.add_edge("video_processor", END)

app = graph.compile()
