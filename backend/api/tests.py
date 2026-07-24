from datetime import timedelta
from io import StringIO

from django.contrib.auth.models import User
from django.core.management import call_command
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Reflection, WorkoutSession


class FitnessApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass1234")
        self.client.force_authenticate(user=self.user)

    def test_create_workout_session(self):
        payload = {
            "exercise_name": "ランニング",
            "distance_km": "3.50",
            "duration_minutes": 20,
            "calories": 180,
            "heart_rate_avg": 130,
            "intensity": 70,
            "sets_count": 3,
            "reps_count": 12,
            "recovery_notes": "軽めに調整",
        }
        response = self.client.post("/api/workouts/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["exercise_name"], "ランニング")

    def test_health_check(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"status": "ok"})

    def test_frontend_entrypoint_is_served_when_built(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<div id="root"></div>', html=False)

    def test_register_rejects_weak_password(self):
        response = self.client.post(
            "/api/register/",
            {"username": "new-user", "password": "short"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("password", response.data)

    def test_register_then_login_returns_jwt_pair(self):
        self.client.force_authenticate(user=None)
        registered = self.client.post(
            "/api/register/",
            {"username": "new-user", "password": "A-secure-password-2026!"},
            format="json",
        )
        self.assertEqual(registered.status_code, 201)

        logged_in = self.client.post(
            "/api/login/",
            {"username": "new-user", "password": "A-secure-password-2026!"},
            format="json",
        )
        self.assertEqual(logged_in.status_code, 200)
        self.assertIn("access", logged_in.data)
        self.assertIn("refresh", logged_in.data)

    def test_reflection_log_is_upserted_per_day(self):
        payload = {
            "log_date": "2026-07-22",
            "action": "30秒のリズムストレッチ",
            "success": False,
            "reason_id": "time",
            "counter_duration_seconds": 30,
        }
        created = self.client.post("/api/reflections/", payload, format="json")
        self.assertEqual(created.status_code, 201)

        payload["counter_duration_seconds"] = 0
        updated = self.client.post("/api/reflections/", payload, format="json")
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(Reflection.objects.filter(user=self.user).count(), 1)
        self.assertEqual(updated.data["counter_duration_seconds"], 0)

        listed = self.client.get("/api/reflections/")
        self.assertEqual(listed.status_code, 200)
        self.assertEqual(listed.data[0]["reason_id"], "time")

    def test_workout_summary(self):
        self.client.post(
            "/api/workouts/",
            {"exercise_name": "バイク", "duration_minutes": 15, "intensity": 60},
            format="json",
        )
        response = self.client.get("/api/workouts/summary/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_sessions"], 1)

    def test_create_body_metric(self):
        payload = {
            "weight_kg": "62.5",
            "height_cm": "172.0",
            "body_fat_percent": "18.0",
            "resting_heart_rate": 62,
        }
        response = self.client.post("/api/body-metrics/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["weight_kg"], "62.50")

    def test_profile_update(self):
        payload = {
            "height_cm": "170.0",
            "weight_kg": "60.0",
            "training_style": "HIIT",
            "emotional_tone": "穏やか",
            "intentions": "次は深呼吸を意識する",
        }
        response = self.client.post("/api/profile/", payload, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["training_style"], "HIIT")
        self.assertEqual(response.data["emotional_tone"], "穏やか")
        self.assertEqual(response.data["intentions"], "次は深呼吸を意識する")

    def test_inactive_users_command(self):
        active_user = User.objects.create_user(username="runner", password="pass1234")
        WorkoutSession.objects.create(
            user=active_user,
            exercise_name="ランニング",
            performed_at=timezone.now() - timedelta(days=1),
        )
        out = StringIO()
        call_command("notify_inactive_users", days=7, stdout=out)
        output = out.getvalue()
        self.assertIn("Inactive users", output)
        self.assertIn(self.user.username, output)
        self.assertNotIn(active_user.username, output)
