#!/bin/bash
REPOSITORY=/home/ubuntu/topic-app

cd $REPOSITORY

# 기존 컨테이너 확인 후 중지 및 삭제
if docker ps -a | grep -q noderedis; then
    docker stop noderedis
    docker rm noderedis
fi

if docker ps -a | grep -q nodeapp; then
    docker stop nodeapp
    docker rm nodeapp
fi

sudo docker-compose up -d