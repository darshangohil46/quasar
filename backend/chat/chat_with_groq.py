import requests
import uuid
from datetime import datetime
import os

# Constants
SYSTEM = "system"
ASSISTANT = "assistant"
USER = "user"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_AI_MODEL = os.getenv("GROQ_AI_MODEL")


def format_ai_response(content):
    """
    Format AI response to be more beautiful and structured
    """
    formatted_content = content.strip()

    # Add proper spacing around code blocks
    import re

    formatted_content = re.sub(r"```(\w+)?\n", r"\n```\1\n", formatted_content)
    formatted_content = re.sub(r"\n```\n", r"\n```\n\n", formatted_content)

    # Ensure proper spacing around headers
    formatted_content = re.sub(r"\n(#{1,6})\s", r"\n\n\1 ", formatted_content)

    # Add spacing around lists
    formatted_content = re.sub(r"\n(\d+\.|\*|\-)\s", r"\n\n\1 ", formatted_content)

    # Clean up multiple newlines
    formatted_content = re.sub(r"\n{3,}", "\n\n", formatted_content)

    return formatted_content.strip()


def enhance_system_prompt():
    """
    Enhanced system prompt for better AI responses
    """
    return (
        "You are Quasar AI, a helpful and intelligent assistant. "
        "Format your responses beautifully using markdown when appropriate:\n"
        "- Use **bold** for important points\n"
        "- Use `code` for technical terms\n"
        "- Use code blocks with language specification for code examples\n"
        "- Use headers (##) to organize longer responses\n"
        "- Use bullet points or numbered lists for clarity\n"
        "- Keep responses well-structured and visually appealing\n"
        "Always be polite, helpful, and provide clear explanations."
    )


# generate output using history and user input
def chat_with_groq(history):
    if not len(history) > 0:
        return {"status": "error", "error": "History is not available"}

    try:
        predefined_messages = [
            {
                "role": SYSTEM,
                "content": enhance_system_prompt(),
            },
            {
                "role": ASSISTANT,
                "content": "Hello! 👋 I'm **Quasar AI**, here to help you with your questions. Feel free to ask me anything!",
            },
        ]

        # Convert user history to groq format
        groq_messages = [
            {"role": msg.get("role", USER), "content": msg.get("content", "")}
            for msg in history
        ]

        # Merge predefined + history
        all_messages = predefined_messages + groq_messages

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_AI_MODEL,
                "messages": all_messages,
                "temperature": 0.7,
                "max_tokens": 2048,
                "top_p": 0.9,
            },
        )

        response.raise_for_status()
        data = response.json()

        ai_content = data["choices"][0]["message"]["content"]

        formatted_content = format_ai_response(ai_content)

        assistant_message = {
            "status": "success",
            "data": {
                "id": str(uuid.uuid4()),
                "content": formatted_content,
                "role": ASSISTANT,
                "timestamp": datetime.now().isoformat(),
            },
        }

        return assistant_message

    except Exception as e:
        return {"status": "error", "error": str(e)}


def analyze_response(content):
    """
    Analyze response content for better rendering decisions
    """
    analysis = {
        "has_code_blocks": "```" in content,
        "has_inline_code": "`" in content and "```" not in content,
        "has_lists": any(
            line.strip().startswith(("*", "-", "1.", "2.", "3."))
            for line in content.split("\n")
        ),
        "has_headers": any(
            line.strip().startswith("#") for line in content.split("\n")
        ),
        "word_count": len(content.split()),
        "estimated_read_time": max(
            1, len(content.split()) // 200
        ),  # ~200 words per minute
    }
    return analysis


if __name__ == "__main__":
    # Test the enhanced chat function
    test_history = [
        {
            "role": "user",
            "content": "Can you show me a Python function to calculate fibonacci numbers?",
        }
    ]

    result = chat_with_groq(test_history)
    print("Enhanced AI Response:")
    print(result)
