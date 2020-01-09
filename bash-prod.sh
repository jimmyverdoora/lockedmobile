sudo apt-get purge do-agent
curl -sSL https://repos.insights.digitalocean.com/install.sh | sudo bash
sudo apt install python3-pip
sudo pip3 install supervisor
sudo pip3 install django==3.0.2
sudo pip3 install tornado==6.0.3
pyhton3 manage.py migrate
echo_supervisord_conf > sudo tee /etc/supervisord.conf (fare a mano, de commentare e mettere la folder)
sudo mkdir /etc/supervisor.d
sudo touch /lib/systemd/system/supervisord.service (inserire il contenuto vedi fondo)
sudo systemctl daemon-reload
sudo systemctl enable supervisord.service
sudo systemctl start supervisord.service
copiare i file ini da staging
mkdir /LOGS/
mkdir /LOGS/django/
mkdir /LOGS/tornado/
sudo supervisorctl reread add e start
fare il .py di lancio prod






--------------- contenuto ---------------------

# supervisord service for systemd
# Based on config by ET-CS (https://github.com/ET-CS)
[Unit]
Description=Supervisor daemon

[Service]
Type=forking
ExecStart=/usr/local/bin/supervisord
ExecStop=/usr/local/bin/supervisorctl $OPTIONS shutdown
ExecReload=/usr/local/bin/supervisorctl $OPTIONS reload
KillMode=process
Restart=on-failure
RestartSec=42s

[Install]
WantedBy=multi-user.target