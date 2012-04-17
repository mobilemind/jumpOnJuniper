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
TMPDIR := $$HOME/.$(PROJ)
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
HTMLCOMPRESSORPATH := $(shell [[ 'cygwin' == $$OSTYPE ]] && echo "`cygpath -w $(COMMONLIB)`\\" || echo "$(COMMONLIB)/")
HTMLCOMPRESSOR := java -jar '$(HTMLCOMPRESSORPATH)$(HTMLCOMPRESSORJAR)'
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces min --compress-js --compress-css
TIDY := $(shell hash tidy-html5 2>/dev/null && echo 'tidy-html5' || (hash tidy 2>/dev/null && echo 'tidy' || exit 1))
JSL := $(shell hash jsl 2>/dev/null && echo 'jsl' || exit 1)
GRECHO = $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
REPLACETOKENS = perl -p -i -e 's/$(MMVERSION)/$(VERSION)/g;' $@; perl -p -i -e 's/$(MMBUILDDATE)/$(BUILDDATE)/g;' $@

default: $(PROJECTS) | $(BUILDDIR) $(WEBDIR) $(IMGDIR)
	@(chmod -R 755 $(WEBDIR); $(GRECHO) 'make:' "Done. See $(PROJ)/$(WEBDIR) directory for v$(VERSION).\n" )

$(PROJ): $(MANIFESTS) $(COMPRESSEDFILES) | $(WEBDIR)
	@(echo; \
		echo "Copying built files..."; \
		cp -fp $(BUILDDIR)/$@.html.gz $(WEBDIR)/$@; \
		cp -fp $(BUILDDIR)/$@.manifest $(WEBDIR); \
		cp -Rfp $(SRCDIR)/$(IMGDIR) $(WEBDIR) )

# run through html compressor and into gzip
%.html.gz: %.html | $(BUILDDIR)
	@(echo "Compressing $^..."; \
		$(HTMLCOMPRESSOR) $(COMPRESSOPTIONS) $(BUILDDIR)/$^ | gzip -f9 > $(BUILDDIR)/$@ )

# copy HTML to $(BUILDDIR) and replace tokens, then check with tidy & jsl (JavaScript Lint)
%.html: $(SRCDIR)/%.html $(VERSIONTXT) | $(BUILDDIR)
	@(echo; echo "$@: validate with $(TIDY) and $(JSL)"; \
		cp -f $(SRCDIR)/$@ $(BUILDDIR); \
		cd $(BUILDDIR); \
		$(REPLACETOKENS); \
		$(TIDY) -eq $@; [[ $$? -lt 2 ]] && true; \
		$(JSL) -process $@ -nologo -nofilelisting -nosummary )

# copy manifest to $(BUILDDIR) and replace tokens
%.manifest: $(SRCDIR)/%.manifest $(VERSIONTXT) | $(BUILDDIR)
	@(echo; echo $@; \
		cp -fp $(SRCDIR)/$@ $(BUILDDIR); \
		cd $(BUILDDIR); \
		$(REPLACETOKENS) )

# deploy
.PHONY: deploy
deploy: default
	@echo "Deploy to: $$MYSERVER/me"
	@(cd $(WEBDIR); \
		rsync -ptuv --executability $(PROJ) *.manifest "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me"; \
		rsync -ptu  img/*.* "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me/img"; \
		echo \
	)
	@echo "Preparing for gh-pages, copying to: $(TMPDIR)"
	@cd $(WEBDIR) && \
		rsync -ptru --executability $(PROJ) *.manifest ../$(VERSIONTXT) $(IMGDIR) $(TMPDIR)
	@$(GRECHO) '\nmake:' "Done. Deployed v$(VERSION) $(PROJECT) to $$MYSERVER/me \
		\n\tTo update gh-pages on github.com do:\
		\ngit checkout gh-pages && make deploy && git checkout master\n"

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
	@echo 'Cleaning build directory and web directory...'
	@rm -rf $(BUILDDIR)/* $(WEBDIR)/* || true
