

docker build -f .\backapi\api.dockerfile --tag backapi .\backapi\
docker compose -f .\deployment.yaml up