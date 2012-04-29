#!/usr/bin/make -f

##
# JOJ PROJECT (jumpOnJuniper)
##
PROJ := joj
GITHUBPROJ := jumpOnJuniper
# directories/paths
IMGDIR := img
TMPDIR := $$HOME/.$(PROJ)
# files
MANIFESTS := $(PROJ).manifest $(SUBPROJ).manifest
HTMLFILES := $(PROJ).html $(SUBPROJ).html
VERSIONTXT := VERSION.txt
# urls
VERSIONURL := https://raw.github.com/mobilemind/$(GITHUBPROJ)/master/src/$(VERSIONTXT)
# macros/utils
MANIFESTS := $(PROJ).manifest
HTMLFILES := $(PROJ).html
VERSION = $(shell head -1 $(VERSIONTXT))
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')

default: $(HTMLFILES) | $(VERSIONTXT)
	@printf "\nmake: \tUpdating gh-pages root files\n"
	@rsync -ptu --executability $(TMPDIR)/*.manifest .
	@[[ -d $(IMGDIR) ]] || mkdir $(IMGDIR)
	@rsync -ptu $(TMPDIR)/$(IMGDIR)/*.* $(IMGDIR)
	@printf "\nmake: Done.\n\n"

%.html: %.gz
	@gunzip -fv $^ && mv -v $(shell basename $^ .gz) $@

%.gz:
	@printf "\n\tCopy and uncompress $@\n"
	@cp -fpv $(TMPDIR)/$(shell basename $@ .gz) $@

$(VERSIONTXT):
	@curl -# -o $@ $(VERSIONURL)

.PHONY: deploy
deploy: default
	@printf "make: \tDeploy: Checking  git diff --name-only  as trigger to update gh-pages\n"
	@[[ -z "$(shell git diff --name-only)" ]] && printf "\nNo changed files.\n\n" || true
	@[[ -n "$(shell git diff --name-only)" ]] && ( \
		git commit -a -m 'revised HTML to v$(VERSION)' && git push; \
		( git tag $(VERSION) && git push --tags ) && \
			$(GRECHO) "\nmake: \tDeploy: Done. Updated gh-pages from $(TMPDIR) to v$(VERSION). To return to master do:\
				\n\tgit checkout master && make clean\n\n" \
	) || true

.PHONY: clean
clean:
	rm -fv $(HTMLFILES) $(MANIFESTS) $(VERSION)

.PHONY: purge
purge:
	@[[ ! -d $(TMPDIR) ]] || rm -rfv $(TMPDIR)
