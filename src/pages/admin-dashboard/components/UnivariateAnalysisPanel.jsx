import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

const UnivariateAnalysisPanel = ({ currentLanguage }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [target, setTarget] = useState('');
  const [variables, setVariables] = useState('');
  const [method, setMethod] = useState('pearson');
  const [isUploading, setIsUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const upload = async () => {
    if(!file){ addToast('Select file','error'); return; }
    setIsUploading(true);
    try{
      const fd = new FormData(); fd.append('datafile', file);
      const { data } = await axios.post('/api/data/upload', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setFilePath(data.filePath); addToast('Uploaded','success');
    }catch(e){ addToast('Upload failed','error'); }
    finally{ setIsUploading(false); }
  };

  const run = async () => {
    if(!filePath || !target || !variables){ addToast('Need file/target/variables','error'); return; }
    setIsRunning(true);
    try{
      const vars = variables.split(',').map(v=>v.trim()).filter(Boolean);
      const { data } = await axios.post('/api/analysis/univariate', { filePath, target, variables: vars, method });
      setResults(data.results);
    }catch(e){ addToast('Analysis failed','error'); }
    finally{ setIsRunning(false); }
  };

  const downloadCSV = () => {
    if(!results) return;
    const rows = [['Variable','Statistic','P_value']];
    Object.entries(results).forEach(([k,v])=> rows.push([k, v?.statistic ?? '', v?.p_value ?? '']));
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'univariate_results.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">{currentLanguage==='fa'?'تحلیل تک‌متغیره':'Univariate Analysis'}</h3>
      <div className="space-y-2 mb-2">
        <input type="file" accept=".csv" onChange={(e)=>e.target.files&&setFile(e.target.files[0])} />
        <Button size="sm" onClick={upload} loading={isUploading} disabled={isUploading || !file}>Upload File</Button>
        {filePath && <p className="text-xs text-muted-foreground">File: {filePath}</p>}
      </div>
      <div className="mb-2"><Input label="Target" value={target} onChange={(e)=>setTarget(e.target.value)} /></div>
      <div className="mb-2"><Input label="Variables (comma separated)" value={variables} onChange={(e)=>setVariables(e.target.value)} /></div>
      <div className="mb-2">
        <p className="text-sm font-medium">Method</p>
        <div className="flex gap-4">
          {['pearson','chi2'].map(m => (
            <Checkbox key={m} label={m} checked={method===m} onCheckedChange={()=>setMethod(m)} />
          ))}
        </div>
      </div>
      <div className="mb-4"><Button size="sm" onClick={run} loading={isRunning} disabled={isRunning}>Run Analysis</Button></div>
      {isRunning && <LoadingSpinner text="Processing..." />}
      {results && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">Variable</th><th className="p-2">Statistic</th><th className="p-2">p-value</th></tr></thead>
            <tbody>
              {Object.entries(results).map(([k,v]) => (
                <tr key={k} className="border-t"><td className="p-2">{k}</td><td className="p-2">{v?.statistic ?? 'N/A'}</td><td className="p-2">{v?.p_value ?? 'N/A'}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="p-2"><Button size="sm" variant="outline" onClick={downloadCSV}>Download CSV</Button></div>
        </div>
      )}
    </div>
  );
};

export default UnivariateAnalysisPanel;
