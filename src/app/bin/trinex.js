#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  white: (text) => `\x1b[37m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  stripColor: (text) => text.replace(/\x1b\[[0-9;]*m/g, '')
};

class TrinexCLI {
  constructor() {
    this.apiUrl = process.env.TRINEX_API_URL || 'http://localhost:3000';
    this.args = process.argv.slice(2);
    this.options = this.parseArgs();
  }

  displayHeader() {
    const shield = `
    ${colors.blue('    ╔═══════════════╗')}
    ${colors.blue('    ║')} ${colors.cyan('⚡')} ${colors.blue('SECURITY')} ${colors.cyan('⚡')} ${colors.blue('║')}
    ${colors.blue('    ║')} ${colors.cyan('░░░░░░░░░░░')} ${colors.blue('║')}
    ${colors.blue('    ║')} ${colors.cyan('░')}${colors.white('▄▄▄▄▄▄▄')}${colors.cyan('░')} ${colors.blue('║')}
    ${colors.blue('    ║')} ${colors.cyan('░')}${colors.white('█')}${colors.red('♦')}${colors.white('█████')}${colors.cyan('░')} ${colors.blue('║')}
    ${colors.blue('    ║')} ${colors.cyan('░')}${colors.white('███████')}${colors.cyan('░')} ${colors.blue('║')}
    ${colors.blue('    ║')} ${colors.cyan('░')}${colors.white('▀▀▀▀▀▀▀')}${colors.cyan('░')} ${colors.blue('║')}
    ${colors.blue('    ║')} ${colors.cyan('░░░░░░░░░░░')} ${colors.blue('║')}
    ${colors.blue('    ╚═══════════════╝')}
    `;

    const trinexText = `
████████╗██████╗ ██╗███╗   ██╗███████╗██╗  ██╗██╗  ██╗
╚══██╔══╝██╔══██╗██║████╗  ██║██╔════╝╚██╗██╔╝╚██╗██╔╝
   ██║   ██████╔╝██║██╔██╗ ██║█████╗   ╚███╔╝  ╚███╔╝ 
   ██║   ██╔══██╗██║██║╚██╗██║██╔══╝   ██╔██╗  ██╔██╗ 
   ██║   ██║  ██║██║██║ ╚████║███████╗██╔╝ ██╗██╔╝ ██╗
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
    `;

    console.log('\n');
    const textLines = trinexText.split('\n');
    const shieldLines = shield.split('\n');
    
    const maxLines = Math.max(textLines.length, shieldLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const textLine = textLines[i] || '';
      const shieldLine = shieldLines[i] || '';
      console.log(colors.blue(textLine.padEnd(50)) + shieldLine);
    }
    
    console.log(colors.blue(colors.bold('\n                    Website Security Scanner')));
    console.log(colors.cyan('                  ═══════════════════════════════\n'));
  }

  parseArgs() {
    const options = {
      url: null,
      format: 'table',
      output: null,
      verbose: false,
      timeout: 60000,
      help: false,
      version: false
    };

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];
      
