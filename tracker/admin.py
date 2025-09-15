from django.contrib import admin
from .models import MiniProject
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register the MiniProject model
@admin.register(MiniProject)
class MiniProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'priority', 'status', 'due_date', 'created_at')
    list_filter = ('priority', 'status', 'due_date')
    search_fields = ('title', 'description', 'assigned_to__username')

# Extend UserAdmin to include staff status for Trainer/Trainee distinction
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', 'is_active')

# Re-register the User model with the updated admin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
