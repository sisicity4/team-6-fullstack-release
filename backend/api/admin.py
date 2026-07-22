from django.contrib import admin

from .models import Goal, HealthMetric, Reflection, UserProfile, WorkoutSession


admin.site.register(Goal)
admin.site.register(Reflection)
admin.site.register(WorkoutSession)
admin.site.register(HealthMetric)
admin.site.register(UserProfile)
