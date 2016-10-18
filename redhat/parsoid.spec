%define _binaries_in_noarch_packages_terminate_build   0
%define _binary_payload w9.gzdio
%define logdir /var/log
%define gitrepo https://github.com/hexmode/mediawiki-services-parsoid-deploy
%define parsoid_inst $RPM_BUILD_ROOT%{_libdir}/node_modules/parsoid
%define git_branch master
%define onlineCheck gerrit.wikmedia.org

Summary: Mediawiki parser for the VisualEditor.
Name: parsoid
Version: 0.0.1master
Release: 20161017
URL: https://www.mediawiki.org/wiki/Parsoid
Vendor:  Wikimedia Foundation
Packager: Mark A. Hershberger <mah@nichework.com>
Source0: https://gerrit.wikimedia.org/r/p/mediawiki/services/parsoid
License: GPLv2
Group: System Environment/Daemons
BuildRoot: %buildroot
BuildArch: noarch
Requires: supervisor >= 3.1.3
Requires(post): chkconfig
Requires(pre): /usr/sbin/useradd

%description
Mediawiki parser for the VisualEditor.

%install
isOnline=0
ping -c 1 -q gerrit.wikimedia.org 2> /dev/null || isOnline=$?

mkdir -p %{parsoid_inst}
if [ ! -d $RPM_SOURCE_DIR/parsoid ]; then
    if [ $isOnline -eq 0 ]; then
        cd $RPM_SOURCE_DIR
        git clone -b %{git_branch} %{gitrepo} parsoid
        cd parsoid
        git submodule init
        git submodule update
    else
        echo First run while gerrit.wikimedia.org is resolvable so we can clone the git repo.
        exit 1
    fi
else
    if [ $isOnline -eq 0 ]; then
        cd $RPM_SOURCE_DIR/parsoid/src
        git checkout %{git_branch}
        git pull
    else
        echo Not updating git checkout since gerrit.wikimedia.org is not resolvable.
    fi
fi

cd $RPM_SOURCE_DIR/parsoid
[ $isOnline -eq 0 ] && npm update
mkdir -p %{parsoid_inst}
cp -pr $RPM_SOURCE_DIR/parsoid/src/* %{parsoid_inst}
rm -rf %{parsoid_inst}/tests
cp -pr $RPM_SOURCE_DIR/parsoid/node_modules %{parsoid_inst}

# Install supervisord stuff
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/supervisord.d
install -m644 $RPM_SOURCE_DIR/parsoid/redhat/parsoid.ini \
    $RPM_BUILD_ROOT%{_sysconfdir}/supervisord.d

# install log rotation stuff
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/logrotate.d
install -m644 $RPM_SOURCE_DIR/parsoid/redhat/parsoid.logrotate \
    $RPM_BUILD_ROOT%{_sysconfdir}/logrotate.d/parsoid

# localsettings
install -m644 $RPM_SOURCE_DIR/parsoid/conf/example/localsettings.js \
    $RPM_BUILD_ROOT/%{_sysconfdir}/parsoid/localsettings.js
ln -s /etc/parsoid/localsettings.js $RPM_BUILD_ROOT/usr/lib/node_modules/parsoid/api



%pre
# Add the "parsoid" user
id parsoid > /dev/null 2>&1
if [ "$?" != "0" ]; then
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
/sbin/service supervisor reload

%preun
if [ $1 = 0 ]; then
	if [ -f /etc/init.d/parsoid ]; then
		/sbin/service parsoid stop > /dev/null 2>&1
		/sbin/chkconfig --del parsoid
	fi
fi


%files
%defattr(-,root,root,-)

%config /etc/rc.d/init.d/parsoid
%config /etc/parsoid/localsettings.js
%config /etc/logrotate.d/parsoid
%doc %{_libdir}/node_modules/parsoid/guides
%doc %{_libdir}/node_modules/parsoid/COPYING
%doc %{_libdir}/node_modules/parsoid/AUTHORS.txt
%doc %{_libdir}/node_modules/parsoid/README.md
%{_libdir}/node_modules/parsoid/node_modules
%{_libdir}/node_modules/parsoid/api
%{_libdir}/node_modules/parsoid/lib
%{_libdir}/node_modules/parsoid/doc.basicTypes.js
%{_libdir}/node_modules/parsoid/jsduck-conf.json
%{_libdir}/node_modules/parsoid/package.json
%{_libdir}/node_modules/parsoid/doc.guides.json
%{_libdir}/node_modules/parsoid/docs/specs/apiv2.yaml



%changelog
* Mon Oct 17 2016 Mark A. Hershberger  <mah@nichework.com>

    Use supervisor to run parsoid.

* Tue Sep 16 2014 Mark A. Hershberger  <mah@nichework.com>

    Fix status call so pid file is not deleted un-necessarily.

* Thu Aug 28 2014 Mark A. Hershberger <mah@nichework.com>

    Various minor issues with user creation:
    Fix bogus errors caused by wrong variable name.
    Fix init script checks for user.
    Fix user creation.
    Increase error checking and make better error messages.
    Also made init script more generic.
