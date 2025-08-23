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
from .chat_with_groq import chat_with_groq


# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# GROQ_AI_MODEL = os.getenv("GROQ_AI_MODEL")


USER = "user"
ASSISTANT = "assistant"
SYSTEM = "system"


# done
# Get all chat history for a user
@csrf_exempt
def get_chat_history_by_id(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            chat_id = data.get("chat_id")
            username = data.get("username")
            user = User.objects.filter(username=username).first()
            if not user:
                return JsonResponse(
                    {"success": False, "error": "User not found"}, status=404
                )

            histories = (
                ChatHistory.objects.filter(id=chat_id, user=user)
                .values_list("history", flat=True)
                .first()
            )

            if not histories:
                return JsonResponse(
                    {"success": False, "error": "Chat not found"}, status=404
                )
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


# done
# Append a new message to an existing chat
@csrf_exempt
def add_message(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
            message = body.get("message")
            chat_id = body.get("chat_id")

            chat = ChatHistory.objects.get(id=chat_id)
            updated_history = chat.history

            updated_history.append(message)
            reply_of_ai = chat_with_groq(history=updated_history)
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
