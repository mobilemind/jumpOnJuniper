#!/usr/bin/make -f

##
# JOJ PROJECT (jumpOnJuniper)
##
PROJ = joj

# directories/paths
SRCDIR := src
BUILDDIR := build
COMMONLIB := $$HOME/common/lib
WEBDIR := web
IMGDIR := img
VPATH := $(WEBDIR):$(BUILDDIR)

# files
PROJECTS = $(PROJ)
COMPRESSEDFILES = $(PROJ).html.gz
MANIFESTS = $(PROJ).manifest
VERSIONTXT := $(SRCDIR)/VERSION.txt

# macros/utils
MMBUILDDATE := _MmBUILDDATE_
BUILDDATE := $(shell date)
MMVERSION := _MmVERSION_
VERSION := $(shell head -1 $(VERSIONTXT))
HTMLCOMPRESSORJAR := htmlcompressor-1.5.2.jar
HTMLCOMPRESSORURL := https://htmlcompressor.googlecode.com/files/$(HTMLCOMPRESSORJAR)
HTMLCOMPRESSORPATH := $(shell [[ 'cygwin' == $$OSTYPE ]] && echo "`cygpath -w $(COMMONLIB)`\\" || echo "$(COMMONLIB)/")
HTMLCOMPRESSOR := java -jar '$(HTMLCOMPRESSORPATH)$(HTMLCOMPRESSORJAR)'
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces min --compress-js --compress-css
YUICOMPRESSOR := yuicompressor-2.4.7
YUICOMPRESSORURL := http://yui.zenfs.com/releases/yuicompressor/$(YUICOMPRESSOR).zip
TIDY := $(shell hash tidy-html5 2>/dev/null && echo 'tidy-html5' || (hash tidy 2>/dev/null && echo 'tidy' || exit 1))
JSL := $(shell hash jsl 2>/dev/null && echo 'jsl' || exit 1)
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
REPLACETOKENS = perl -pi -e 's/$(MMVERSION)/$(VERSION)/g;s/$(MMBUILDDATE)/$(BUILDDATE)/g;' $@


default: $(PROJECTS) | $(BUILDDIR) $(WEBDIR) $(IMGDIR)
	@(chmod -R 755 $(WEBDIR); $(GRECHO) 'make:' "Done. See $(PROJ)/$(WEBDIR) directory for v$(VERSION).\n" )

$(PROJ): $(MANIFESTS) $(COMPRESSEDFILES) | $(WEBDIR)
	@printf "\nCopying built files...\n"
	@cp -fp $(BUILDDIR)/$@.html.gz $(WEBDIR)/$@
	@cp -fp $(BUILDDIR)/$@.manifest $(WEBDIR)
	@cp -Rfp $(SRCDIR)/$(IMGDIR) $(WEBDIR)

# run through html compressor and into gzip
%.html.gz: %.html | $(BUILDDIR)  $(COMMONLIB)/$(YUICOMPRESSOR.jar) $(COMMONLIB)/$(HTMLCOMPRESSORJAR)
	@echo "Compressing $^..."
	@$(HTMLCOMPRESSOR) $(COMPRESSOPTIONS) $(BUILDDIR)/$^ | gzip -f9 > $(BUILDDIR)/$@

$(COMMONLIB)/$(YUICOMPRESSOR.jar):
	@[[ -f "$(COMMONLIB)/$(YUICOMPRESSOR).jar" ]] || ( \
		printf "\n\tFetching $(YUICOMPRESSOR)...\n"; \
		curl -# --create-dirs -o "$(COMMONLIB)/$(YUICOMPRESSOR).zip" "$(YUICOMPRESSORURL)"; \
		unzip -d "$(COMMONLIB)" "$(COMMONLIB)/$(YUICOMPRESSOR).zip" "$(YUICOMPRESSOR)/build/$(YUICOMPRESSOR).jar"; \
		mv -fv "$(COMMONLIB)/$(YUICOMPRESSOR)/build/$(YUICOMPRESSOR).jar" "$(COMMONLIB)"; \
		rm -rf "$(COMMONLIB)/$(YUICOMPRESSOR)" )

$(COMMONLIB)/$(HTMLCOMPRESSORJAR):
	@[[ -f "$(COMMONLIB)/$(HTMLCOMPRESSORJAR)" ]] || ( \
		printf "\n\tFetching $(HTMLCOMPRESSORJAR)...\n"; \
		curl -# --create-dirs -o "$(COMMONLIB)/$(HTMLCOMPRESSORJAR)" "$(HTMLCOMPRESSORURL)" )

# copy HTML to $(BUILDDIR) and replace tokens, then check with tidy & jsl (JavaScript Lint)
%.html: $(SRCDIR)/%.html $(VERSIONTXT) | $(BUILDDIR)
	@printf "\n$@: validate with $(TIDY) and $(JSL)\n"
	@cp -fp $(SRCDIR)/$@ $(BUILDDIR)
	@(	cd $(BUILDDIR); \
		$(REPLACETOKENS); \
		$(TIDY) -eq $@; [[ $$? -lt 2 ]] && -; \
		$(JSL) -nologo -nofilelisting -nosummary -process $@ )

# copy manifest to $(BUILDDIR) and replace tokens
%.manifest: $(SRCDIR)/%.manifest $(VERSIONTXT) | $(BUILDDIR)
	@(echo; echo $@ )
	@cp -fp $(SRCDIR)/$@ $(BUILDDIR)
	@cd $(BUILDDIR) && $(REPLACETOKENS)

# deploy
.PHONY: deploy
deploy: default
	@echo "Deploy to: $$MYSERVER/me"
	@(	cd $(WEBDIR); \
		rsync -ptuv --executability $(PROJ) *.manifest "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me"; \
		rsync -ptu  img/*.* "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me/img" )
	@$(GRECHO) '\nmake:' "Done. Deployed v$(VERSION) $(PROJECT) to $$MYSERVER/me \
		\n\tTo update gh-pages on github.com do:\
		\ngit checkout gh-pages && make clean && make deploy && git checkout master\n"

.PHONY: $(BUILDDIR)
$(BUILDDIR):
	@[[ -d $(BUILDDIR) ]] || mkdir -m 744 $(BUILDDIR)

.PHONY: $(WEBDIR)
$(WEBDIR):
	@[[ -d $(WEBDIR) ]] || mkdir -m 744 $(WEBDIR)

.PHONY: $(IMGDIR)
$(IMGDIR): | $(BUILDDIR)
	@cp -Rfp $(SRCDIR)/$(IMGDIR) $(BUILDDIR)

.PHONY: clean
clean:
	@echo 'Cleaning build directory & web directory'
	@rm -rf $(BUILDDIR)/* $(WEBDIR)/* || -
