module.exports = endpoint = {

    data : {
        create          : '/v2/data/create',
        delete          : '/v2/data/delete',
        layers          : '/v2/data/layers',
        update          : '/v2/data/update',
        share           : '/v2/data/share',
        download        : '/v2/data/download'
    },

    projects : {
    	data            : '/v2/projects/data',
        create          : '/v2/projects/create',
        update          : '/v2/projects/update',
        delete          : '/v2/projects/delete',
        public          : '/v2/projects/public',
        private         : '/v2/projects/private',
        getLayers       : '/v2/projects/layers',
        setAccess       : '/v2/projects/access',
        slug            : {
            unique      : '/v2/projects/slug/unique'
        }
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
            accept      : '/v2/users/invite/accept'
        },
        contacts : {
            request     : '/v2/users/contacts/request'
        },
        password : {
            reset       : '/v2/users/password/reset',
            set         : '/v2/users/password'
        },
        session         : '/v2/users/session',
        create          : '/v2/users/create'
    },

    hashes : {
        get             : '/v2/hashes',
        set             : '/v2/hashes'
    },

    // upload: {
        // get             : '/api/upload/get'
    // },

    portal              : '/v2/portal',
    status              : '/v2/status',
    import : {
        // post            : '/api/import',
        post            : '/v2/data/import',
        status          : '/v2/data/import/status',
        // download        : '/api/upload/get'
        download        : '/v2/data/import' // GET
        

    },
    logout: '/logout',
    static: {
        screen: '/v2/static/screen'
    }
};