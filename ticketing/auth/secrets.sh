#!/bin/bash

kubectl create secret generic jwt-secret --from-env-file=.env