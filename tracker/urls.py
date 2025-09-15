# mini_project_tracker/urls.py or your main urls.py

from django.urls import path, include
from rest_framework import routers
from tracker.views import MiniProjectViewSet, login_view, logout_view, dashboard_trainer, dashboard_trainee

router = routers.DefaultRouter()
router.register(r'projects', MiniProjectViewSet, basename='projects')

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('trainer/', dashboard_trainer, name='dashboard_trainer'),
    path('trainee/', dashboard_trainee, name='dashboard_trainee'),
    path('api/', include(router.urls)),  # Make sure this is here!
]
