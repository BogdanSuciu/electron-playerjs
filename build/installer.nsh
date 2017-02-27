!macro customInstall
  DetailPrint "Register todo2 URI Handler"
  DeleteRegKey HKCR "playerJs"
  WriteRegStr HKCR "playerJs" "" "URL:playerJs"
  WriteRegStr HKCR "playerJs" "URL Protocol" ""
  WriteRegStr HKCR "playerJs\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "playerJs\shell" "" ""
  WriteRegStr HKCR "playerJs\shell\Open" "" ""
  WriteRegStr HKCR "playerJs\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
