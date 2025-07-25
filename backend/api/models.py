from django.db import models

class Video(models.Model):
    vid_id = models.TextField()
    title = models.TextField()
    transcript = models.TextField()
    category_1 = models.TextField()
    category_2 = models.TextField()
    task_id = models.TextField()
    punctuated = models.BooleanField()
    transcript_num_chars = models.IntegerField()
    default_language = models.TextField()
    default_audio_language = models.TextField()

class Channel(models.Model):
    channel_id= models.TextField()
    title= models.TextField()
    description= models.TextField()
    channel_url=models.TextField()
    thumbnail= models.TextField()
    published_at = models.TextField()
    subscriber_count = models.IntegerField()
    video_count = models.IntegerField()
    view_count = models.IntegerField()

class Episode(models.Model):
    transcript = models.TextField()
    questions = models.JSONField(null=True, blank=True)