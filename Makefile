# get the current git tag
TAG=$(shell git rev-parse --short=8 HEAD)
NAME=jw-CHANGE-NAME-HERE
REGISTRY=dkr.tw.cx

.DEFAULT_GOAL: test
.PHONY: test install clean docker-image docker-run docker-test docker-push

test: test-base

test-base:
	sleep 10
	curl --retry 10 --retry-max-time 60 -i http://${AB_PORT_8080_TCP_ADDR}:${AB_PORT_8080_TCP_PORT}/

docker-test: docker-test-base

docker-test-base: docker-image-tag
	docker rm -f jwab_ab_1 ||:
	docker run -d --name jwab_ab_1 ${NAME}:${TAG}
	docker run --link "jwab_ab_1:ab" ${NAME}:${TAG} make test-base
	docker stop jwab_ab_1

docker-image: docker-image-tag docker-image-latest

docker-image-tag:
	docker build -t ${NAME}:${TAG} .
	docker tag -f ${NAME}:${TAG} ${REGISTRY}/${NAME}:${TAG}

docker-image-latest: docker-image-tag
	docker tag -f ${NAME}:${TAG} ${REGISTRY}/${NAME}:latest

docker-image-develop: docker-image-tag
	docker tag -f ${NAME}:${TAG} ${REGISTRY}/${NAME}:develop

docker-push: docker-push-tag docker-push-latest

docker-push-tag: docker-image-tag
	docker push ${REGISTRY}/${NAME}:${TAG}

docker-push-latest: docker-image-latest
	docker push ${REGISTRY}/${NAME}:latest

docker-push-develop: docker-image-develop
	docker push ${REGISTRY}/${NAME}:develop
