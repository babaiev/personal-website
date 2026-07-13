import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from blog.models import Post

posts = Post.objects.all()
for post in posts:
    content = post.content
    if '<p>' not in content and '<br>' not in content and '<div>' not in content:
        # Split by \r\n or \n
        content = content.replace('\r\n', '\n')
        paragraphs = content.split('\n\n')
        html_paragraphs = []
        for p in paragraphs:
            if p.strip():
                p_html = p.replace('\n', '<br>')
                html_paragraphs.append(f'<p>{p_html}</p>')
        
        post.content = ''.join(html_paragraphs)
        post.save()
        print(f"Updated post: {post.title}")
    else:
        print(f"Skipped post (already HTML): {post.title}")
print("Done.")
