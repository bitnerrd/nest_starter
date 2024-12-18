export function IgnoreDoubleForwardSlashInReqPath(req: { url: string; }, res: any, next: () => void) {
    if (req.url) {
        let sanitizedUrl = req.url
            .replace(/\/+/g, '/')       // replace consecutive slashes with a single slash
            .replace(/\/+$/, '');       // remove trailing slashes

        req.url = sanitizedUrl       
    }
    next();
}