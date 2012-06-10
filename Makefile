#!/usr/bin/make -f

##
# JOJ gh-pages (jumpOnJuniper gh-pages)
##
PROJ := joj
GITHUBPROJ := jumpOnJuniper

# directories/paths
COMMONLIB := $$HOME/common/lib

# files
HTMLFILE := $(PROJ).html

# urls
SRCURL := https://raw.github.com/mobilemind/$(GITHUBPROJ)/master/src/

# macros/utils
BUILDDATE := $(shell date)
VERSION = $(shell curl -sf $(SRCURL)/VERSION.txt | head -n 1)g
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
HTMLCOMPRESSORPATH := $(shell [[ 'cygwin' == $$OSTYPE ]] && echo "`cygpath -w $(COMMONLIB)`\\" || echo "$(COMMONLIB)/")
HTMLCOMPRESSOR := java -jar '$(HTMLCOMPRESSORPATH)htmlcompressor-1.5.2.jar'
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces min --compress-js --compress-css
TIDY := $(shell hash tidy-html5 2>/dev/null && echo 'tidy-html5' || (hash tidy 2>/dev/null && echo 'tidy' || exit 1))
JSL := $(shell hash jsl 2>/dev/null && echo 'jsl' || exit 1)
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
REPLACETOKENS = perl -pi -e 's/_MmVERSION_/$(VERSION)/g;s/_MmBUILDDATE_/$(BUILDDATE)/g;s/ manifest=.*?(?= |>)//g' $@


default: $(HTMLFILE) img
	@printf "\nmake: Done. Updated $(HTMLFILE) to $(VERSION).\n\n"

%.html:
	@printf "\nFetch from github and update $@\n"
	@curl -# -O $(SRCURL)/$@
	@$(REPLACETOKENS)
	@$(TIDY) -eq $@; [[ $$? -lt 2 ]] && true
	@$(JSL) -nologo -nofilelisting -nosummary -process $@
	@$(HTMLCOMPRESSOR) $(COMPRESSOPTIONS) -o $@.tmp $@ && mv -f $@.tmp $@

img:
	@[[ -d img ]] || mkdir img
	@printf "\nFetch from $$MYSERVER and update $@\n"
	@rsync -ptuq "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me/img/*.*" img

.PHONY: deploy
deploy: default
	@printf "make: \tDeploy: Checking  git diff --name-only  as trigger to update gh-pages\n"
	@[[ -n "$(shell git diff --name-only)" ]] && ( \
		git commit -a -m 'revised HTML to v$(VERSION)' && git push origin gh-pages; \
		( git tag $(VERSION) && git push --tags origin gh-pages ) && \
			$(GRECHO) "\nmake: \tDeploy: Done. Updated gh-pages to v$(VERSION). To return to master do:\
				\n\tgit checkout master && make clean\n\n" \
	) || $(GRECHO) "\nmake: \tDeploy: Done. No changed files.\n\n"

.PHONY: clean
clean:
	rm -rf $(HTMLFILE) img
