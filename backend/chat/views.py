from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import ChatHistory
from django.contrib.auth.models import User


@csrf_exempt
def save_chat_history(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            history = data.get("history")

            if not user_id or not history:
                return JsonResponse(
                    {"error": "user_id and history are required"}, status=400
                )

            chat_history = ChatHistory.objects.create(user_id=user_id, history=history)
            return JsonResponse(
                {"message": "Chat history saved successfully", "id": chat_history.id},
                status=201,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method"}, status=405)


@csrf_exempt
def get_chat_history(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        try:
            current_user = (
                User.objects.filter(username=username).values("id").first().get("id")
            )
            print(current_user)
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
