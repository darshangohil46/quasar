from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import ChatHistory
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.serializers.json import DjangoJSONEncoder
import os
import google.generativeai as genai
from datetime import datetime
import requests, uuid


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_AI_MODEL = os.getenv("GROQ_AI_MODEL")


USER = "user"
ASSISTANT = "assistant"
SYSTEM = "system"


# done
# generate output using history and user input
def chat_with_groq(history):
    if not len(history) > 0:
        return {"status": "error", "error": "History is not available"}

    try:
        # Predefined system/context data
        predefined_messages = [
            {
                "role": SYSTEM,
                "content": (
                    "You are a helpful Quasar AI assistant. Always reply politely. "
                    "Keep answers short and clear unless detailed explanation is asked."
                ),
            },
            {
                "role": ASSISTANT,
                "content": "Hello! I'm here to help you with your questions.",
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
            },
        )

        response.raise_for_status()
        data = response.json()

        ai_content = data["choices"][0]["message"]["content"]

        assistant_message = {
            "status": "success",
            "data": {
                "id": str(uuid.uuid4()),
                "content": ai_content,
                "role": ASSISTANT,
                "timestamp": datetime.now().isoformat(),
            },
        }

        return assistant_message

    except Exception as e:
        return {"status": "error", "error": str(e)}


# done
# Get all chat history for a user
@csrf_exempt
def get_chat_history_by_id(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            chat_id = data.get("chat_id")
            histories = ChatHistory.objects.get(id=chat_id).history
            return JsonResponse({"success": True, "data": histories}, safe=False)
        except User.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "User not found"}, status=404
            )


# done
# Create new chat history
@csrf_exempt
def create_chat_history(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
            username = body.get("username")
            title = body.get("title", "New Chat")
            message = body.get("message")

            history = [
                {
                    "id": str(uuid.uuid4()),
                    "content": message,
                    "role": USER,
                    "timestamp": datetime.now().isoformat(),
                }
            ]

            user = User.objects.get(username=username)
            if not user:
                return JsonResponse(
                    {"success": False, "error": "User not found"},
                    status=404,
                )

            reply_of_ai = chat_with_groq(history=history)
            if reply_of_ai["status"] == "success":
                history.append(reply_of_ai["data"])

            chat = ChatHistory.objects.create(
                user=user,
                title=title,
                history=history,
            )

            return JsonResponse(
                {
                    "success": True,
                    "data": {
                        "id": chat.id,
                        "title": chat.title,
                        "history": chat.history,
                        "created_at": chat.created_at,
                    },
                },
                encoder=DjangoJSONEncoder,
                status=201,
            )
        except User.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "User not found"}, status=404
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)


# Append a new message to an existing chat
@csrf_exempt
def add_message(request):
    print(USER, ASSISTANT)

    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
            message = body.get("message")
            chat_id = body.get("chat_id")

            chat = ChatHistory.objects.get(id=chat_id)
            updated_history = chat.history

            updated_history.append(message)
            reply_of_ai = chat_with_groq(history=updated_history)
            print(reply_of_ai)
            if reply_of_ai["status"] == "success":
                updated_history.append(reply_of_ai["data"])

                chat.history = updated_history
                chat.updated_at = now()
                chat.save()

                return JsonResponse(
                    {"success": True, "data": reply_of_ai["data"]},
                    encoder=DjangoJSONEncoder,
                )
            return JsonResponse(
                {"success": False, "data": "Something went wrong"},
                encoder=DjangoJSONEncoder,
            )
        except ChatHistory.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "Chat not found"}, status=404
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)


# done
@csrf_exempt
def get_chat_history(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        try:
            current_user = (
                User.objects.filter(username=username).values("id").first().get("id")
            )
            chat_histories = (
                ChatHistory.objects.filter(user_id=current_user)
                .values("id", "title", "updated_at")
                .order_by("-updated_at")
                .all()
            )
            return JsonResponse(list(chat_histories), safe=False, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method"}, status=405)


# @csrf_exempt
# def save_chat_history(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             username = data.get("username")
#             history = data.get("history")

#             if not user_id or not history:
#                 return JsonResponse(
#                     {"error": "user_id and history are required"}, status=400
#                 )

#             chat_history = ChatHistory.objects.create(user_id=user_id, history=history)
#             return JsonResponse(
#                 {"message": "Chat history saved successfully", "id": chat_history.id},
#                 status=201,
#             )
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Invalid HTTP method"}, status=405)


# def chat_with_groq(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Only POST allowed"}, status=405)

#     try:
#         body = json.loads(request.body)

#         # Input format: { id, content, role, timestamp }
#         user_message = {
#             "role": body.get("role", "user"),
#             "content": body.get("content", ""),
#         }

#         response = requests.post(
#             "https://api.groq.com/openai/v1/chat/completions",
#             headers={
#                 "Authorization": f"Bearer {GROQ_API_KEY}",
#                 "Content-Type": "application/json",
#             },
#             json={
#                 "model": body.get("model", "llama-3.3-70b-versatile"),
#                 "messages": [user_message],
#             },
#         )

#         response.raise_for_status()
#         data = response.json()

#         # Extract AI response content
#         ai_content = data["choices"][0]["message"]["content"]

#         # Return in your format
#         return JsonResponse(
#             {
#                 "id": str(body.get("id", "ai-1")),
#                 "content": ai_content,
#                 "role": "assistant",
#                 "timestamp": datetime.utcnow().isoformat(),
#             }
#         )

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
