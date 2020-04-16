from .models import Student, Group
from .serializers import StudentSerializer, GroupSerializer
from rest_framework import generics

class StudentList(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset =Student.objects.all()
    serializer_class = StudentSerializer

class GroupList(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset =Group.objects.all()
    serializer_class = GroupSerializer