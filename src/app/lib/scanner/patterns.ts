export const credentialPatterns = [
  // API Keys and Tokens - more specific patterns
  { pattern: /\bApiKey\s*[:=]\s*["'`]([A-Za-z0-9\-_]{12,})["'`]/gi, type: "API Key" },
  { pattern: /\bapi_key\s*[:=]\s*["'`]([A-Za-z0-9\-_]{12,})["'`]/gi, type: "API Key" },
  { pattern: /\btoken\s*[:=]\s*["'`]([A-Za-z0-9\-_]{20,})["'`]/gi, type: "Generic Token" },
  { pattern: /\bTOKEN\s*[:=]\s*["'`]([A-Za-z0-9\-_]{20,})["'`]/gi, type: "Generic Token" },
  
  // AWS Credentials
  { pattern: /\bAWS_ACCESS_KEY_ID\s*[:=]\s*["'`]([A-Z0-9]{20})["'`]/gi, type: "AWS Access Key ID" },
  { pattern: /\bAWS_SECRET_ACCESS_KEY\s*[:=]\s*["'`]([A-Za-z0-9\/+=]{40})["'`]/gi, type: "AWS Secret Access Key" },
  { pattern: /\baws_access_key_id\s*[:=]\s*["'`]([A-Z0-9]{20})["'`]/gi, type: "AWS Access Key ID" },
  { pattern: /\baws_secret_access_key\s*[:=]\s*["'`]([A-Za-z0-9\/+=]{40})["'`]/gi, type: "AWS Secret Access Key" },
  
  // Google API Keys
  { pattern: /\bGOOGLE_API_KEY\s*[:=]\s*["'`]([A-Za-z0-9\-_]{39})["'`]/gi, type: "Google API Key" },
  { pattern: /\bGA_TRACKING_ID\s*[:=]\s*["'`]([A-Z]{2}-\d{8,10}-\d{1,4})["'`]/gi, type: "Google Analytics ID" },
  { pattern: /\bGOOGLE_CLOUD_PROJECT\s*[:=]\s*["'`]([A-Za-z0-9\-_]{6,30})["'`]/gi, type: "Google Cloud Project ID" },
  
  // GitHub Tokens
  { pattern: /\bGITHUB_TOKEN\s*[:=]\s*["'`](ghp_[A-Za-z0-9]{36})["'`]/gi, type: "GitHub Personal Access Token" },
  { pattern: /\bGITHUB_CLIENT_SECRET\s*[:=]\s*["'`]([A-Za-z0-9]{40})["'`]/gi, type: "GitHub Client Secret" },
  { pattern: /\bgh[pousr]_[A-Za-z0-9]{36}/gi, type: "GitHub Token" },
  
  // Social Media API Keys
  { pattern: /\bFACEBOOK_APP_SECRET\s*[:=]\s*["'`]([A-Za-z0-9]{32})["'`]/gi, type: "Facebook App Secret" },
  { pattern: /\bFACEBOOK_ACCESS_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9]{40,})["'`]/gi, type: "Facebook Access Token" },
  { pattern: /\bTWITTER_API_KEY\s*[:=]\s*["'`]([A-Za-z0-9]{25})["'`]/gi, type: "Twitter API Key" },
  { pattern: /\bTWITTER_API_SECRET\s*[:=]\s*["'`]([A-Za-z0-9]{50})["'`]/gi, type: "Twitter API Secret" },
  { pattern: /\bTWITTER_BEARER_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9%]{100,})["'`]/gi, type: "Twitter Bearer Token" },
  
  // Payment Processing
  { pattern: /\bSTRIPE_SECRET_KEY\s*[:=]\s*["'`](sk_live_[A-Za-z0-9]{24})["'`]/gi, type: "Stripe Secret Key (Live)" },
  { pattern: /\bSTRIPE_SECRET_KEY\s*[:=]\s*["'`](sk_test_[A-Za-z0-9]{24})["'`]/gi, type: "Stripe Secret Key (Test)" },
  { pattern: /\bSTRIPE_PUBLISHABLE_KEY\s*[:=]\s*["'`](pk_live_[A-Za-z0-9]{24})["'`]/gi, type: "Stripe Publishable Key (Live)" },
  { pattern: /\bPAYPAL_CLIENT_SECRET\s*[:=]\s*["'`]([A-Za-z0-9\-_]{80})["'`]/gi, type: "PayPal Client Secret" },
  
  // Database Credentials
  { pattern: /\bDB_PASSWORD\s*[:=]\s*["'`]([A-Za-z0-9!@#$%^&*\-_]{8,})["'`]/gi, type: "Database Password" },
  { pattern: /\bDATABASE_URL\s*[:=]\s*["'`](postgres:\/\/[^"'`\s]+)["'`]/gi, type: "Database URL" },
  { pattern: /\bMONGO_URL\s*[:=]\s*["'`](mongodb:\/\/[^"'`\s]+)["'`]/gi, type: "MongoDB URL" },
  { pattern: /\bREDIS_URL\s*[:=]\s*["'`](redis:\/\/[^"'`\s]+)["'`]/gi, type: "Redis URL" },
  
  // JWT and Session Secrets
  { pattern: /\bJWT_SECRET\s*[:=]\s*["'`]([A-Za-z0-9\-_]{32,})["'`]/gi, type: "JWT Secret" },
  { pattern: /\bSESSION_SECRET\s*[:=]\s*["'`]([A-Za-z0-9\-_]{32,})["'`]/gi, type: "Session Secret" },
  { pattern: /\bSECRET_KEY\s*[:=]\s*["'`]([A-Za-z0-9\-_]{32,})["'`]/gi, type: "Secret Key" },
  
  // Email Services
  { pattern: /\bSENDGRID_API_KEY\s*[:=]\s*["'`](SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43})["'`]/gi, type: "SendGrid API Key" },
  { pattern: /\bMAILGUN_API_KEY\s*[:=]\s*["'`](key-[A-Za-z0-9]{32})["'`]/gi, type: "Mailgun API Key" },
  { pattern: /\bTWILIO_AUTH_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9]{32})["'`]/gi, type: "Twilio Auth Token" },
  { pattern: /\bTWILIO_ACCOUNT_SID\s*[:=]\s*["'`](AC[A-Za-z0-9]{32})["'`]/gi, type: "Twilio Account SID" },
  
  // Cloud Services
  { pattern: /\bHEROKU_API_KEY\s*[:=]\s*["'`]([A-Za-z0-9\-_]{8}-[A-Za-z0-9\-_]{4}-[A-Za-z0-9\-_]{4}-[A-Za-z0-9\-_]{4}-[A-Za-z0-9\-_]{12})["'`]/gi, type: "Heroku API Key" },
  { pattern: /\bNETLIFY_ACCESS_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9\-_]{40,})["'`]/gi, type: "Netlify Access Token" },
  { pattern: /\bVERCEL_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9]{24})["'`]/gi, type: "Vercel Token" },
  
  // SSH and Private Keys
  { pattern: /-----BEGIN [A-Z]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z]+ PRIVATE KEY-----/gi, type: "Private Key" },
  { pattern: /\bSSH_PRIVATE_KEY\s*[:=]\s*["'`](-----BEGIN[^"'`]+-----END[^"'`]+)["'`]/gi, type: "SSH Private Key" },
  
  // Slack and Discord
  { pattern: /\bSLACK_TOKEN\s*[:=]\s*["'`](xox[bpoa]-[A-Za-z0-9\-]{10,48})["'`]/gi, type: "Slack Token" },
  { pattern: /\bSLACK_WEBHOOK\s*[:=]\s*["'`](https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9\/]+)["'`]/gi, type: "Slack Webhook" },
  { pattern: /\bDISCORD_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9\-_]{59})["'`]/gi, type: "Discord Bot Token" },
  { pattern: /\bDISCORD_WEBHOOK\s*[:=]\s*["'`](https:\/\/discord\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9\-_]+)["'`]/gi, type: "Discord Webhook" },
  
  // Firebase and Google Services
  { pattern: /\bFIREBASE_API_KEY\s*[:=]\s*["'`]([A-Za-z0-9\-_]{39})["'`]/gi, type: "Firebase API Key" },
  { pattern: /\bFIREBASE_DATABASE_URL\s*[:=]\s*["'`](https:\/\/[A-Za-z0-9\-]+\.firebaseio\.com)["'`]/gi, type: "Firebase Database URL" },
  { pattern: /\bGOOGLE_SERVICE_ACCOUNT\s*[:=]\s*["'`](\{[^}]+service_account[^}]+\})["'`]/gi, type: "Google Service Account" },
  
  // NPM and Package Management
  { pattern: /\bNPM_TOKEN\s*[:=]\s*["'`](npm_[A-Za-z0-9]{36})["'`]/gi, type: "NPM Token" },
  { pattern: /\/\/registry\.npmjs\.org\/:_authToken\s*=\s*([A-Za-z0-9\-_]{36,})/gi, type: "NPM Auth Token" },
  
  // Common password patterns
  { pattern: /\bpassword\s*[:=]\s*["'`]([A-Za-z0-9!@#$%^&*\-_]{8,})["'`]/gi, type: "Password" },
  { pattern: /\bPASSWORD\s*[:=]\s*["'`]([A-Za-z0-9!@#$%^&*\-_]{8,})["'`]/gi, type: "Password" },
  { pattern: /\bpwd\s*[:=]\s*["'`]([A-Za-z0-9!@#$%^&*\-_]{8,})["'`]/gi, type: "Password" },
  
  // Authorization headers and bearer tokens
  { pattern: /\bAuthorization\s*[:=]\s*["'`]Bearer\s+([A-Za-z0-9\-_\.=]+)["'`]/gi, type: "Bearer Token" },
  { pattern: /\bbearer\s*[:=]\s*["'`]([A-Za-z0-9\-_\.=]{20,})["'`]/gi, type: "Bearer Token" },
  
  // Mapbox and Location Services
  { pattern: /\bMAPBOX_ACCESS_TOKEN\s*[:=]\s*["'`](pk\.[A-Za-z0-9\-_]{60,})["'`]/gi, type: "Mapbox Access Token" },
  { pattern: /\bMAPBOX_SECRET_TOKEN\s*[:=]\s*["'`](sk\.[A-Za-z0-9\-_]{60,})["'`]/gi, type: "Mapbox Secret Token" },
  
  // Cryptocurrency and Blockchain
  { pattern: /\bBITCOIN_PRIVATE_KEY\s*[:=]\s*["'`]([15LKMNabcdef0-9]{51,52})["'`]/gi, type: "Bitcoin Private Key" },
  { pattern: /\bETHEREUM_PRIVATE_KEY\s*[:=]\s*["'`](0x[a-fA-F0-9]{64})["'`]/gi, type: "Ethereum Private Key" },
  
  // GitLab
  { pattern: /\bGITLAB_PRIVATE_TOKEN\s*[:=]\s*["'`](glpat-[A-Za-z0-9\-_]{20})["'`]/gi, type: "GitLab Personal Access Token" },
  { pattern: /\bGITLAB_ACCESS_TOKEN\s*[:=]\s*["'`]([A-Za-z0-9\-_]{20,})["'`]/gi, type: "GitLab Access Token" },
  
  // Bitbucket
  { pattern: /\bBITBUCKET_CLIENT_SECRET\s*[:=]\s*["'`]([A-Za-z0-9]{32})["'`]/gi, type: "Bitbucket Client Secret" },
  
  // Sentry
  { pattern: /\bSENTRY_DSN\s*[:=]\s*["'`](https:\/\/[A-Za-z0-9]+@[A-Za-z0-9]+\.ingest\.sentry\.io\/[0-9]+)["'`]/gi, type: "Sentry DSN" },
  
  // More specific high-entropy patterns - only for actual secret-like contexts
  { pattern: /(?:secret|key|token|password|auth|credential)\s*[:=]\s*["'`]([A-Za-z0-9+\/]{32,}={0,2})["'`]/gi, type: "Potential Base64 Secret" },
  { pattern: /(?:secret|key|token|password|auth|credential)\s*[:=]\s*["'`]([A-Za-z0-9\-_]{40,})["'`]/gi, type: "Potential Secret String" },
];