from fastapi import FastAPI
import os
from langchain.agents import create_agent
from langchain_core.prompts import PromptTemplate
app = FastAPI()
@app.get("/")
def read_root():
    return {"Hello": "World"}    

                        