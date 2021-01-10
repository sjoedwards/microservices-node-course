## Quick start

Start docker for MAC and enable Kubernetes - restart docker

Add to /etc/hosts

```
127.0.0.1 ticketing.dev
```

Add ingress-NGINX

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.43.0/deploy/static/provider/cloud/deploy.yaml
```

## Run skaffold k8s setup

Populate a .env file based off the .env.example file

Run secrets loader

```
cd ticketing/auth
sh ./secrets.sh
```

Install Skaffold

```
brew install skaffold
```

Run Skaffold

```
cd ticketing
skaffold dev
```

# GCloud kubectl k8 setup

Relies on the cluster being deployed in GKS

- GCP -> Search: Kubernetes engine -> Create Cluster

Install gcloud SDK

Initialise gcloud

```
gcloud init
```

Set context

```
gcloud container clusters get-credentials ticketing-dev
```

Look in docker for the kubernetes cluster - can now switch

Add the ingress and load balancer for the GKE cluster

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.43.0/deploy/static/provider/cloud/deploy.yaml
```

Get IP of load balancer from GCP > Home > Account > Networking

Add this to the /etc/hosts file, minus the port (443)

```
00.000.0.000 ticketing.dev
```

In skaffold.yaml, comment out local config and uncomment GCP config block

skaffold dev
