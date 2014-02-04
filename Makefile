

test: vows kyuri

vows:
	vows --spec

kyuri:
	./bin/kyuri examples

.PHONY: test vows kyuri

