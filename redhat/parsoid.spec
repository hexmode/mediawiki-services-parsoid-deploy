%define _binary_payload w9.gzdio
%define logdir /var/log
%define gitrepo https://github.com/hexmode/mediawiki-services-parsoid-deploy

Summary: Mediawiki parser for the VisualEditor.
Name: parsoid
Version: 0.0.1
Release: 1
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
mkdir -p $RPM_BUILD_ROOT/%{_libdir}/parsoid
cd $RPM_BUILD_ROOT/%{_libdir}
git clone %{gitrepo} parsoid-repo
cd parsoid-repo
git submodule init
git submodule update
mv src/* $RPM_BUILD_ROOT/%{_libdir}/parsoid
mv node_modules $RPM_BUILD_ROOT/%{_libdir}/parsoid

# install SYSV init stuff
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/parsoid
mkdir -p $RPM_BUILD_ROOT/etc/rc.d/init.d
install -m755 ./redhat/parsoid.init \
	$RPM_BUILD_ROOT/etc/rc.d/init.d/parsoid

# install log rotation stuff
mkdir -p $RPM_BUILD_ROOT/etc/logrotate.d
install -m644 ./redhat/parsoid.logrotate \
	$RPM_BUILD_ROOT/etc/logrotate.d/httpd



%pre
# Add the "parsoid" user
if [ id parsoid > /dev/null 2>&1 ]; then
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
%doc %{_libdir}/parsoid/guides
%{_libdir}/parsoid

%changelog