      switch (arg) {
        case '-h':
        case '--help':
          options.help = true;
          break;
        case '-v':
        case '--version':
          options.version = true;
          break;
        case '-f':
        case '--format':
          options.format = this.args[++i];
          break;
        case '-o':
        case '--output':
          options.output = this.args[++i];
          break;
        case '--verbose':
          options.verbose = true;
          break;
        case '--timeout':
          options.timeout = parseInt(this.args[++i]) * 1000;
          break;
        case '--api-url':
          this.apiUrl = this.args[++i];
          break;
        default:
          if (!arg.startsWith('-') && !options.url) {
            options.url = arg;
          }
      }
    }

    return options;
  }

  showHelp() {
    this.displayHeader();
    
    console.log(colors.white(colors.bold('USAGE:')));
    console.log(colors.cyan('  trinex') + colors.white(' <url> [options]\n'));

    console.log(colors.white(colors.bold('ARGUMENTS:')));
    console.log(colors.cyan('  <url>                 ') + colors.white('Website URL to scan\n'));

    console.log(colors.white(colors.bold('OPTIONS:')));
    console.log(colors.cyan('  -f, --format <type>   ') + colors.white('Output format: table, json, csv (default: table)'));
    console.log(colors.cyan('  -o, --output <file>   ') + colors.white('Save output to file'));
    console.log(colors.cyan('  --verbose             ') + colors.white('Show detailed progress information'));
    console.log(colors.cyan('  --timeout <seconds>   ') + colors.white('Request timeout in seconds (default: 60)'));
    console.log(colors.cyan('  --api-url <url>       ') + colors.white('API endpoint URL (default: http://localhost:3000)'));
    console.log(colors.cyan('  -h, --help            ') + colors.white('Show this help message'));
    console.log(colors.cyan('  -v, --version         ') + colors.white('Show version information\n'));

    console.log(colors.white(colors.bold('EXAMPLES:')));
    console.log('  trinex https://example.com');
    console.log('  trinex https://example.com --format json');
    console.log('  trinex https://example.com --output report.json --format json');
    console.log('  trinex https://example.com --verbose');
    console.log('  trinex https://example.com --timeout 120\n');

    console.log(colors.white(colors.bold('ENVIRONMENT VARIABLES:')));
    console.log(colors.cyan('  TRINEX_API_URL    ') + colors.white('Set the default API URL\n'));
  }

  showVersion() {
    this.displayHeader();
    const packageJson = {
      name: "trinex-cli",
      version: "1.0.0"
    };
    console.log(colors.blue(colors.bold(`${packageJson.name} v${packageJson.version}`)));
    console.log(colors.cyan('Website Security Scanner\n'));
  }

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  async makeRequest(url, data) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'Accept': 'application/json',
          'User-Agent': 'TrinexCLI/1.0.0'
        },
        timeout: this.options.timeout
      };

      if (this.options.verbose) {
        console.log(colors.blue('🔧 DEBUG - Request Details:'));
        console.log(colors.cyan(`   Full API URL: ${url}`));
        console.log(colors.cyan(`   Hostname: ${options.hostname}`));
        console.log(colors.cyan(`   Port: ${options.port}`));
        console.log(colors.cyan(`   Path: ${options.path}`));
        console.log(colors.cyan(`   Method: ${options.method}`));
        console.log('');
      }

      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let responseData = '';

        if (this.options.verbose) {
          console.log(colors.green(`📡 Response Status: ${res.statusCode}`));
        }

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsedData);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${parsedData.error || parsedData.details || 'Unknown error'}`));
            }
          } catch (error) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ rawResponse: responseData });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData || 'Unknown error'}`));
            }
          }
        });
      });

      req.on('error', (error) => {
        console.error(colors.red('🔴 Request Error Details:'), error);
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.options.timeout / 1000}s`));
      });

      try {
        req.write(data);
        req.end();
      } catch (error) {
        reject(new Error(`Failed to send request: ${error.message}`));
      }
    });
  }

  async scan(url) {
    if (this.options.verbose) {
      console.log(colors.blue(`🔍 Starting scan for: ${url}`));
      console.log(colors.cyan(`📡 API Base URL: ${this.apiUrl}`));
      console.log(colors.cyan(`📡 Full API endpoint: ${this.apiUrl}/api/scan`));
      console.log(colors.cyan(`⏱️  Timeout: ${this.options.timeout / 1000}s`));
      console.log('');
    }

    const startTime = Date.now();
    
    try {
      const requestData = JSON.stringify({
        url: url,
        cliMode: true
      });

      if (this.options.verbose) {
        console.log(colors.yellow('⏳ Sending scan request...'));
        console.log(colors.cyan(`📤 Request payload: ${requestData}`));
      }

      const result = await this.makeRequest(`${this.apiUrl}/api/scan`, requestData);
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      if (this.options.verbose) {
        console.log(colors.green(`✅ Scan completed in ${duration}s`));
        console.log('');
      }

      return { ...result, scanDuration: duration };
    } catch (error) {
      if (this.options.verbose) {
        console.error(colors.red('🔴 Detailed error information:'), error);
      }
      throw new Error(`Scan failed: ${error.message}`);
    }
  }

  formatTable(data) {
    const table = [
      [colors.blue(colors.bold('Property')), colors.blue(colors.bold('Value'))],
      [colors.blue('─'.repeat(20)), colors.blue('─'.repeat(30))],
      [colors.cyan('Scan ID'), colors.white(String(data.scanId || 'N/A'))],
      [colors.cyan('URL'), colors.white(String(data.url || 'N/A'))],
      [colors.cyan('Scripts Found'), colors.yellow(String(data.totalScripts || '0'))],
      [colors.cyan('Credentials Found'), colors.red(String(data.totalCredentials || '0'))],
      [colors.cyan('Network Calls'), colors.green(String(data.totalNetworkCalls || '0'))],
      [colors.cyan('SEO Score'), String(`${data.seoScore || '0'}/100`)],
    ];

    if (data.scanDuration) {
      table.push([colors.cyan('Scan Duration'), colors.white(`${data.scanDuration}s`)]);
    }

    const col1Width = Math.max(...table.map(row => colors.stripColor(String(row[0])).length));
    const col2Width = Math.max(...table.map(row => colors.stripColor(String(row[1])).length));

    return table.map(row => {
      const col1Padding = col1Width - colors.stripColor(String(row[0])).length;
      const col2Padding = col2Width - colors.stripColor(String(row[1])).length;
      return `${row[0]}${' '.repeat(col1Padding)} ${colors.blue('|')} ${row[1]}${' '.repeat(col2Padding)}`;
    }).join('\n');
  }

  formatJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  formatCSV(data) {
    const headers = ['property', 'value'];
    const rows = [
      ['scanId', data.scanId || ''],
      ['url', data.url || ''],
      ['totalScripts', data.totalScripts || '0'],
      ['totalCredentials', data.totalCredentials || '0'],
      ['totalNetworkCalls', data.totalNetworkCalls || '0'],
      ['seoScore', data.seoScore || '0'],
    ];

    if (data.scanDuration) {
      rows.push(['scanDuration', data.scanDuration]);
    }

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  formatOutput(data) {
    switch (this.options.format.toLowerCase()) {
      case 'json':
        return this.formatJSON(data);
      case 'csv':
        return this.formatCSV(data);
      case 'table':
      default:
        return this.formatTable(data);
    }
  }

  async saveOutput(content, filename) {
    try {
      const dir = path.dirname(filename);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const cleanContent = colors.stripColor(content);
      fs.writeFileSync(filename, cleanContent);
      console.log(colors.green(`💾 Output saved to: ${filename}`));
    } catch (error) {
      console.error(colors.red(`❌ Failed to save output: ${error.message}`));
      process.exit(1);
    }
  }

  async run() {
    try {
      if (this.options.help) {
        this.showHelp();
        return;
      }

      if (this.options.version) {
        this.showVersion();
        return;
      }

      if (this.options.url) {
        this.displayHeader();
      }

      if (!this.options.url) {
        console.error(colors.red('❌ Error: URL is required'));
        console.log(colors.cyan('Run "node ./bin/trinex.js --help" for usage information'));
        process.exit(1);
      }

      if (!this.validateUrl(this.options.url)) {
        console.error(colors.red('❌ Error: Invalid URL format'));
        console.log(colors.cyan('Please provide a valid URL (e.g., https://example.com)'));
        process.exit(1);
      }

      const validFormats = ['table', 'json', 'csv'];
      if (!validFormats.includes(this.options.format.toLowerCase())) {
        console.error(colors.red(`❌ Error: Invalid format "${this.options.format}"`));
        console.log(colors.cyan(`Valid formats: ${validFormats.join(', ')}`));
        process.exit(1);
      }

      console.log(colors.blue(colors.bold(`🚀 Scanning: ${this.options.url}`)));
      console.log(colors.cyan('═'.repeat(50)));
      
      const result = await this.scan(this.options.url);
      const output = this.formatOutput(result);

      console.log('');
      console.log(colors.green(colors.bold('📊 SCAN RESULTS')));
      console.log(colors.cyan('═'.repeat(50)));

      if (this.options.output) {
        await this.saveOutput(output, this.options.output);
      } else {
        console.log(output);
      }

      console.log('');
      console.log(colors.green(colors.bold('✅ Scan completed successfully!')));

    } catch (error) {
      console.error(colors.red(`❌ ${error.message}`));
      
      if (this.options.verbose) {
        console.error(colors.red('Full error details:'), error);
      }
      
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const cli = new TrinexCLI();
  cli.run();
}

module.exports = TrinexCLI;