# # openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langgraph.graph import START, END, StateGraph
import json

# def chunk_transcript(transcript: str):
#     splitter = RecursiveCharacterTextSplitter(
#         chunk_size=4000,
#         chunk_overlap=300
#     )
#     return splitter.split_text(transcript)


llm = ChatOpenAI(
    openai_api_key="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",
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

llm_chain = prompt | llm

from langgraph.graph import END, StateGraph
from typing import TypedDict

class TranscriptState(TypedDict):
    transcript: str
    chunks: list[str]
    questions: list[dict]

# Step 1: Chunking node
def chunking_node(state: TranscriptState) -> TranscriptState:
    transcript = state["transcript"]
    splitter = RecursiveCharacterTextSplitter(chunk_size=4000, chunk_overlap=300)
    chunks = splitter.split_text(transcript)
    return {"transcript": transcript, "chunks": chunks, "questions": []}

# Step 2: Inference node
def inference_node(state: TranscriptState) -> TranscriptState:
    new_questions = []

    for i, chunk in enumerate(state["chunks"]):
        try:
            response = llm_chain.invoke({"transcript": chunk})
            raw = response.content if hasattr(response, "content") else response
            print(f"📦 Chunk {i} LLM Raw Output:\n{raw[:400]}...")

            parsed = json.loads(raw)
            new_questions.extend(parsed)

        except json.JSONDecodeError as err:
            print(f"❌ JSONDecodeError on chunk {i}: {err}")
            print("🔍 Raw output:", raw[:400], "...")
        except Exception as e:
            print(f"❌ Unexpected error on chunk {i}: {e}")

    return {
        "transcript": state["transcript"],
        "chunks": state["chunks"],
        "questions": new_questions
    }

# Step 3: Build LangGraph
builder = StateGraph(TranscriptState)

builder.add_node("chunk_transcript", chunking_node)
builder.add_node("run_llm", inference_node)

builder.set_entry_point("chunk_transcript")
builder.add_edge("chunk_transcript", "run_llm")
builder.add_edge("run_llm", END)

graph = builder.compile()

# Function to run graph with a raw transcript
def run_langgraph_pipeline(transcript: str):
    result = graph.invoke({"transcript": transcript})
    return result["questions"]
