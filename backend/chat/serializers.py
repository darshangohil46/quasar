from rest_framework import serializers
from .models import ChatHistory


class ChatMessageSerializer(serializers.Serializer):
    id = serializers.CharField()
    content = serializers.CharField()
    role = serializers.CharField()
    timestamp = serializers.DateTimeField()


class ChatHistorySerializer(serializers.ModelSerializer):
    history = ChatMessageSerializer(many=True)

    class Meta:
        model = ChatHistory
        fields = ["id", "user", "title", "history", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]
