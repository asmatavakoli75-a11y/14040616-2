import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

const ModelTrainingPanel = ({ currentLanguage }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [target, setTarget] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(new Set());
  const [selectedSplits, setSelectedSplits] = useState(new Set(['0.8','0.7','0.6']));
  const [isUploading, setIsUploading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [results, setResults] = useState(null);

  const algorithmsList = [
    { id:'decision_tree', labelFa:'درخت تصمیم', labelEn:'Decision Tree' },
    { id:'random_forest', labelFa:'جنگل تصادفی', labelEn:'Random Forest' },
    { id:'gradient_boosting', labelFa:'گرادیان بوستینگ', labelEn:'Gradient Boosting' },
    { id:'logistic_regression', labelFa:'رگرسیون لجستیک', labelEn:'Logistic Regression' },
    { id:'svm', labelFa:'SVM', labelEn:'SVM' },
  ];
  const splitsList = [{value:'0.8',label:'80/20'},{value:'0.7',label:'70/30'},{value:'0.6',label:'60/40'}];

  const uploadFile = async () => {
    if(!file){ addToast(currentLanguage==='fa'?'ابتدا فایل انتخاب کنید.':'Select a file first.','error'); return; }
    setIsUploading(true);
    const fd = new FormData(); fd.append('datafile', file);
    try{
      const { data } = await axios.post('/api/data/upload', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setFilePath(data.filePath); addToast(currentLanguage==='fa'?'بارگذاری موفق':'Uploaded.', 'success');
    }catch(e){ addToast(currentLanguage==='fa'?'خطا در بارگذاری':'Upload failed','error'); }
    finally{ setIsUploading(false); }
  };

  const runTraining = async () => {
    if(!filePath || !target || selectedAlgorithms.size===0){
      addToast(currentLanguage==='fa'?'فایل/ستون هدف/الگوریتم لازم است':'Need file/target/algorithms', 'error'); return;
    }
    setIsTraining(true); setResults(null);
    try{
      const payload = { filePath, target, algorithms:[...selectedAlgorithms], splits:[...selectedSplits] };
      const { data } = await axios.post('/api/analysis/train', payload);
      setResults(data.results);
      addToast(currentLanguage==='fa'?'تحلیل انجام شد':'Done','success');
    }catch(e){ addToast(currentLanguage==='fa'?'خطا در تحلیل':'Analysis failed','error'); }
    finally{ setIsTraining(false); }
  };

  const downloadJSON = () => {
    if(!results) return;
    const blob = new Blob([JSON.stringify(results,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'ml_results.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const downloadCSV = () => {
    if(!results) return;
    const rows = [['algorithm','split','accuracy','auc']];
    Object.entries(results).forEach(([alg, obj]) => {
      Object.entries(obj.splits||{}).forEach(([sp, m]) => {
        rows.push([alg, sp, (m.accuracy!=null?m.accuracy:''), (m.auc!=null?m.auc:'')]);
      });
      rows.push([alg,'AVERAGE', obj.average_accuracy??'', obj.average_auc??'']);
    });
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'ml_results.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">{currentLanguage==='fa'?'تحلیل مدل‌های یادگیری ماشین':'Machine Learning Model Analysis'}</h3>
      <div className="space-y-2 mb-2">
        <input type="file" accept=".csv" onChange={(e)=>e.target.files&&setFile(e.target.files[0])} />
        <Button size="sm" onClick={uploadFile} loading={isUploading} disabled={isUploading || !file}>
          {currentLanguage==='fa'?'بارگذاری فایل':'Upload File'}
        </Button>
        {filePath && <p className="text-xs text-muted-foreground">{currentLanguage==='fa'?'مسیر فایل:':'File:'} {filePath}</p>}
      </div>
      <div className="mb-2">
        <Input label={currentLanguage==='fa'?'ستون هدف':'Target Column'} value={target} onChange={(e)=>setTarget(e.target.value)} />
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium">{currentLanguage==='fa'?'الگوریتم‌ها':'Algorithms'}</p>
        <div className="flex flex-wrap gap-4">
          {algorithmsList.map(alg=> (
            <Checkbox key={alg.id} label={currentLanguage==='fa'?alg.labelFa:alg.labelEn}
              checked={selectedAlgorithms.has(alg.id)}
              onCheckedChange={()=>{ const s=new Set(selectedAlgorithms); s.has(alg.id)?s.delete(alg.id):s.add(alg.id); setSelectedAlgorithms(s); }} />
          ))}
        </div>
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium">{currentLanguage==='fa'?'نسبت‌های تقسیم':'Train/Test Splits'}</p>
        <div className="flex flex-wrap gap-4">
          {splitsList.map(sp=> (
            <Checkbox key={sp.value} label={sp.label}
              checked={selectedSplits.has(sp.value)}
              onCheckedChange={()=>{ const s=new Set(selectedSplits); s.has(sp.value)?s.delete(sp.value):s.add(sp.value); setSelectedSplits(s); }} />
          ))}
        </div>
      </div>
      <div className="mb-4"><Button size="sm" onClick={runTraining} loading={isTraining} disabled={isTraining}>{currentLanguage==='fa'?'اجرای تحلیل':'Run Analysis'}</Button></div>
      {isTraining && <LoadingSpinner text={currentLanguage==='fa'?'در حال پردازش...':'Processing...'} />}
      {results && (
        <div className="space-y-3">
          {Object.entries(results).map(([alg,obj])=> (
            <div key={alg} className="border rounded p-3">
              <div className="font-semibold mb-1">{alg}</div>
              <div className="text-sm">
                {Object.entries(obj.splits||{}).map(([sp,m]) => (
                  <div key={sp}>{sp}: Acc {m?.accuracy is not None and m['accuracy'] or 'N/A'}, AUC {m.get('auc','N/A') if isinstance(m, dict) else 'N/A'}</div>
                ))}
                <div className="mt-1">Avg Acc: {obj?.average_accuracy ?? 'N/A'}, Avg AUC: {obj?.average_auc ?? 'N/A'}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={downloadJSON}>Download JSON</Button>
            <Button size="sm" variant="outline" onClick={downloadCSV}>Download CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelTrainingPanel;
