ENV=${ENV:=uat}
BUILD_DIR=.next_${ENV}
mv $BUILD_DIR .next
npm run start
