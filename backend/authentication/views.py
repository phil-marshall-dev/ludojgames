from api.models import Profile
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password1 = data.get('password1')
        password2 = data.get('password2')
        email = data.get('email')

        if password1 == password2:
            user = User.objects.create_user(username=username, password=password1, email=email)
            Profile.objects.create(user=user)
            login(request, user)
            return JsonResponse({'message': 'Registration successful'}, status=201)
        else:
            return JsonResponse({'error': 'Passwords do not match.'}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=400)


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            print('logging in ', user)
            login(request, user)
            return JsonResponse({'message': 'Login successful!'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid username or password.'}, status=401)

    return JsonResponse({'error': 'Invalid method'}, status=400)


@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        print("User logged out:", request.user)  # Log the user
        return JsonResponse({'message': 'Logout successful!'}, status=200)

    return JsonResponse({'error': 'Invalid method'}, status=400)

@csrf_exempt
def session_view(request):
    if request.method == 'GET':
        print("User session for:", request.user)
        session_data = {
            'isAuthenticated': request.user.is_authenticated,
            'username': request.user.username if request.user.is_authenticated else '',
            'userId': request.user.id if request.user.is_authenticated else 0
        }
        return JsonResponse(session_data)
    
    return JsonResponse({'error': 'Invalid method'}, status=400)