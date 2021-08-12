#!/bin/bash

kubectl create secret generic jwt-secret --from-env-file=.env
kubectl create secret generic stripe-secret --from-env-file=.env
