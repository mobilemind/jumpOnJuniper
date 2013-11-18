#!/usr/bin/make -f

##
# JOJ gh-pages (jumpOnJuniper gh-pages)
##
PROJ := joj
GITHUBPROJ := jumpOnJuniper

# directories/paths
COMMONLIB := $$HOME/common/lib

# files
JOJHTML := $(PROJ).html
HTMLFILES := $(JOJHTML) $(PROJ).manifest index.html
JOJFILE := joj.url

# urls
SRCURL := https://raw.github.com/mobilemind/$(GITHUBPROJ)/master/src/
JOJURL := http://mmind.me/$(JOJFILE)

# macros/utils
BUILDDATE := $(shell date)
VERSION = $(shell curl -sf $(SRCURL)/VERSION.txt | head -n 1)g
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
HTMLCOMPRESSORJAR := htmlcompressor-1.5.3.jar
HTMLCOMPRESSORPATH := $(shell [ 'cygwin' = $$OSTYPE ] && echo "`cygpath -w $(COMMONLIB)`\\" || echo "$(COMMONLIB)/")
HTMLCOMPRESSOR := java -jar '$(HTMLCOMPRESSORPATH)$(HTMLCOMPRESSORJAR)'
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces all --remove-input-attr --remove-form-attr --remove-script-attr --remove-http-protocol --simple-doctype --compress-js --compress-css --nomunge
TIDY := $(shell hash tidy-html5 2>/dev/null && echo 'tidy-html5' || (hash tidy 2>/dev/null && echo 'tidy' || exit 1))
JSL := $(shell type -p jsl || exit 1)
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
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
	@$(HTMLCOMPRESSOR) $(COMPRESSOPTIONS) -o $@.tmp $@ && mv -f $@.tmp $@
	@echo "$@: $$(stat $(STATFMT) $@) bytes optimized"

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

img:
	@[ -d img ] || mkdir img
	@printf "\nFetch $@/ from $$MYSERVER and update...\n"
	@rsync -ptuq --exclude=*icon*.png --exclude=vnet*.* --exclude=pastelet.* "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me/img/*.*" img

.PHONY: deploy
deploy: default
	@printf "make: \tDeploy: Checking  git diff --name-only as trigger to update gh-pages\n"
ifeq ($(shell git diff --name-only),)
	@$(GRECHO) "\nmake: \tDeploy: Done. No changed files.\n\n"
else
	@git commit -a -m 'revised HTML to v$(VERSION)' && git push origin gh-pages;
	@git tag $(VERSION) && git push --tags origin gh-pages && \
		$(GRECHO) "\nmake: \tDeploy: Done. Updated gh-pages to v$(VERSION). To return to master do:\n\tgit checkout master && make clean\n\n" \
		|| $(GRECHO) "\nmake: \tDeploy: Error with git push --tags origin gh-pages. Verify gh-pages is v$(VERSION)."
endif

.PHONY: clean
clean:
	rm -rf $(JOJFILE) $(JOJHTML) $(PROJ).manifest img
