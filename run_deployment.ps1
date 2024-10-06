

docker build -f .\ml\ml.dockerfile --tag ml .\ml\
docker build -f .\backapi\api.dockerfile --tag backapi .\backapi\
docker compose -f .\deployment.yaml up