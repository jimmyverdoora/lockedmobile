# Generated by Django 2.2.6 on 2019-12-16 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='currentForbidden',
            field=models.CharField(default=None, max_length=2, null=True),
        ),
    ]
