from django.urls import path
from . import views

urlpatterns = [
    path('landing-pages/<slug:slug>/', views.get_landing_page, name='get_landing_page'),
    path('landing-pages/<slug:slug>/submit/', views.submit_landing_page_step, name='submit_landing_page_step'),
]
