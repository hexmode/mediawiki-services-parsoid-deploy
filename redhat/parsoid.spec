%define _binary_payload w9.gzdio
%define logdir /var/log
%define gitrepo https://github.com/hexmode/mediawiki-services-parsoid-deploy
%define parsoid_inst $RPM_BUILD_ROOT%{_libdir}/node_modules/parsoid

Summary: Mediawiki parser for the VisualEditor.
Name: parsoid
Version: 0.0.1
Release: 2
URL: https://www.mediawiki.org/wiki/Parsoid
Vendor:  Wikimedia Foundation
Packager: Mark A. Hershberger <mah@nichework.com>
Source0: https://gerrit.wikimedia.org/r/p/mediawiki/services/parsoid
License: GPLv2
Group: System Environment/Daemons
BuildRoot: %buildroot
BuildArch: noarch
Requires: initscripts >= 8.36, node-forever
Requires(post): chkconfig
Requires(pre): /usr/sbin/useradd

%description
Mediawiki parser for the VisualEditor.

%install
mkdir -p %{parsoid_inst}
if [ ! -d $RPM_SOURCE_DIR/parsoid ]; then
    cd $RPM_SOURCE_DIR
    git clone %{gitrepo} parsoid
    cd parsoid
    git submodule init
    git submodule update
else
    cd $RPM_SOURCE_DIR/parsoid
    git pull
fi

mkdir -p %{parsoid_inst}
cp -pr $RPM_SOURCE_DIR/parsoid/src/* %{parsoid_inst}
rm -rf %{parsoid_inst}/tests
cp -pr $RPM_SOURCE_DIR/parsoid/node_modules %{parsoid_inst}

# install SYSV init stuff
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/parsoid
mkdir -p $RPM_BUILD_ROOT/etc/rc.d/init.d
install -m755 $RPM_SOURCE_DIR/parsoid/redhat/parsoid.init \
    $RPM_BUILD_ROOT/etc/rc.d/init.d/parsoid

# install log rotation stuff
mkdir -p $RPM_BUILD_ROOT/etc/logrotate.d
install -m644 $RPM_SOURCE_DIR/parsoid/redhat/parsoid.logrotate \
    $RPM_BUILD_ROOT/etc/logrotate.d/parsoid

# localsettings
install -m644 $RPM_SOURCE_DIR/parsoid/conf/example/localsettings.js \
    $RPM_BUILD_ROOT/%{_sysconfdir}/parsoid/localsettings.js


%pre
# Add the "parsoid" user
if [ ! id parsoid > /dev/null 2>&1 ]; then
    /usr/sbin/useradd -c "Parsoid" \
	-s /bin/sh -r -d /var/run/forever parsoid 2> /dev/null || :
    /usr/sbin/usermod --lock parsoid
fi

%prep
# noop

%build
# noop

%clean
# noop

%post
# Register the httpd service
/sbin/chkconfig --add parsoid

%preun
if [ $1 = 0 ]; then
	/sbin/service parsoid stop > /dev/null 2>&1
	/sbin/chkconfig --del parsoid
fi


%files
%defattr(-,root,root,-)

%config /etc/rc.d/init.d/parsoid
%config /etc/parsoid/localsettings.js
%config /etc/logrotate.d/parsoid
%doc %{_libdir}/node_modules/parsoid/guides
%doc %{_libdir}/node_modules/parsoid/COPYING
%doc %{_libdir}/node_modules/parsoid/AUTHORS.txt
%doc %{_libdir}/node_modules/parsoid/README.txt
%{_libdir}/node_modules/parsoid/node_modules
%{_libdir}/node_modules/parsoid/api
%{_libdir}/node_modules/parsoid/lib
%{_libdir}/node_modules/parsoid/manifest.yml
%{_libdir}/node_modules/parsoid/doc.basicTypes.js
%{_libdir}/node_modules/parsoid/jsduck-conf.json
%{_libdir}/node_modules/parsoid/package.json
%{_libdir}/node_modules/parsoid/doc.guides.json


%changelog
