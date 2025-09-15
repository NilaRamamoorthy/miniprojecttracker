from rest_framework import serializers
from .models import MiniProject

class MiniProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiniProject
        fields = '__all__'
