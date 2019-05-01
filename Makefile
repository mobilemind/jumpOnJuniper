#!/usr/bin/make -w -r -f

##
# JOJ gh-pages (jumpOnJuniper gh-pages)
##
PROJ := joj
GITHUBPROJ := jumpOnJuniper

# directories/paths
COMMONLIB := $$HOME/common/lib

# files
JOJHTML := $(PROJ).html
PROJFILES := $(JOJHTML) $(PROJ).css $(PROJ).js $(PROJ).manifest
HTMLFILES := $(PROJFILES) index.html
JOJFILE := joj.url

# urls
PROJURL:= https://raw.githubusercontent.com/mobilemind/$(GITHUBPROJ)
SRCURL := $(PROJURL)/master/src
JOJURL := $(PROJURL)/master/web/$(JOJFILE)

# macros/utils
BUILDDATE := $(shell date)
VERSION = 7.5.4g
GRECHO = $(shell hash grecho >/dev/null 2>&1  && echo 'grecho' || echo 'printf')
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces all --remove-input-attr --remove-form-attr --remove-script-attr --remove-http-protocol --simple-doctype --compress-js --compress-css --nomunge
TIDY := $(shell hash tidy >/dev/null 2>&1 && echo 'tidy' || echo 'echo "WARNING unable to: tidy"')
JSL := $(shell type -p jsl || echo 'echo "WARNING unable to (JavasSript lint): jsl"')
GRECHO = $(shell hash grecho >/dev/null 2>&1  && echo 'grecho' || echo 'printf')
REPLACETOKENS = perl -pi -e 's/_MmVERSION_/$(VERSION)/g;s/_MmBUILDDATE_/$(BUILDDATE)/g' $@
STATFMT := $(shell [ 'cygwin' = $$OSTYPE ] && echo '-c %s' || echo '-f%z' )

default: $(HTMLFILES) img
	@printf "\nmake: Done. Updated $(HTMLFILES) to $(VERSION).\n\n"

$(PROJ).html:
	@printf "\nFetch $@ from github and update...\n"
	@curl -# -O $(SRCURL)/$@
	@$(REPLACETOKENS)
	@$(TIDY) -eq $@ || [ $$? -lt 2 ]
	@$(JSL) -nologo -nofilelisting -nosummary -process $@
	@echo "$@: $$(stat $(STATFMT) $@) bytes"

$(PROJ).css:
	@printf "\nFetch $@ from github...\n"
	@curl -# -O $(SRCURL)/$@

$(PROJ).js:
	@printf "\nFetch $@ from github and update...\n"
	@curl -# -O $(SRCURL)/$@
	@$(REPLACETOKENS)

$(PROJ).manifest:
	@printf "\nFetch $@ from github and update...\n"
	@curl -# -O $(SRCURL)/$@
	@$(REPLACETOKENS)

index.html: $(JOJFILE)
	@printf "\nReplace tokens in $@ and validate...\n"
	@perl -p -i -e 'BEGIN{open F,"$(JOJFILE)";@f=<F>}s#data:text/html;charset=utf-8;base64,.*" class="desclink"#@f" class="desclink"#' $@
	@$(TIDY) -eq $@ || [ $$? -lt 2 ]
	@$(JSL) -nologo -nofilelisting -nosummary -process $@

$(JOJFILE):
	@printf "\nDownload and trim $(JOJFILE) ...\n"
	@curl -# $(JOJURL) | tr -d '\n' > $(JOJFILE)

.PHONY: deploy
deploy: default
	@printf "make: \tDeploy: Checking  git diff --name-only as trigger to update gh-pages\n"
ifeq ($(shell git diff --name-only),)
	@$(GRECHO) "\nmake: \tDeploy: Done. No changed files.\n\n"
else
	@git commit -a -m 'revised HTML to v$(VERSION)'
	git push origin gh-pages
	$(GRECHO) "\nmake: \tDeploy: Done. Updated gh-pages to v$(VERSION). To return to master do:\n\tgit checkout master\n\n"
endif

.PHONY: clean
clean:
	rm -rf $(JOJFILE) $(PROJFILES)
