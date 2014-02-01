#
# Regular cron jobs for the parsoid package
#
0 4	* * *	root	[ -x /usr/bin/parsoid_maintenance ] && /usr/bin/parsoid_maintenance
