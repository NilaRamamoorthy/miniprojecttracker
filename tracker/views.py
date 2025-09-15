from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from .models import MiniProject
from django.contrib.auth.models import User
import json
from django.contrib.auth.decorators import login_required

def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if user.is_staff:
                return redirect('dashboard_trainer')
            return redirect('dashboard_trainee')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard_trainer(request):
    return render(request, 'dashboard_trainer.html')

@login_required
def dashboard_trainee(request):
    return render(request, 'dashboard_trainee.html')

from rest_framework import viewsets, permissions
from .models import MiniProject
from .serializers import MiniProjectSerializer
from rest_framework.exceptions import PermissionDenied

class MiniProjectViewSet(viewsets.ModelViewSet):
    queryset = MiniProject.objects.all()
    serializer_class = MiniProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = MiniProject.objects.all()
        if not user.is_staff:
            qs = qs.filter(assigned_to=user)

        # Filtering
        status = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')
        if status:
            qs = qs.filter(status=status)
        if priority:
            qs = qs.filter(priority=priority)

        return qs

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only Trainers can assign projects")
        serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user
        if instance.assigned_to != user and not user.is_staff:
            raise PermissionDenied("Not allowed to update this project")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only Trainers can delete projects")
        instance.delete()
