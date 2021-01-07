## Quick start

Start docker for MAC and enable Kubernetes - restart docker

Add to /etc/hosts

```
127.0.0.1 posts.com
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
cd blog
skaffold dev
```

## Manual K8s setup

Apply the service (NodePort) & deployments:

```
cd infra/k8s
kubectl apply -f .

```

To build images

```
docker build -t sjoedwards1/image-name .
```

To push

```
docker login
docker push
```

To restart deployment

```
k rollout restart deployment [deploy name, i.e. event-bus-depl]
```
