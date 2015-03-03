	######################################################
	# tx -> dev.systemapic.com - portal server 	     #
	######################################################

	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header Host $http_host;
	proxy_set_header X-NginX-Proxy true;
	add_header 	 Access-Control-Allow-Origin *.systemapic.com;
	proxy_redirect 	 off;
	proxy_ssl_session_reuse off;

	# limit brute force, ddos
	# limit_req_zone $binary_remote_addr zone=one:1000m rate=5000r/s;

	# the IP on which the node server is running
	upstream portal {
		server localhost:3001;
	}

	upstream tileserver {
		server localhost:3003;
	}

	# http/s redirect
	server {
		listen 80;
		server_name dev.systemapic.com;
		return 301 https://$server_name$request_uri;
	}


	# tileserver @ tx
	server {

		listen 				443 ssl;
		server_name  			e.systemapic.com;
		access_log   			/var/log/nginx/access.tileserver.log;
		error_log    			/var/log/nginx/errors.tileserver.log;

		ssl_session_cache    		shared:SSL:1m;
		ssl_session_timeout  		10m;
		ssl    				on;
		ssl_certificate        		/etc/ssl/systemapic_com.crt;
		ssl_certificate_key    		/etc/ssl/systemapic_com.key;
		ssl_verify_client 		off;

		# limit_req zone=one 		burst=5;        
		client_max_body_size 		2000m;

		ssl_protocols             	TLSv1 TLSv1.1 TLSv1.2;
   		ssl_prefer_server_ciphers 	on;
    		ssl_ciphers 			'AES128+EECDH:AES128+EDH';

    		add_header 			Strict-Transport-Security "max-age=63072000; includeSubdomains;";
		add_header 			Access-Control-Allow-Origin https://dev.systemapic.com;

		location / {
			proxy_pass http://tileserver;
		}

		# 502 handling
		error_page 502 /502.html;
		location /502.html {
			root /var/www/systemapic.js/public/error;
		}

	}

	# portal @ tx
	server {

		listen 				443 ssl;
		server_name  			dev.systemapic.com;
		access_log   			/var/log/nginx/access.portal.log;
		error_log    			/var/log/nginx/errors.portal.log;

		ssl_session_cache    		shared:SSL:1m;
		ssl_session_timeout  		10m;
		ssl    				on;
		ssl_certificate        		/etc/ssl/systemapic_com.crt;
		ssl_certificate_key    		/etc/ssl/systemapic_com.key;
		ssl_verify_client 		off;

		# limit_req zone=one 		burst=5;        
		client_max_body_size 		2000m;

		ssl_protocols             	TLSv1 TLSv1.1 TLSv1.2;
   		ssl_prefer_server_ciphers 	on;
    		ssl_ciphers 			'AES128+EECDH:AES128+EDH';

    		add_header 			Strict-Transport-Security "max-age=63072000; includeSubdomains;";
		add_header 			Access-Control-Allow-Origin https://dev.systemapic.com;

		location / {
			proxy_pass http://portal;
		}

		# 502 handling
		error_page 502 /502.html;
		location /502.html {
			root /var/www/systemapic.js/public/error;
		}

	}

	

