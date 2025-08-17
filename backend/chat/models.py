from django.db import models
from django.db.models import JSONField
from django.contrib.auth.models import User

# Create your models here.


class ChatHistory(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chat_histories",
        help_text="The user associated with this chat history",
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Optional title for the chat history",
        default="New Chat",
    )
    history = JSONField(
        default=list,
        help_text="Stores chat history as a list of JSON objects",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"ChatHistory {self.id} for User {self.user.username} - {self.created_at}"
        )
