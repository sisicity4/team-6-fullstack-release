from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    register_view,
    create_goal,
    list_goals,
    profile_view,
    reflections_view,
    workouts_view,
    workouts_summary_view,
    body_metrics_view,
)

urlpatterns = [
    path("register/", register_view),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("goals/create/", create_goal),
    path("goals/", list_goals),
    path("profile/", profile_view),
    path("reflections/", reflections_view),
    path("workouts/", workouts_view),
    path("workouts/summary/", workouts_summary_view),
    path("body-metrics/", body_metrics_view),
]
