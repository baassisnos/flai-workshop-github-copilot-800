from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'password']

    def get__id(self, obj):
        return str(obj._id)


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']

    def get__id(self, obj):
        return str(obj._id)


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'user', 'activity_type', 'duration', 'date']

    def get__id(self, obj):
        return str(obj._id)


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'user', 'score']

    def get__id(self, obj):
        return str(obj._id)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'duration']

    def get__id(self, obj):
        return str(obj._id)
