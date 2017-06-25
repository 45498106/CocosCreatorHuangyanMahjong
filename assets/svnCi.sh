#cd ./resources/
svn st |grep "?" |awk '{print$2}' |xargs -I [] svn add []
##find . -name "*.meta" |awk '{print$1}' |xargs -I []  rm -rf []
svn ci . -m "rm  file"
