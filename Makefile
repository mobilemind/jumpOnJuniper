#!/usr/bin/make -f

##
# JOJ gh-pages (jumpOnJuniper gh-pages)
##
PROJ := joj
GITHUBPROJ := jumpOnJuniper

# directories/paths
IMGDIR := img
COMMONLIB := $$HOME/common/lib

# files
MANIFEST := $(PROJ).manifest
HTMLFILE := $(PROJ).html
VERSIONTXT := VERSION.txt

# urls
SRCURL := https://raw.github.com/mobilemind/$(GITHUBPROJ)/master/src/

# macros/utils
MMBUILDDATE := _MmBUILDDATE_
BUILDDATE := $(shell date)
MMVERSION := _MmVERSION_
VERSION = $(shell curl -sf $(SRCURL)/$(VERSIONTXT) | head -n 1)
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')# macros/utils
HTMLCOMPRESSORJAR := htmlcompressor-1.5.2.jar
HTMLCOMPRESSORPATH := $(shell [[ 'cygwin' == $$OSTYPE ]] && echo "`cygpath -w $(COMMONLIB)`\\" || echo "$(COMMONLIB)/")
HTMLCOMPRESSOR := java -jar '$(HTMLCOMPRESSORPATH)$(HTMLCOMPRESSORJAR)'
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces min --compress-js --compress-css
TIDY := $(shell hash tidy-html5 2>/dev/null && echo 'tidy-html5' || (hash tidy 2>/dev/null && echo 'tidy' || exit 1))
JSL := $(shell hash jsl 2>/dev/null && echo 'jsl' || exit 1)
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
REPLACETOKENS = perl -p -i -e 's/$(MMVERSION)/$(VERSION)/g;' $@; perl -p -i -e 's/$(MMBUILDDATE)/$(BUILDDATE)/g;' $@


default: $(HTMLFILE) $(MANIFEST) $(IMGDIR)
	@printf "\nmake: Done. Updated $(HTMLFILE) and $(MANIFEST) to $(VERSION).\n\n"

%.html:
	@printf "\nFetch from github and update $@\n"
	@curl -# -O $(SRCURL)/$@
	@$(REPLACETOKENS)
	@$(TIDY) -eq $@; [[ $$? -lt 2 ]] && true
	@$(JSL) -nologo -nofilelisting -nosummary -process $@
	@$(HTMLCOMPRESSOR) $(COMPRESSOPTIONS) -o $@.tmp $@ && mv -f $@.tmp $@

%.manifest: $(HTMLFILE)
	@printf "\nFetch from github and update $@\n"
	@curl -# -O $(SRCURL)/$@
	@$(REPLACETOKENS)

$(IMGDIR):
	@[[ -d $(IMGDIR) ]] || mkdir $(IMGDIR)
	@printf "\nFetch from $$MYSERVER and update $@\n"
	@rsync -ptuq "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me/img/*.*" $(IMGDIR)

.PHONY: deploy
deploy: default
	@printf "make: \tDeploy: Checking  git diff --name-only  as trigger to update gh-pages\n"
	@[[ -z "$(shell git diff --name-only)" ]] && $(GRECHO) "\nmake: \tDeploy: Done. No changed files.\n\n" || true
	@[[ -n "$(shell git diff --name-only)" ]] && ( \
		git commit -a -m 'revised HTML to v$(VERSION)' && git push; \
		( git tag $(VERSION) && git push --tags ) && \
			$(GRECHO) "\nmake: \tDeploy: Done. Updated gh-pages to v$(VERSION). To return to master do:\
				\n\tgit checkout master && make clean\n\n" \
	) || true

.PHONY: clean
clean:
	rm -rf $(HTMLFILE) $(MANIFEST) $(IMGDIR)
