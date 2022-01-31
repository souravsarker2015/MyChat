from django.shortcuts import render


def room(request):
    return render(request, 'app/room.html')


def lobby(request):
    return render(request, 'app/lobby.html')
