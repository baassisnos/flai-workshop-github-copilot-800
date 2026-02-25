from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='Spider-Man',
            email='spiderman@marvel.com',
            password='withgreatpower',
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_user_created(self):
        self.assertEqual(self.user.username, 'Spider-Man')
        self.assertEqual(self.user.email, 'spiderman@marvel.com')

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Spider-Man')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['Spider-Man', 'Iron Man', 'Thor'],
        )

    def tearDown(self):
        Team.objects.all().delete()

    def test_team_created(self):
        self.assertEqual(self.team.name, 'Team Marvel')
        self.assertIn('Iron Man', self.team.members)

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Batman',
            activity_type='Cape Gliding',
            duration=50.0,
            date=date(2024, 1, 10),
        )

    def tearDown(self):
        Activity.objects.all().delete()

    def test_activity_created(self):
        self.assertEqual(self.activity.user, 'Batman')
        self.assertEqual(self.activity.activity_type, 'Cape Gliding')
        self.assertEqual(self.activity.duration, 50.0)

    def test_activity_str(self):
        self.assertEqual(str(self.activity), 'Batman - Cape Gliding')


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user='The Flash',
            score=1400,
        )

    def tearDown(self):
        Leaderboard.objects.all().delete()

    def test_leaderboard_created(self):
        self.assertEqual(self.entry.user, 'The Flash')
        self.assertEqual(self.entry.score, 1400)

    def test_leaderboard_str(self):
        self.assertEqual(str(self.entry), 'The Flash - 1400')


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Dark Knight HIIT',
            description='High-intensity interval training based on Batman\'s regimen.',
            duration=60,
        )

    def tearDown(self):
        Workout.objects.all().delete()

    def test_workout_created(self):
        self.assertEqual(self.workout.name, 'Dark Knight HIIT')
        self.assertEqual(self.workout.duration, 60)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Dark Knight HIIT')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='Iron Man',
            email='ironman@marvel.com',
            password='iamironman',
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'username': 'Thor', 'email': 'thor@marvel.com', 'password': 'mjolnir'}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team DC',
            members=['Batman', 'Superman'],
        )

    def tearDown(self):
        Team.objects.all().delete()

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'Team Marvel', 'members': ['Spider-Man', 'Thor']}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Superman',
            activity_type='Flying',
            duration=120.0,
            date=date(2024, 1, 10),
        )

    def tearDown(self):
        Activity.objects.all().delete()

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(user='Wonder Woman', score=1150)

    def tearDown(self):
        Leaderboard.objects.all().delete()

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Asgardian Strength',
            description='Heavy lifting inspired by Thor.',
            duration=75,
        )

    def tearDown(self):
        Workout.objects.all().delete()

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ApiRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

    def test_api_root_prefix(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
