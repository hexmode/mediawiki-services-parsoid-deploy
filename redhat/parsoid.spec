%define _binary_payload w9.gzdio
%define logdir /var/log
%define topname mediawiki-services-parsoid-deploy
%define gitrepo https://github.com/hexmode/%{topname}
%define parsoid_inst $RPM_BUILD_ROOT%{_libdir}/node_modules/parsoid
%define git_branch master

Summary: Mediawiki parser for the VisualEditor.
Name: parsoid
Version: 0.0.1master
Release: 20161017
URL: https://www.mediawiki.org/wiki/Parsoid
Vendor:  Wikimedia Foundation
Packager: Mark A. Hershberger <mah@nichework.com>
Source0: %{gitrepo}
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
git ls-remote %{gitrepo} > /dev/null 2>&1 || isOnline=$?

mkdir -p %{parsoid_inst}
if [ ! -d $RPM_SOURCE_DIR/%{topname} ]; then
    if [ $isOnline -eq 0 ]; then
        cd $RPM_SOURCE_DIR
        git clone -b %{git_branch} %{gitrepo}
        cd parsoid
        git submodule init
        git submodule update
    else
        echo First run while %{onlineCheck} is resolvable so we can clone the git repo.
        exit 1
    fi
else
    if [ $isOnline -eq 0 ]; then
        cd $RPM_SOURCE_DIR/%{topname}/src
        git checkout %{git_branch}
        git pull
    else
        echo Not updating git checkout since %{onlineCheck} is not resolvable.
    fi
fi

cd $RPM_SOURCE_DIR/%{topname}
[ $isOnline -eq 0 ] && npm update
mkdir -p %{parsoid_inst}
cp -pr $RPM_SOURCE_DIR/%{topname}/src/* %{parsoid_inst}
cp -pr $RPM_SOURCE_DIR/%{topname}/node_modules %{parsoid_inst}
rm -rf %{parsoid_inst}/tests

# Install supervisord stuff
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/supervisord.d
install -m644 $RPM_SOURCE_DIR/%{topname}/redhat/parsoid.ini \
    $RPM_BUILD_ROOT%{_sysconfdir}/supervisord.d

# install log rotation stuff
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/logrotate.d
install -m644 $RPM_SOURCE_DIR/%{topname}/redhat/parsoid.logrotate \
    $RPM_BUILD_ROOT%{_sysconfdir}/logrotate.d/parsoid

# localsettings
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/parsoid
install -m644 $RPM_SOURCE_DIR/%{topname}/conf/example/localsettings.js \
        $RPM_BUILD_ROOT%{_sysconfdir}/parsoid/localsettings.js
### FIXME ugly asterisk in path below
ln -s /etc/parsoid/localsettings.js $RPM_BUILD_ROOT%{_libdir}/node_modules/parsoid/


%pre
# noop

%prep
# noop

%build
# noop

%clean
# noop

%post
# Register the httpd service
/sbin/service supervisord reload

%preun
# noop

%files
%defattr(-,root,root,-)

%config %{_sysconfdir}/parsoid/localsettings.js
%config %{_sysconfdir}/logrotate.d/parsoid
%config %{_sysconfdir}/supervisord.d/parsoid.ini
%doc %{_libdir}/node_modules/parsoid/AUTHORS.txt
%doc %{_libdir}/node_modules/parsoid/COPYING.txt
%doc %{_libdir}/node_modules/parsoid/HISTORY.md
%doc %{_libdir}/node_modules/parsoid/README.md
%{_libdir}/node_modules/parsoid/node_modules
%{_libdir}/node_modules/parsoid/lib
%{_libdir}/node_modules/parsoid/*.js
%{_libdir}/node_modules/parsoid/*.json
%{_libdir}/node_modules/parsoid/*.yaml
%{_libdir}/node_modules/parsoid/package.json
%{_libdir}/node_modules/parsoid/bin
%{_libdir}/node_modules/parsoid/tools
%{_libdir}/node_modules/parsoid/guides



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
