#!/bin/bash

cd ~/ggogeet_backend
git pull origin master
sudo docker stop $(sudo docker ps -a -q)
sudo docker build -t ggogeet_backend .
sudo docker run -d -p 3000:3000 ggogeet_backend