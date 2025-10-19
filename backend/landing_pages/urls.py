from django.urls import path
from . import views
from .contact_views import contact_form

urlpatterns = [
    path('contact/', contact_form, name='contact-form'),
    path('landing-pages/<slug:slug>/', views.get_landing_page, name='get_landing_page'),
    path('landing-pages/<slug:slug>/submit/', views.submit_landing_page_step, name='submit_landing_page_step'),
    path('waiting-list/', views.waiting_list_submit, name='waiting_list_submit'),
]
