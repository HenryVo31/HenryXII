# Generated by Django 2.2.3 on 2019-07-12 05:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0007_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='menu',
            name='price',
            field=models.FloatField(default=0.0, max_length=64),
            preserve_default=False,
        ),
    ]