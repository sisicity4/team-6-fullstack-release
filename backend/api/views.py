from datetime import timedelta

from django.contrib.auth.models import User
from django.db.models import Avg, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Goal, HealthMetric, Reflection, UserProfile, WorkoutSession
from .serializers import (
    GoalSerializer,
    HealthMetricSerializer,
    ReflectionSerializer,
    UserProfileSerializer,
    WorkoutSessionSerializer,
)


@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "username and password required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "user already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, password=password)
    return Response(
        {"message": "user created", "username": user.username},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_goal(request):
    serializer = GoalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_goals(request):
    goals = Goal.objects.filter(user=request.user).order_by("-created_at")
    serializer = GoalSerializer(goals, many=True)
    return Response({"goals": serializer.data})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    profile, _created = UserProfile.objects.get_or_create(user=user)

    if request.method == "POST":
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    profile_data = UserProfileSerializer(profile).data

    return Response(
        {
            "username": user.username,
            "is_authenticated": user.is_authenticated,
            "last_login": user.last_login,
            "date_joined": user.date_joined,
            **profile_data,
        }
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def reflections_view(request):
    if request.method == "POST":
        serializer = ReflectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    reflections = Reflection.objects.filter(user=request.user)
    serializer = ReflectionSerializer(reflections, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def workouts_view(request):
    serializer = WorkoutSessionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def workouts_summary_view(request):
    end = timezone.now()
    start = end - timedelta(days=6)
    sessions = WorkoutSession.objects.filter(
        user=request.user,
        performed_at__date__range=(start.date(), end.date()),
    )
    totals = sessions.aggregate(
        total_duration=Sum("duration_minutes"),
        total_distance=Sum("distance_km"),
        total_calories=Sum("calories"),
        avg_intensity=Avg("intensity"),
    )
    recent = sessions.order_by("-performed_at")[:7]
    recent_serializer = WorkoutSessionSerializer(recent, many=True)
    return Response(
        {
            "range_start": start.date(),
            "range_end": end.date(),
            "total_sessions": sessions.count(),
            "total_duration_minutes": totals["total_duration"] or 0,
            "total_distance_km": totals["total_distance"] or 0,
            "total_calories": totals["total_calories"] or 0,
            "average_intensity": round(totals["avg_intensity"] or 0, 1),
            "recent_sessions": recent_serializer.data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def body_metrics_view(request):
    serializer = HealthMetricSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
