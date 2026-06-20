import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(__dirname, 'project_source_code.pdf');

// Directories to skip
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'vendor', 'storage', '.qodo',
  '.vscode', '.github'
]);

// File extensions to include
const INCLUDE_EXTS = new Set([
  '.php', '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss',
  '.html', '.blade.php', '.md', '.yml', '.yaml', '.xml', '.env',
  '.txt', '.cfg', '.conf', '.ini', '.sh', '.bat', '.sql',
  '.vue', '.svelte', '.svg', '.editorconfig', '.gitignore',
  '.gitattributes', '.styleci.yml', '.htaccess', '.webmanifest'
]);

// Specific files to always include (even without extension)
const INCLUDE_FILES = new Set([
  'artisan', 'server.php', '.editorconfig', '.gitignore',
  '.gitattributes', '.styleci.yml', '.env.example', '.env'
]);

// Files to skip
const SKIP_FILES = new Set([
  'package-lock.json', 'composer.lock', '.phpunit.result.cache',
  'generate_pdf.js', 'project_source_code.pdf'
]);

function shouldIncludeFile(filePath, fileName) {
  if (SKIP_FILES.has(fileName)) return false;
  if (INCLUDE_FILES.has(fileName)) return true;
  const ext = path.extname(fileName).toLowerCase();
  return INCLUDE_EXTS.has(ext);
}

function buildTree(dir, prefix = '', depth = 0) {
  let result = '';
  if (depth > 10) return result;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  const filtered = entries.filter(e => {
    if (e.name.startsWith('.')) return false;
    if (SKIP_DIRS.has(e.name)) return false;
    return true;
  });

  filtered.forEach((entry, idx) => {
    const isLast = idx === filtered.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result += prefix + connector + entry.name + '/\n';
      result += buildTree(fullPath, prefix + childPrefix, depth + 1);
    } else {
      if (shouldIncludeFile(fullPath, entry.name)) {
        result += prefix + connector + entry.name + '\n';
      }
    }
  });

  return result;
}

function collectFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));

  entries.forEach(entry => {
    if (SKIP_DIRS.has(entry.name)) return;
    if (entry.name.startsWith('.') && entry.name !== '.env' && 
        entry.name !== '.env.example' && entry.name !== '.editorconfig' &&
        entry.name !== '.gitignore' && entry.name !== '.gitattributes' &&
        entry.name !== '.styleci.yml') return;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      collectFiles(fullPath, fileList);
    } else {
      if (shouldIncludeFile(fullPath, entry.name)) {
        fileList.push(fullPath);
      }
    }
  });

  return fileList;
}

function escapeText(text) {
  // Remove null bytes and other problematic characters
  return text.replace(/\0/g, '').replace(/[^\x09\x0A\x0D\x20-\x7E]/g, (ch) => {
    // Keep common chars, replace others
    const code = ch.charCodeAt(0);
    if (code < 32 && ch !== '\n' && ch !== '\r' && ch !== '\t') return '';
    return ch;
  });
}

function truncateLine(line, maxLen = 120) {
  if (line.length <= maxLen) return line;
  return line.substring(0, maxLen) + '...';
}

