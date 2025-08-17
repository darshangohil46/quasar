from django.urls import path
from .views import save_chat_history, get_chat_history

urlpatterns = [
    path("history/save/", save_chat_history, name="save_chat_history"),
    path("get-history/", get_chat_history, name="get_chat_history"),
]
