#!/bin/bash

cd ~/ggogeet_backend
git pull origin master
sudo docker-compose up --build -d