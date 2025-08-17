from django.urls import path
from .views import *

urlpatterns = [
    path("history/save/", save_chat_history, name="save_chat_history"),
    path("get-history/", get_chat_history, name="get_chat_history"),
    path("get-full-chat/", get_chat_history_by_id, name="get_chat_history_by_id"),
    path("create/", create_chat_history, name="create_chat_history"),
    path("<int:chat_id>/add-message/", add_message, name="add_message"),
    path("ai-chat/", chat_with_groq, name="chat_with_gemini"),
]
