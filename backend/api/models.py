from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="goals")
    title = models.CharField(max_length=100)
    target_sessions = models.PositiveIntegerField(default=0)
    sessions_completed = models.PositiveIntegerField(default=0)
    target_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Reflection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reflections")
    action = models.CharField(max_length=255)
    mood = models.PositiveSmallIntegerField(default=50)
    notes = models.TextField(blank=True)
    emotion_tags = models.JSONField(default=list, blank=True)
    next_step = models.CharField(max_length=255, blank=True)
    success = models.BooleanField(default=False)
    logged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-logged_at"]

    def __str__(self):
        return f"{self.user.username} - {self.action[:40]}"


class WorkoutSession(models.Model):
    WEARABLE_SOURCES = [
        ("manual", "Manual"),
        ("apple_health", "Apple Health"),
        ("google_fit", "Google Fit"),
        ("fitbit", "Fitbit"),
        ("garmin", "Garmin"),
    ]
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="workout_sessions"
    )
    exercise_name = models.CharField(max_length=200)
    distance_km = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True
    )
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    calories = models.PositiveIntegerField(null=True, blank=True)
    heart_rate_avg = models.PositiveSmallIntegerField(null=True, blank=True)
    heart_rate_max = models.PositiveSmallIntegerField(null=True, blank=True)
    heart_rate_min = models.PositiveSmallIntegerField(null=True, blank=True)
    intensity = models.PositiveSmallIntegerField(default=50)
    sets_count = models.PositiveSmallIntegerField(null=True, blank=True)
    reps_count = models.PositiveSmallIntegerField(null=True, blank=True)
    steps = models.PositiveIntegerField(null=True, blank=True)
    wearable_source = models.CharField(
        max_length=32, choices=WEARABLE_SOURCES, default="manual"
    )
    wearable_device_id = models.CharField(max_length=120, blank=True)
    recovery_notes = models.TextField(blank=True)
    performed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-performed_at"]

    def __str__(self):
        return f"{self.user.username} - {self.exercise_name}"


class HealthMetric(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="health_metrics"
    )
    weight_kg = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    height_cm = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    body_fat_percent = models.DecimalField(
        max_digits=4, decimal_places=1, null=True, blank=True
    )
    resting_heart_rate = models.PositiveSmallIntegerField(null=True, blank=True)
    recorded_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-recorded_at"]

    def __str__(self):
        return f"{self.user.username} - {self.recorded_at.date()}"


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="fitness_profile"
    )
    height_cm = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    weight_kg = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    goal_weight_kg = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    training_style = models.CharField(max_length=100, blank=True)
    habit_frequency = models.CharField(max_length=100, blank=True)
    emotional_tone = models.CharField(max_length=100, blank=True)
    intentions = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} profile"
