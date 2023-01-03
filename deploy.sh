#!/bin/bash

cd ~/ggogeet_backend
git pull origin master
docker build -t ggogeet_backend .
docker run -d -p 3000:3000 ggogeet_backend