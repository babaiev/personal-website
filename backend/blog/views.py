from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    # Only return published posts by default
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['post'])
    def like(self, request, slug=None):
        post = self.get_object()
        post.likes += 1
        post.save(update_fields=['likes'])
        return Response({'status': 'liked', 'likes': post.likes})

    @action(detail=True, methods=['post'])
    def unlike(self, request, slug=None):
        post = self.get_object()
        if post.likes > 0:
            post.likes -= 1
            post.save(update_fields=['likes'])
        return Response({'status': 'unliked', 'likes': post.likes})

    @action(detail=True, methods=['post'])
    def dislike(self, request, slug=None):
        post = self.get_object()
        post.dislikes += 1
        post.save(update_fields=['dislikes'])
        return Response({'status': 'disliked', 'dislikes': post.dislikes})

    @action(detail=True, methods=['post'])
    def undislike(self, request, slug=None):
        post = self.get_object()
        if post.dislikes > 0:
            post.dislikes -= 1
            post.save(update_fields=['dislikes'])
        return Response({'status': 'undisliked', 'dislikes': post.dislikes})

    @action(detail=True, methods=['post'])
    def view(self, request, slug=None):
        post = self.get_object()
        post.view_count += 1
        post.save(update_fields=['view_count'])
        return Response({'status': 'viewed', 'view_count': post.view_count})
