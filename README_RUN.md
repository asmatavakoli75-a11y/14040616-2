
## Admin restart (for environments that block kill)
- Restart server from inside the app (nodemon will bring it back up):
```bash
curl -X POST "http://localhost:3001/api/admin/restart?token=dev-restart-key"
# or with header:
curl -X POST http://localhost:3001/api/admin/restart -H "x-restart-token: dev-restart-key"
```
- Inspect effective env (redacted):
```bash
curl http://localhost:3001/api/admin/env
```
