from djongo import models


class User(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Team(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    members = models.JSONField(default=list)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    _id = models.ObjectIdField()
    user = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=100)
    duration = models.FloatField()
    date = models.DateField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user} - {self.activity_type}"


class Leaderboard(models.Model):
    _id = models.ObjectIdField()
    user = models.CharField(max_length=100)
    score = models.IntegerField()

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.user} - {self.score}"


class Workout(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField()

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
