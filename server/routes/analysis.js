import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
const router = express.Router();

function runScript(args) {
  return new Promise((resolve, reject) => {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const scriptPath = path.join(__dirname, '../scripts/analysis.py');
    const p = spawn('python3', [scriptPath, ...args]);
    let out = '', err = '';
    p.stdout.on('data', d => out += d.toString());
    p.stderr.on('data', d => err += d.toString());
    p.on('close', code => {
      if (code !== 0) return reject(new Error(err || out || 'analysis failed'));
      try { resolve(JSON.parse(out.trim())); } catch(e){ reject(e); }
    });
  });
}

router.post('/train', async (req,res) => {
  const { filePath, target, algorithms, splits } = req.body || {};
  if(!filePath || !target) return res.status(400).json({ message:'filePath and target are required' });
  const args = ['--mode','train','--dataset',filePath,'--target',target];
  if (Array.isArray(algorithms) && algorithms.length) args.push('--algorithms', algorithms.join(','));
  if (Array.isArray(splits) && splits.length) args.push('--splits', splits.join(','));
  try { const result = await runScript(args); res.json(result); }
  catch(e){ res.status(500).json({ message:e.message }); }
});

router.post('/univariate', async (req,res) => {
  const { filePath, target, variables, method } = req.body || {};
  if(!filePath || !target || !variables) return res.status(400).json({ message:'filePath, target, variables required' });
  const args = ['--mode','univariate','--dataset',filePath,'--target',target,'--variables', Array.isArray(variables)?variables.join(','):variables];
  if (method) args.push('--method', method);
  try { const result = await runScript(args); res.json(result); }
  catch(e){ res.status(500).json({ message:e.message }); }
});

export default router;
