export interface DatabaseExposure {
  type: 'config_file' | 'connection_string' | 'sql_dump' | 'backup_file' | 'admin_interface' | 'error_message' | 'directory_listing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  description: string;
  evidence?: string;
  recommendation: string;
  url?: string;
}

export interface DatabaseScanResult {
  totalExposures: number;
  criticalExposures: number;
  highExposures: number;
  mediumExposures: number;
  lowExposures: number;
  exposures: DatabaseExposure[];
  summary: { [key: string]: number };
}

const DB_CONFIG_PATTERNS = [
  { pattern: /database\.php/gi, type: 'config_file' as const, severity: 'critical' as const },
  { pattern: /config\.php/gi, type: 'config_file' as const, severity: 'critical' as const },
  { pattern: /db\.config/gi, type: 'config_file' as const, severity: 'critical' as const },
  { pattern: /database\.yml/gi, type: 'config_file' as const, severity: 'critical' as const },
  { pattern: /database\.json/gi, type: 'config_file' as const, severity: 'critical' as const },
  { pattern: /\.env/gi, type: 'config_file' as const, severity: 'critical' as const },
  { pattern: /wp-config\.php/gi, type: 'config_file' as const, severity: 'critical' as const },
  
  // Connection strings
  { pattern: /mongodb:\/\/[^\s"']+/gi, type: 'connection_string' as const, severity: 'critical' as const },
  { pattern: /mysql:\/\/[^\s"']+/gi, type: 'connection_string' as const, severity: 'critical' as const },
  { pattern: /postgresql:\/\/[^\s"']+/gi, type: 'connection_string' as const, severity: 'critical' as const },
  { pattern: /redis:\/\/[^\s"']+/gi, type: 'connection_string' as const, severity: 'high' as const },
  { pattern: /Server=.*;Database=.*;/gi, type: 'connection_string' as const, severity: 'critical' as const },
  
  // Database credentials patterns
  { pattern: /DB_PASSWORD\s*=\s*["']?[^"'\s]+/gi, type: 'connection_string' as const, severity: 'critical' as const },
  { pattern: /DB_HOST\s*=\s*["']?[^"'\s]+/gi, type: 'connection_string' as const, severity: 'high' as const },
  { pattern: /DATABASE_URL\s*=\s*["']?[^"'\s]+/gi, type: 'connection_string' as const, severity: 'critical' as const },
  
  // SQL dumps and backups
  { pattern: /\.sql\.gz/gi, type: 'sql_dump' as const, severity: 'high' as const },
  { pattern: /\.sql\.zip/gi, type: 'sql_dump' as const, severity: 'high' as const },
  { pattern: /dump\.sql/gi, type: 'sql_dump' as const, severity: 'high' as const },
  { pattern: /backup\.sql/gi, type: 'backup_file' as const, severity: 'high' as const },
  { pattern: /database\.sql/gi, type: 'sql_dump' as const, severity: 'high' as const },
  
  // Database admin interfaces
  { pattern: /phpmyadmin/gi, type: 'admin_interface' as const, severity: 'medium' as const },
  { pattern: /adminer/gi, type: 'admin_interface' as const, severity: 'medium' as const },
  { pattern: /phpMyAdmin/gi, type: 'admin_interface' as const, severity: 'medium' as const },
  { pattern: /mongo-express/gi, type: 'admin_interface' as const, severity: 'medium' as const },
  
  // Database error messages
  { pattern: /MySQL Error/gi, type: 'error_message' as const, severity: 'medium' as const },
  { pattern: /PostgreSQL Error/gi, type: 'error_message' as const, severity: 'medium' as const },
  { pattern: /ORA-\d+/gi, type: 'error_message' as const, severity: 'medium' as const },
  { pattern: /SQL Server Error/gi, type: 'error_message' as const, severity: 'medium' as const },
  { pattern: /MongoDB Error/gi, type: 'error_message' as const, severity: 'medium' as const },
];

// Common database backup and dump file extensions
const DB_FILE_EXTENSIONS = [
  '.sql', '.sql.gz', '.sql.zip', '.sql.bz2', '.sql.tar.gz',
  '.dump', '.bak', '.backup', '.db', '.sqlite', '.sqlite3',
  '.mdb', '.accdb', '.dbf'
];

// Sensitive database-related endpoints to check
const DB_ENDPOINTS = [
  '/phpmyadmin',
  '/phpMyAdmin',
  '/adminer.php',
  '/adminer',
  '/database',
  '/db',
  '/mysql',
  '/mongodb',
  '/redis',
  '/backup',
  '/dumps',
  '/sql',
  '/.env',
  '/config.php',
  '/database.php',
  '/wp-config.php',
  '/config/database.yml',
  '/config/config.php'
];

export function detectDatabaseExposures(content: string, source: string): DatabaseExposure[] {
  const exposures: DatabaseExposure[] = [];

  for (const pattern of DB_CONFIG_PATTERNS) {
    const matches = content.match(pattern.pattern);
    if (matches) {
      for (const match of matches) {
        exposures.push({
          type: pattern.type,
          severity: pattern.severity,
          source,
          description: getExposureDescription(pattern.type, match),
          evidence: match.length > 100 ? match.substring(0, 100) + '...' : match,
          recommendation: getRecommendation(pattern.type)
        });
      }
    }
  }

  // Check for potential SQL injection indicators
  const sqlPatterns = [
    /union\s+select/gi,
    /drop\s+table/gi,
    /delete\s+from/gi,
    /insert\s+into/gi,
    /update\s+.*\s+set/gi,
    /select\s+.*\s+from/gi
  ];

  for (const sqlPattern of sqlPatterns) {
    if (sqlPattern.test(content)) {
      exposures.push({
        type: 'error_message',
        severity: 'medium',
        source,
        description: 'Potential SQL injection vulnerability or exposed SQL queries',
        recommendation: 'Review and sanitize SQL queries, use parameterized queries'
      });
      break; // Only report once per source
    }
  }

  return exposures;
}

export async function scanDatabaseEndpoints(page: any, baseUrl: string): Promise<DatabaseExposure[]> {
  const exposures: DatabaseExposure[] = [];
  
  for (const endpoint of DB_ENDPOINTS) {
    try {
      const testUrl = new URL(endpoint, baseUrl).href;
      console.log(`Testing database endpoint: ${testUrl}`);
      
      const response = await page.goto(testUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 10000 
      });
      
      if (response && response.status() < 400) {
        const content = await response.text();
        const title = await page.title();
        
        // Check if it's a database admin interface
        if (isDbAdminInterface(content, title, endpoint)) {
          exposures.push({
            type: 'admin_interface',
            severity: determineSeverity(endpoint, response.status()),
            source: 'endpoint_scan',
            description: `Database admin interface accessible at ${endpoint}`,
            url: testUrl,
            recommendation: 'Restrict access to database admin interfaces, implement authentication'
          });
        }
        
        // Check for directory listings with database files
        if (isDirectoryListing(content) && containsDatabaseFiles(content)) {
          exposures.push({
            type: 'directory_listing',
            severity: 'high',
            source: 'endpoint_scan',
            description: `Directory listing contains database files at ${endpoint}`,
            url: testUrl,
            recommendation: 'Disable directory listings and secure database files'
          });
        }
        
        // Check for configuration files
        if (isConfigFile(endpoint) && containsDbCredentials(content)) {
          exposures.push({
            type: 'config_file',
            severity: 'critical',
            source: 'endpoint_scan',
            description: `Database configuration file exposed at ${endpoint}`,
            url: testUrl,
            evidence: extractCredentialEvidence(content),
            recommendation: 'Remove or secure configuration files, use environment variables'
          });
        }
      }
    } catch (error) {
      // Endpoint not accessible or error occurred - this is expected for most endpoints
      console.log(`Endpoint ${endpoint} not accessible: ${error}`);
    }
  }
  
  return exposures;
}

export function analyzeDatabaseSecurity(
  scriptExposures: DatabaseExposure[],
  endpointExposures: DatabaseExposure[],
  networkCalls: any[]
): DatabaseScanResult {
  const allExposures = [...scriptExposures, ...endpointExposures];
  
  // Analyze network calls for database-related requests
  const networkExposures = analyzeNetworkForDatabase(networkCalls);
  allExposures.push(...networkExposures);
  
  const summary: { [key: string]: number } = {};
  let criticalExposures = 0;
  let highExposures = 0;
  let mediumExposures = 0;  // Add this
  let lowExposures = 0;     // Add this
  
  for (const exposure of allExposures) {
    summary[exposure.type] = (summary[exposure.type] || 0) + 1;
    
    switch (exposure.severity) {
      case 'critical':
        criticalExposures++;
        break;
      case 'high':
        highExposures++;
        break;
      case 'medium':
        mediumExposures++;  // Add this
        break;
      case 'low':
        lowExposures++;     // Add this
        break;
    }
  }
  
  console.log(`Database security analysis complete:`, {
    total: allExposures.length,
    critical: criticalExposures,
    high: highExposures,
    medium: mediumExposures,
    low: lowExposures
  });
  
  return {
    totalExposures: allExposures.length,
    criticalExposures,
    highExposures,
    mediumExposures,  // Add this
    lowExposures,     // Add this
    exposures: allExposures,
    summary
  };
}

function analyzeNetworkForDatabase(networkCalls: any[]): DatabaseExposure[] {
  const exposures: DatabaseExposure[] = [];
  
  for (const call of networkCalls) {
    const url = call.url || '';
    const responseBody = call.responseBody || '';
    
    // Check for database-related URLs
    if (containsDatabasePatterns(url)) {
      exposures.push({
        type: 'admin_interface',
        severity: 'medium',
        source: 'network_analysis',
        description: `Database-related network request detected: ${url}`,
        url: url,
        recommendation: 'Review database-related network requests for security'
      });
    }
    
    // Check response bodies for database errors
    if (containsDatabaseErrors(responseBody)) {
      exposures.push({
        type: 'error_message',
        severity: 'medium',
        source: 'network_analysis',
        description: 'Database error message detected in network response',
        evidence: extractErrorEvidence(responseBody),
        recommendation: 'Implement proper error handling to prevent information disclosure'
      });
    }
  }
  
  return exposures;
}

// Helper functions
function getExposureDescription(type: DatabaseExposure['type'], evidence: string): string {
  const descriptions = {
    config_file: `Database configuration file detected: ${evidence}`,
    connection_string: `Database connection string exposed: ${evidence.substring(0, 50)}...`,
    sql_dump: `SQL dump file detected: ${evidence}`,
    backup_file: `Database backup file detected: ${evidence}`,
    admin_interface: `Database admin interface detected: ${evidence}`,
    error_message: `Database error message exposed: ${evidence.substring(0, 100)}...`,
    directory_listing: `Directory listing with database files: ${evidence}`
  };
  
  return descriptions[type] || `Database exposure detected: ${evidence}`;
}

function getRecommendation(type: DatabaseExposure['type']): string {
  const recommendations = {
    config_file: 'Move configuration files outside web root and use environment variables',
    connection_string: 'Use environment variables and secure credential storage',
    sql_dump: 'Remove SQL dump files from web-accessible directories',
    backup_file: 'Secure backup files and remove from web-accessible locations',
    admin_interface: 'Restrict access to database admin interfaces with proper authentication',
    error_message: 'Implement proper error handling to prevent information disclosure',
    directory_listing: 'Disable directory listings and secure sensitive files'
  };
  
  return recommendations[type] || 'Review and secure database-related exposures';
}

function isDbAdminInterface(content: string, title: string, endpoint: string): boolean {
  const adminIndicators = [
    'phpMyAdmin',
    'Adminer',
    'Database Administration',
    'MySQL Administration',
    'MongoDB Admin',
    'Redis Admin',
    'Database Manager'
  ];
  
  return adminIndicators.some(indicator => 
    content.toLowerCase().includes(indicator.toLowerCase()) ||
    title.toLowerCase().includes(indicator.toLowerCase())
  );
}

function isDirectoryListing(content: string): boolean {
  return content.includes('Index of /') || 
         content.includes('<title>Directory listing') ||
         content.includes('Parent Directory');
}

function containsDatabaseFiles(content: string): boolean {
  return DB_FILE_EXTENSIONS.some(ext => content.includes(ext));
}

function isConfigFile(endpoint: string): boolean {
  const configFiles = ['.env', 'config.php', 'database.php', 'wp-config.php', 'database.yml'];
  return configFiles.some(file => endpoint.includes(file));
}

function containsDbCredentials(content: string): boolean {
  const credentialPatterns = [
    /password\s*[=:]\s*["']?[^"'\s]+/gi,
    /username\s*[=:]\s*["']?[^"'\s]+/gi,
    /database\s*[=:]\s*["']?[^"'\s]+/gi,
    /host\s*[=:]\s*["']?[^"'\s]+/gi
  ];
  
  return credentialPatterns.some(pattern => pattern.test(content));
}

function extractCredentialEvidence(content: string): string {
  const lines = content.split('\n');
  const credentialLines = lines.filter(line => 
    /password|username|database|host/i.test(line) && /[=:]/i.test(line)
  );
  
  return credentialLines.slice(0, 3).map(line => 
    line.length > 80 ? line.substring(0, 80) + '...' : line
  ).join('\n');
}

function determineSeverity(endpoint: string, statusCode: number): DatabaseExposure['severity'] {
  if (endpoint.includes('phpmyadmin') || endpoint.includes('adminer')) {
    return statusCode === 200 ? 'critical' : 'high';
  }
  return statusCode === 200 ? 'high' : 'medium';
}

function containsDatabasePatterns(url: string): boolean {
  const dbPatterns = ['mysql', 'mongodb', 'redis', 'postgresql', 'oracle', 'database', 'db'];
  return dbPatterns.some(pattern => url.toLowerCase().includes(pattern));
}

function containsDatabaseErrors(content: string): boolean {
  const errorPatterns = [
    /mysql error/gi,
    /postgresql error/gi,
    /ora-\d+/gi,
    /sql server error/gi,
    /mongodb error/gi,
    /database connection failed/gi
  ];
  
  return errorPatterns.some(pattern => pattern.test(content));
}

function extractErrorEvidence(content: string): string {
  const lines = content.split('\n');
  const errorLines = lines.filter(line => 
    /error|exception|failed|denied/i.test(line) && 
    /mysql|postgresql|oracle|mongodb|database|sql/i.test(line)
  );
  
  return errorLines.slice(0, 2).map(line => 
    line.length > 100 ? line.substring(0, 100) + '...' : line
  ).join('\n');
}