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

Install Skaffold

```
brew install skaffold
```

Run Skaffold

```
cd ticketing
skaffold dev
```
