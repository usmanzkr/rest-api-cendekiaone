#!/bin/bash

# Menjalankan perintah MySQL yang diinginkan
mysql -u cendekiaone -pcendekiaone -e "GRANT ALL ON db_cendekiaone.* TO 'cendekiaone'@'%';"
