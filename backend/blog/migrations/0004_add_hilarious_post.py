from django.db import migrations
from django.utils import timezone

def create_hilarious_post(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    title = "Adding Comments and Reactions (Because Apparently My AI Wants Me to Be Social)"
    slug = "adding-comments-and-reactions-with-ai"
    content = """So check it out. Me and this smartass AI spent like half the day making this site actually interactive. Why? Because sitting here typing into the void wasn't enough, we needed a way for YOU to yell at me in the comments. 

First off, we built a whole damn **Reactions System**. You know, likes and dislikes. 👍 👎 It ain't just front-end trickery though. We wired that stuff all the way back to the Django database running on Google Cloud Run. And because I know how people are, we added some `localStorage` wizardry so you can't just spam the like button 500 times. You get ONE like, or one dislike. Use it wisely, or don't. We also made the view counter actually smart so if you refresh the page 20 times like a psychopath it only counts as one view. 

Then came the **Comments Section**. 
We had to build a whole new database model, hook it up to the API, and build the React forms. BUT, here's the best part... I don't want bots trying to sell me fake Ray-Bans in my own blog. So we slapped a **Math Captcha** on it. 

You try to submit a comment? BOOM. 
*To prove you are human, please solve this math problem: `7 + 2 = ?`*

If you can't do basic addition, you don't get to comment on my site. It's beautiful. If you type the wrong number it wipes it and gives you a new one. Get rekt, spam bots.

### How much time did it take?
Honestly? A couple of hours. I just kept yelling at the AI: 
*"bro make the cards fully clickable!"* 
*"yo make sure the view count doesn't say NaN, what the hell!"* 
*"bruh I need this in the Django Admin so I can delete dumb comments!"*

And the AI just chugged along, wrote the models, pushed the migrations, generated the serializers, built the React components, bumped the versions, and threw it up on Cloud Run. 

Here is literally an example of the React code we wrote to handle the captcha:
```javascript
  const handleCaptchaSubmit = async () => {
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setCommentError('Incorrect answer. Please try again bro.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
      return;
    }
    // Proceed to dump your comment into my database
  };
```

Yeah. So now you can comment. Go ahead. Test the captcha. Tell me my site looks too green. See if I care (I do, the dark green looks dope).

Alright, I'm out. Peace.
"""
    Post.objects.get_or_create(
        slug=slug,
        defaults={
            'title': title,
            'content': content,
            'is_published': True,
            'published_at': timezone.now(),
            'cover_image': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=2000'
        }
    )

def remove_hilarious_post(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    Post.objects.filter(slug="adding-comments-and-reactions-with-ai").delete()


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_comment'),
    ]

    operations = [
        migrations.RunPython(create_hilarious_post, remove_hilarious_post),
    ]
