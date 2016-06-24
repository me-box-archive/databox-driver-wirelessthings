#!/usr/bin/env bash

sudo docker run -p 1883:1883 -d --name mosquitto ansi/mosquitto
