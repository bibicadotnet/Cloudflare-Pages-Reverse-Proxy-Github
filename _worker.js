export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        if (pathname === '/') {
            return env.ASSETS.fetch(request);
        }

        // Map prefix → target domain
        const domainMap = {
            '/_raw':            'https://raw.githubusercontent.com',
            '/_api':            'https://api.github.com',
            '/_objects':        'https://objects.githubusercontent.com',
            '/_release-assets': 'https://release-assets.githubusercontent.com',
            '/_codeload':       'https://codeload.github.com',
            '/_avatars':        'https://avatars.githubusercontent.com',
            '/_media':          'https://media.githubusercontent.com',
        };

        // Map domain → prefix (dùng để rewrite Location khi redirect)
        const reverseDomainMap = {
            'raw.githubusercontent.com':            '/_raw',
            'api.github.com':                       '/_api',
            'objects.githubusercontent.com':         '/_objects',
            'release-assets.githubusercontent.com':  '/_release-assets',
            'codeload.github.com':                  '/_codeload',
            'avatars.githubusercontent.com':         '/_avatars',
            'media.githubusercontent.com':           '/_media',
            'github.com':                           '',
        };

        // Tìm target URL
        let targetUrl;
        let matched = false;
        for (const [prefix, domain] of Object.entries(domainMap)) {
            if (pathname.startsWith(prefix + '/')) {
                targetUrl = `${domain}${pathname.slice(prefix.length)}${url.search}`;
                matched = true;
                break;
            }
        }
        if (!matched) {
            targetUrl = `https://github.com${pathname}${url.search}`;
        }

        // Fetch nhưng KHÔNG follow redirect để ta rewrite Location
        const response = await fetch(new Request(targetUrl, {
            method: request.method,
            headers: request.headers,
            body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
            redirect: 'manual',
        }));

        // Nếu là redirect → rewrite Location về proxy
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('Location');
            if (location) {
                try {
                    const locationUrl = new URL(location);
                    const prefix = reverseDomainMap[locationUrl.hostname];
                    if (prefix !== undefined) {
                        const newLocation = `${url.origin}${prefix}${locationUrl.pathname}${locationUrl.search}`;
                        const newHeaders = new Headers(response.headers);
                        newHeaders.set('Location', newLocation);
                        return new Response(null, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: newHeaders,
                        });
                    }
                } catch (_) {}
            }
        }

        return response;
    }
};
