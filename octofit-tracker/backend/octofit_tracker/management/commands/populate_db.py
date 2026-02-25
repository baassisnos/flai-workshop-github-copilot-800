from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users_data = [
            {'username': 'Spider-Man', 'email': 'spiderman@marvel.com', 'password': 'withgreatpower'},
            {'username': 'Iron Man', 'email': 'ironman@marvel.com', 'password': 'iamironman'},
            {'username': 'Captain America', 'email': 'capamerica@marvel.com', 'password': 'icanDothis'},
            {'username': 'Thor', 'email': 'thor@marvel.com', 'password': 'mjolnir'},
            {'username': 'Black Widow', 'email': 'blackwidow@marvel.com', 'password': 'natasha'},
            {'username': 'Batman', 'email': 'batman@dc.com', 'password': 'brucewayne'},
            {'username': 'Superman', 'email': 'superman@dc.com', 'password': 'krypton'},
            {'username': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'password': 'themyscira'},
            {'username': 'The Flash', 'email': 'flash@dc.com', 'password': 'speedforce'},
            {'username': 'Green Lantern', 'email': 'greenlantern@dc.com', 'password': 'willpower'},
        ]
        users = {}
        for data in users_data:
            user = User.objects.create(**data)
            users[data['username']] = user
            self.stdout.write(f"  Created user: {data['username']}")

        self.stdout.write('Creating teams...')
        marvel_members = [
            users['Spider-Man'].username,
            users['Iron Man'].username,
            users['Captain America'].username,
            users['Thor'].username,
            users['Black Widow'].username,
        ]
        dc_members = [
            users['Batman'].username,
            users['Superman'].username,
            users['Wonder Woman'].username,
            users['The Flash'].username,
            users['Green Lantern'].username,
        ]
        Team.objects.create(name='Team Marvel', members=marvel_members)
        Team.objects.create(name='Team DC', members=dc_members)
        self.stdout.write('  Created Team Marvel and Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': 'Spider-Man', 'activity_type': 'Web Swinging', 'duration': 45.0, 'date': date(2024, 1, 10)},
            {'user': 'Iron Man', 'activity_type': 'Flying', 'duration': 60.0, 'date': date(2024, 1, 10)},
            {'user': 'Captain America', 'activity_type': 'Shield Training', 'duration': 90.0, 'date': date(2024, 1, 11)},
            {'user': 'Thor', 'activity_type': 'Hammer Throws', 'duration': 30.0, 'date': date(2024, 1, 11)},
            {'user': 'Black Widow', 'activity_type': 'Martial Arts', 'duration': 75.0, 'date': date(2024, 1, 12)},
            {'user': 'Batman', 'activity_type': 'Cape Gliding', 'duration': 50.0, 'date': date(2024, 1, 10)},
            {'user': 'Superman', 'activity_type': 'Flying', 'duration': 120.0, 'date': date(2024, 1, 10)},
            {'user': 'Wonder Woman', 'activity_type': 'Lasso Training', 'duration': 80.0, 'date': date(2024, 1, 11)},
            {'user': 'The Flash', 'activity_type': 'Speed Running', 'duration': 15.0, 'date': date(2024, 1, 12)},
            {'user': 'Green Lantern', 'activity_type': 'Ring Constructs', 'duration': 55.0, 'date': date(2024, 1, 12)},
        ]
        for data in activities_data:
            Activity.objects.create(**data)
            self.stdout.write(f"  Created activity: {data['user']} - {data['activity_type']}")

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            {'user': 'Spider-Man', 'score': 950},
            {'user': 'Iron Man', 'score': 1100},
            {'user': 'Captain America', 'score': 1050},
            {'user': 'Thor', 'score': 1200},
            {'user': 'Black Widow', 'score': 980},
            {'user': 'Batman', 'score': 1080},
            {'user': 'Superman', 'score': 1300},
            {'user': 'Wonder Woman', 'score': 1150},
            {'user': 'The Flash', 'score': 1400},
            {'user': 'Green Lantern', 'score': 1020},
        ]
        for data in leaderboard_data:
            Leaderboard.objects.create(**data)
            self.stdout.write(f"  Created leaderboard entry: {data['user']} - {data['score']}")

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Web-Slinger Cardio',
                'description': 'High-intensity cardio workout inspired by Spider-Man\'s web swinging through NYC.',
                'duration': 45,
            },
            {
                'name': 'Iron Man Power Circuit',
                'description': 'Strength and endurance training modeled after Tony Stark\'s suit-building workouts.',
                'duration': 60,
            },
            {
                'name': 'Super Soldier Training',
                'description': 'Full-body workout combining strength, agility, and endurance like Captain America.',
                'duration': 90,
            },
            {
                'name': 'Asgardian Strength',
                'description': 'Heavy lifting and power training inspired by Thor\'s legendary strength.',
                'duration': 75,
            },
            {
                'name': 'Dark Knight HIIT',
                'description': 'High-intensity interval training based on Batman\'s vigilante conditioning regimen.',
                'duration': 60,
            },
        ]
        for data in workouts_data:
            Workout.objects.create(**data)
            self.stdout.write(f"  Created workout: {data['name']}")

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
