module.exports = endpoint = {

    data : {
        delete          : '/v2/data/delete',
        layers          : '/v2/data/layers',
        update          : '/v2/data/update',
        share           : '/v2/data/share',
        download        : '/v2/data/download',
    },

    projects : {
    	data            : '/v2/projects/data',
        create          : '/v2/projects/create',
        update          : '/v2/projects/update',
        delete          : '/v2/projects/delete',
        public          : '/v2/projects/public',
        private         : '/v2/projects/private',
    },

    layers : {
    	delete          : '/v2/layers/delete',
    	create          : '/v2/layers/create',
    	update          : '/v2/layers/update',
    	meta            : '/v2/layers/meta',
    	carto           : '/v2/layers/carto/json'
    },

    users : {
        token : {
            check       : '/v2/users/token/check',
            refresh     : '/v2/users/token/refresh',
            token       : '/v2/users/token'
        },
        update          : '/v2/users/update',
        email : {
            unique      : '/v2/users/email/unique'
        },
        username : {
            unique      : '/v2/users/username/unique'
        },
        invite : {
            invite      : '/v2/users/invite',
            projects    : '/v2/users/invite/projects',
            link        : '/v2/users/invite/link',
            accept      : '/api/user/invite/accept'
        },
        contacts : {
            request     : '/v2/users/contacts/request'
        },
        password : {
            reset       : '/v2/users/password/reset',
            set         : '/v2/users/password'
        }
    },

    hashes : {
        get             : '/v2/hashes/get',
        set             : '/v2/hashes/set'
    },

    // upload: {
        // get             : '/api/upload/get'
    // },

    portal              : '/v2/portal',
    status              : '/v2/status',
    import : {
        post            : '/api/import',
        status          : '/api/import/status',
        download        : '/api/upload/get'
        

    } 



















                
}