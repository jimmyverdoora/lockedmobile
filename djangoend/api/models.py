from datetime import datetime
from django.db import models

# Create your models here.
class Game(models.Model):

    guid = models.CharField(max_length=36, unique=True)
    # 0 running, -1 first player won, 1 second player won
    state = models.IntegerField()
    currentForbidden = models.CharField(max_length=2, default=None, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    modifiedAt = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=['guid'])]

    def storicize(self):
        StorGame.objects.create(guid=self.guid, state=self.state, createdAt=self.createdAt)


class Move(models.Model):

    value = models.CharField(max_length=3)
    number = models.IntegerField()
    game = models.ForeignKey('Game', on_delete=models.CASCADE,
        related_name='moves')
    
    class Meta:
        ordering = ['number']


class Piece(models.Model):

    # Number conventions: first player: 1, 2, 3 from left to right
    # second player: 4, 5, 6
    number = models.IntegerField()
    # -1 first player, 1 second player
    player = models.IntegerField()
    # Coordinates starts from 1
    x = models.IntegerField()
    y = models.IntegerField()
    game = models.ForeignKey('Game', on_delete=models.CASCADE,
        related_name='pieces')

    def __str__(self):
        return str(self.number) + ") x: " + str(self.x) + ", y: " + str(self.y)

class StorGame(models.Model):

    guid = models.CharField(max_length=36, unique=True)
    state = models.IntegerField()
    createdAt = models.DateTimeField()
    storicizedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['createdAt'])]


class DailyReport(models.Model):
    
    date = models.DateField(auto_now_add=True)
    totGames = models.IntegerField()
    completedGames = models.IntegerField()


class Valore(models.Model):

    chiave = models.CharField(max_length=16, unique=True)
    valore = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField()
    class Meta:
        indexes = [models.Index(fields=['chiave'])]