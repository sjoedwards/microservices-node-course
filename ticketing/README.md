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

Need to build all of the images locally & push to docker hub once first

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

Should be able to access application on https://ticketing.dev

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

### Port forwarding

- To access a specific pod without going through the ingress you can set up a port forward
- kubectl port-forward [pod-name] portIn:targetPort
- i.e. kubectl port-forward nats-depl-d6b48b4b8-n2nkw 4222:4222

### To see NATS dashboard

Terminal 1:
kubectl port-forward [nats-pod-name] 4222:4222

Terminal 2:
kubectl port-forward [nats-pod-name] 8222:8222

Navigate to http://localhost:8222/streaming

More information about the channels:
http://localhost:8222/streaming/channelsz?subs=1

To flush the NATS server:
kubectl delete pod [nats-pod-name]

Will create a new NATS pod with the updated values
