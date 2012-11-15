#!/usr/bin/make -f

##
# JOJ PROJECT (jumpOnJuniper)
##
PROJ = joj

# directories/paths
SRCDIR := src
BUILDDIR := build
COMMONLIB = $$HOME/common/lib
WEBDIR := web
IMGDIR := img
VPATH := $(WEBDIR):$(BUILDDIR)

# files
PROJECTS = $(PROJ)
COMPRESSEDFILES = $(PROJ).html.gz

VERSIONTXT := $(SRCDIR)/VERSION.txt

# macros/utils
MMBUILDDATE := _MmBUILDDATE_
BUILDDATE := $(shell date)
MMVERSION := _MmVERSION_
VERSION := $(shell head -1 $(VERSIONTXT))
HTMLCOMPRESSORJAR := htmlcompressor-1.5.3.jar
HTMLCOMPRESSORURL := https://htmlcompressor.googlecode.com/files/$(HTMLCOMPRESSORJAR)
HTMLCOMPRESSORPATH := $(shell [ 'cygwin' = $$OSTYPE ] && echo "`cygpath -w $(COMMONLIB)`\\" || echo "$(COMMONLIB)/")
HTMLCOMPRESSOR := java -jar '$(HTMLCOMPRESSORPATH)$(HTMLCOMPRESSORJAR)'
COMPRESSOPTIONS := -t html -c utf-8 --remove-quotes --remove-intertag-spaces --remove-surrounding-spaces all --remove-input-attr --remove-form-attr --remove-script-attr --remove-http-protocol --simple-doctype --compress-js --compress-css --nomunge
YUICOMPRESSOR := yuicompressor-2.4.7
YUICOMPRESSORURL := http://yui.zenfs.com/releases/yuicompressor/$(YUICOMPRESSOR).zip
TIDY := $(shell hash tidy-html5 2>/dev/null && echo 'tidy-html5' || (hash tidy 2>/dev/null && echo 'tidy' || exit 1))
JSL := $(shell hash jsl 2>/dev/null && echo 'jsl' || exit 1)
GRECHO := $(shell hash grecho &> /dev/null && echo 'grecho' || echo 'printf')
REPLACETOKENS = perl -pi -e 's/$(MMVERSION)/$(VERSION)/g;s/$(MMBUILDDATE)/$(BUILDDATE)/g;' $@
STATFMT := $(shell [ 'cygwin' = $$OSTYPE ] && echo '-c %s' || echo '-f%z' )


default: $(PROJECTS) | $(BUILDDIR) $(WEBDIR) $(IMGDIR)
	@chmod 755 $(WEBDIR)/$(PROJ)
	@chmod -R 744 $(WEBDIR)/$(IMGDIR)
	@$(GRECHO) 'make $(PROJ):' "Done. See $(PROJ)/$(WEBDIR) directory for v$(VERSION).\n"

$(PROJ): $(COMPRESSEDFILES) | $(WEBDIR)
	@printf "\nCopying built files...\n"
	@cp -Rfp $(SRCDIR)/$(IMGDIR) $(WEBDIR)
	@cp -fp $(BUILDDIR)/$@.html.gz $(WEBDIR)/$@

# run through html compressor and into gzip
%.html.gz: %.html | $(BUILDDIR)  $(COMMONLIB)/$(YUICOMPRESSOR.jar) $(COMMONLIB)/$(HTMLCOMPRESSORJAR)
	@echo "Compressing $^ $$(stat $(STATFMT) $(BUILDDIR)/$^) bytes..."
	@$(HTMLCOMPRESSOR) $(COMPRESSOPTIONS) $(BUILDDIR)/$^ | gzip -f9 > $(BUILDDIR)/$@
	@echo "   $(BUILDDIR)/$@  $$(stat $(STATFMT) $(BUILDDIR)/$@) bytes"

$(COMMONLIB)/$(YUICOMPRESSOR.jar):
ifneq ($(wildcard "$(COMMONLIB)/$(YUICOMPRESSOR).jar"),)
	@printf "\n\tFetching $(YUICOMPRESSOR)...\n"
	@curl -# --create-dirs -o "$(COMMONLIB)/$(YUICOMPRESSOR).zip" "$(YUICOMPRESSORURL)"
	@unzip -d "$(COMMONLIB)" "$(COMMONLIB)/$(YUICOMPRESSOR).zip" "$(YUICOMPRESSOR)/build/$(YUICOMPRESSOR).jar"
	@mv -fv "$(COMMONLIB)/$(YUICOMPRESSOR)/build/$(YUICOMPRESSOR).jar" "$(COMMONLIB)"
	@rm -Rf "$(COMMONLIB)/$(YUICOMPRESSOR)"
endif

$(COMMONLIB)/$(HTMLCOMPRESSORJAR):
ifneq ($(wildcard $(COMMONLIB)/$(HTMLCOMPRESSORJAR)),)
	@printf "\n\tFetching $(HTMLCOMPRESSORJAR)...\n"
	@curl -# --create-dirs -o "$(COMMONLIB)/$(HTMLCOMPRESSORJAR)" "$(HTMLCOMPRESSORURL)"
endif

# copy HTML to $(BUILDDIR) and replace tokens, then check with tidy & jsl (JavaScript Lint)
%.html: $(SRCDIR)/%.html $(VERSIONTXT) | $(BUILDDIR)
	@printf "\n$@: validate with $(TIDY) and $(JSL)\n"
	@cp -fp $(SRCDIR)/$@ $(BUILDDIR)
	@cd $(BUILDDIR) && $(REPLACETOKENS)
	@$(TIDY) -eq $(BUILDDIR)/$@ || [ $$? -lt 2 ]
	@$(JSL) -nologo -nofilelisting -nosummary -process $(BUILDDIR)/$@
	@echo

# deploy
.PHONY: deploy
deploy: default
	@echo "Deploy to: $$MYSERVER/me"
	@rsync -ptuv --executability $(WEBDIR)/$(PROJ) "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me"
	@rsync -ptuv --exclude=*icon*.png $(WEBDIR)/img/*.* "$$MYUSER@$$MYSERVER:$$MYSERVERHOME/me/img"
	@$(GRECHO) '\nmake $(PROJ):' "Done. Deployed v$(VERSION) $(PROJECT) to $$MYSERVER/me \
		\n\tTo update gh-pages on github.com do:\ngit checkout gh-pages && make clean && make deploy && git checkout master\n"

.PHONY: $(BUILDDIR)
$(BUILDDIR):
	@[ -d $(BUILDDIR) ] || mkdir -m 744 $(BUILDDIR)

.PHONY: $(WEBDIR)
$(WEBDIR):
	@[ -d $(WEBDIR) ] || mkdir -m 744 $(WEBDIR)

.PHONY: $(IMGDIR)
$(IMGDIR): | $(BUILDDIR)
	@cp -Rfp $(SRCDIR)/$(IMGDIR) $(BUILDDIR)

.PHONY: clean
clean:
	@echo 'make $(PROJ): Cleaning build directory & web directory'
	@rm -Rf $(BUILDDIR)/* $(WEBDIR)/*
