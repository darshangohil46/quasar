from django.urls import path
from .views import RegisterView, LoginView, AuthView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("auth/", AuthView.as_view(), name="auth"),
]
