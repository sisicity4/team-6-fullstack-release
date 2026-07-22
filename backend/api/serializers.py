from rest_framework import serializers

from .models import Goal, HealthMetric, Reflection, UserProfile, WorkoutSession


class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reflection
        fields = [
            "id",
            "action",
            "mood",
            "notes",
            "emotion_tags",
            "next_step",
            "success",
            "logged_at",
        ]
        read_only_fields = ["id", "logged_at"]


class GoalSerializer(serializers.ModelSerializer):
    remaining_sessions = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "title",
            "target_sessions",
            "sessions_completed",
            "remaining_sessions",
            "target_date",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_remaining_sessions(self, obj):
        if obj.target_sessions <= 0:
            return 0
        remaining = obj.target_sessions - obj.sessions_completed
        return max(remaining, 0)


class WorkoutSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = [
            "id",
            "exercise_name",
            "distance_km",
            "duration_minutes",
            "calories",
            "heart_rate_avg",
            "heart_rate_max",
            "heart_rate_min",
            "intensity",
            "sets_count",
            "reps_count",
            "steps",
            "wearable_source",
            "wearable_device_id",
            "recovery_notes",
            "performed_at",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        positive_fields = [
            "distance_km",
            "duration_minutes",
            "calories",
            "heart_rate_avg",
            "heart_rate_max",
            "heart_rate_min",
            "sets_count",
            "reps_count",
            "steps",
        ]
        for field in positive_fields:
            value = attrs.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError({field: "must be greater than 0"})

        intensity = attrs.get("intensity")
        if intensity is not None and not (0 <= intensity <= 100):
            raise serializers.ValidationError(
                {"intensity": "must be between 0 and 100"}
            )

        heart_rate_min = attrs.get("heart_rate_min")
        heart_rate_max = attrs.get("heart_rate_max")
        if heart_rate_min is not None and heart_rate_max is not None:
            if heart_rate_min > heart_rate_max:
                raise serializers.ValidationError(
                    {"heart_rate_min": "must be less than or equal to heart_rate_max"}
                )

        return attrs


class HealthMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthMetric
        fields = [
            "id",
            "weight_kg",
            "height_cm",
            "body_fat_percent",
            "resting_heart_rate",
            "recorded_at",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        positive_fields = [
            "weight_kg",
            "height_cm",
            "body_fat_percent",
            "resting_heart_rate",
        ]
        for field in positive_fields:
            value = attrs.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError({field: "must be greater than 0"})
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "height_cm",
            "weight_kg",
            "goal_weight_kg",
            "training_style",
            "habit_frequency",
            "emotional_tone",
            "intentions",
        ]
        extra_kwargs = {
            "height_cm": {"allow_null": True},
            "weight_kg": {"allow_null": True},
            "goal_weight_kg": {"allow_null": True},
        }

    def validate(self, attrs):
        for field in ["height_cm", "weight_kg", "goal_weight_kg"]:
            value = attrs.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError({field: "must be greater than 0"})
        return attrs
