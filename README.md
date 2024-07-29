# Libreview Gnome extension indicator

Prototype for a gnome extension that displays your current last synched BG reading from libreview.

## Requirements

Libre app with LibreLinkUp setup.

Libreview account.

## Installing

To use and install you will need to symlink the code to the correct gnome extension and restart your gnome instance by `Al+F2` then `r`.

### Symlink

ln -s /usr/.local/share/gnome-shell/extensions/t1d-indicator@andre-oliveira.dev ./libre-gnome-extension

Whenever the app freezes, try to restart the gnome instance.