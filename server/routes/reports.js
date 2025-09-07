import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Export a report
// @route   POST /api/reports/export
// @access  Private/Admin
router.post('/export', (req, res) => {
  const { reportType, format, filePath } = req.body;

  if (!reportType || !format || !filePath) {
    return res.status(400).json({ message: 'Missing required parameters.' });
  }

  const pythonProcess = spawn('python', [
    'server/scripts/generate_report.py',
    filePath,
    reportType,
    format,
  ]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  let errorOutput = '';
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Failed to generate report.', error: errorOutput });
    }
    try {
      const result = JSON.parse(output);
      if (result.status === 'success') {
        res.download(result.filePath, (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
          // Clean up the generated file after sending
          fs.unlinkSync(result.filePath);
        });
      } else {
        res.status(500).json({ message: 'Report generation failed.', error: result.message });
      }
    } catch (e) {
      res.status(500).json({ message: 'Failed to parse report generation results.', error: output });
    }
  });
});

export default router;
