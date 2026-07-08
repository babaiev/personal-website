import os

class VersionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.version = "Unknown"
        
        # Read the VERSION file from the root directory
        version_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'VERSION')
        try:
            with open(version_path, 'r') as f:
                self.version = f.read().strip()
        except FileNotFoundError:
            pass

    def __call__(self, request):
        response = self.get_response(request)
        response['X-App-Version'] = self.version
        return response
