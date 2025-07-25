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