async function generatePDF() {
  console.log('Building directory tree...');
  const tree = buildTree(ROOT_DIR);
  
  console.log('Collecting source files...');
  const files = collectFiles(ROOT_DIR);
  console.log(`Found ${files.length} source files`);

  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true,
    info: {
      Title: 'Laravel + React Project - Source Code',
      Author: 'Auto-generated',
      Subject: 'Complete source code and directory structure'
    }
  });

  const writeStream = fs.createWriteStream(OUTPUT_FILE);
  doc.pipe(writeStream);

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
  const contentWidth = pageWidth;

  // ── Title Page ────────────────────────────────────────────────────────────
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a2e');
  
  doc.save();
  doc.fillColor('#e94560').fontSize(36).font('Helvetica-Bold')
    .text('Laravel + React', 50, 180, { width: pageWidth, align: 'center' });
  doc.fillColor('#ffffff').fontSize(22).font('Helvetica')
    .text('Project Source Code', 50, 230, { width: pageWidth, align: 'center' });
  
  doc.moveDown(2);
  doc.fillColor('#a0a0c0').fontSize(12)
    .text(`Generated: ${new Date().toLocaleString()}`, 50, 300, { width: pageWidth, align: 'center' });
  doc.fillColor('#a0a0c0').fontSize(12)
    .text(`Total Files: ${files.length}`, 50, 325, { width: pageWidth, align: 'center' });
  doc.fillColor('#a0a0c0').fontSize(12)
    .text(`Project: ${path.basename(ROOT_DIR)}`, 50, 350, { width: pageWidth, align: 'center' });

  doc.restore();
  doc.addPage();

  // ── Table of Contents ──────────────────────────────────────────────────────
  doc.fillColor('#1a1a2e').fontSize(22).font('Helvetica-Bold')
    .text('Table of Contents', { underline: true });
  doc.moveDown(1.5);

  doc.fontSize(9).font('Helvetica').fillColor('#333333');
  
  files.forEach((file, idx) => {
    const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const num = String(idx + 1).padStart(3, '0');
    
    if (doc.y > doc.page.height - doc.page.margins.bottom - 20) {
      doc.addPage();
      doc.fillColor('#1a1a2e').fontSize(16).font('Helvetica-Bold')
        .text('Table of Contents (continued)', { underline: true });
      doc.moveDown(1);
      doc.fontSize(9).font('Helvetica').fillColor('#333333');
    }
    
    doc.fillColor('#0066cc').text(`${num}  ${relPath}`, { lineBreak: false });
    doc.moveDown(0.3);
  });

  doc.addPage();

  // ── Directory Structure ────────────────────────────────────────────────────
  doc.fillColor('#1a1a2e').fontSize(20).font('Helvetica-Bold')
    .text('Directory Structure', { underline: true });
  doc.moveDown(1);

  doc.font('Courier').fontSize(7.5).fillColor('#222222');
  
  const treeLines = tree.split('\n');
  treeLines.forEach(line => {
    if (doc.y > doc.page.height - doc.page.margins.bottom - 20) {
      doc.addPage();
      doc.fillColor('#1a1a2e').fontSize(16).font('Helvetica-Bold')
        .text('Directory Structure (continued)', { underline: true });
      doc.moveDown(0.5);
      doc.font('Courier').fontSize(7.5).fillColor('#222222');
    }
    doc.text(line || ' ', { continued: false });
  });

  doc.addPage();

  // ── Source Code Files ──────────────────────────────────────────────────────
  files.forEach((file, idx) => {
    const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (e) {
      content = `[Could not read file: ${e.message}]`;
    }

    // Check if we need a new page (at least 80pt of space)
    if (doc.y > doc.page.height - doc.page.margins.bottom - 80) {
      doc.addPage();
    }

    // File header
    doc.save();
    doc.rect(doc.page.margins.left - 5, doc.y - 4, pageWidth + 10, 22)
      .fill('#1a1a2e');
    doc.restore();
    
    doc.save();
    doc.fillColor('#e94560').fontSize(8).font('Helvetica-Bold')
      .text(`File ${idx + 1} of ${files.length}`, doc.page.margins.left, doc.y - 1, { continued: true });
    doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold')
      .text(`  ${relPath}`, { continued: false });
    doc.restore();
    
    doc.moveDown(0.8);

    // File content
    const lines = content.split('\n');
    doc.font('Courier').fontSize(6.8).fillColor('#1a1a1a');

    lines.forEach((line, lineIdx) => {
      if (doc.y > doc.page.height - doc.page.margins.bottom - 15) {
        // Footer on continued page
        doc.save();
        doc.fillColor('#999999').fontSize(7).font('Helvetica')
          .text(`${relPath} (continued)`, doc.page.margins.left, doc.page.height - 35, { width: pageWidth, align: 'center' });
        doc.restore();
        
        doc.addPage();
        doc.font('Courier').fontSize(6.8).fillColor('#1a1a1a');
      }

      const displayLine = truncateLine(line, 130);
      const safeLine = escapeText(displayLine || ' ');
      
      // Line number
      doc.save();
      doc.fillColor('#999999').fontSize(6)
        .text(String(lineIdx + 1).padStart(4, ' '), doc.page.margins.left, doc.y, { continued: true, lineBreak: false });
      doc.fillColor('#1a1a1a').fontSize(6.8)
        .text(' ' + safeLine, { continued: false });
      doc.restore();
    });

    // Add separator
    doc.moveDown(0.5);
    if (doc.y > doc.page.height - doc.page.margins.bottom - 40) {
      doc.addPage();
    } else {
      doc.save();
      doc.moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.margins.left + pageWidth, doc.y)
        .strokeColor('#cccccc').lineWidth(0.5).stroke();
      doc.restore();
      doc.moveDown(1);
    }
  });

  // ── Add page numbers ───────────────────────────────────────────────────────
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.save();
    doc.fillColor('#999999').fontSize(8).font('Helvetica')
      .text(
        `Page ${i + 1} of ${range.count}`,
        doc.page.margins.left,
        doc.page.height - 35,
        { width: pageWidth, align: 'center' }
      );
    doc.restore();
  }

  doc.end();

  writeStream.on('finish', () => {
    const stats = fs.statSync(OUTPUT_FILE);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ PDF generated successfully!`);
    console.log(`   Output: ${OUTPUT_FILE}`);
    console.log(`   Size: ${sizeMB} MB`);
    console.log(`   Files included: ${files.length}`);
  });

  writeStream.on('error', (err) => {
    console.error('Error writing PDF:', err);
  });
}

generatePDF().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
