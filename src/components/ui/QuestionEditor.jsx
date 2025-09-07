import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Icon from '../AppIcon';
import Checkbox from './Checkbox';

const QuestionEditor = ({ isOpen, onClose, onSave, question, currentLanguage }) => {
  const [text, setText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [options, setOptions] = useState([{ text: '', score: 0 }]);
  const [isRequired, setIsRequired] = useState(false);
  const [minScale, setMinScale] = useState(1);
  const [maxScale, setMaxScale] = useState(5);
  const [minLabel, setMinLabel] = useState('');
  const [maxLabel, setMaxLabel] = useState('');

  useEffect(() => {
    if (question) {
      setText(question.text || '');
      setQuestionType(question.questionType || 'text');
      // Ensure options are in the correct format, even if they are just strings from old data
      const formattedOptions = (question.options || []).map(opt =>
        typeof opt === 'string' ? { text: opt, score: 0 } : opt
      );
      setOptions(formattedOptions.length > 0 ? formattedOptions : [{ text: '', score: 0 }]);
      setIsRequired(question.isRequired || false);
      setMinScale(question.minScale || 1);
      setMaxScale(question.maxScale || 5);
      setMinLabel(question.minLabel || '');
      setMaxLabel(question.maxLabel || '');
    } else {
      // Reset form for new question
      setText('');
      setQuestionType('text');
      setOptions([{ text: '', score: 0 }]);
      setIsRequired(false);
      setMinScale(1);
      setMaxScale(5);
      setMinLabel('');
      setMaxLabel('');
    }
  }, [question, isOpen]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', score: 0 }]);
  };

  const removeOption = (index) => {
    if (options.length <= 1) return; // Must have at least one option
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSave = () => {
    const questionData = {
      text,
      questionType,
      isRequired,
      options: ['multiple-choice', 'checkboxes', 'dropdown'].includes(questionType)
        ? options.filter(opt => opt.text.trim() !== '')
        : [],
      minScale: questionType === 'linear-scale' ? minScale : undefined,
      maxScale: questionType === 'linear-scale' ? maxScale : undefined,
      minLabel: questionType === 'linear-scale' ? minLabel : undefined,
      maxLabel: questionType === 'linear-scale' ? maxLabel : undefined,
    };
    onSave(questionData);
  };

  if (!isOpen) return null;

  const questionTypeOptions = [
    { value: 'text', label: currentLanguage === 'fa' ? 'متن کوتاه' : 'Short Text' },
    { value: 'paragraph', label: currentLanguage === 'fa' ? 'پاراگراف' : 'Paragraph' },
    { value: 'multiple-choice', label: currentLanguage === 'fa' ? 'چند گزینه‌ای' : 'Multiple Choice' },
    { value: 'checkboxes', label: currentLanguage === 'fa' ? 'چک‌باکس' : 'Checkboxes' },
    { value: 'dropdown', label: currentLanguage === 'fa' ? 'لیست کشویی' : 'Dropdown' },
    { value: 'date', label: currentLanguage === 'fa' ? 'تاریخ' : 'Date' },
    { value: 'datetime', label: currentLanguage === 'fa' ? 'تاریخ و زمان' : 'Date & Time' },
    { value: 'linear-scale', label: currentLanguage === 'fa' ? 'مقیاس خطی' : 'Linear Scale' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold font-heading">
            {question ? (currentLanguage === 'fa' ? 'ویرایش سوال' : 'Edit Question') : (currentLanguage === 'fa' ? 'افزودن سوال جدید' : 'Add New Question')}
          </h2>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <Input
            label={currentLanguage === 'fa' ? 'متن سوال' : 'Question Text'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={currentLanguage === 'fa' ? 'سوال خود را اینجا وارد کنید' : 'Enter your question here'}
            type="textarea"
            rows={3}
          />

          <Select
            label={currentLanguage === 'fa' ? 'نوع سوال' : 'Question Type'}
            options={questionTypeOptions}
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          />

          {['multiple-choice', 'checkboxes', 'dropdown'].includes(questionType) && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <label className="block text-sm font-medium text-foreground flex-grow">{currentLanguage === 'fa' ? 'گزینه‌ها' : 'Options'}</label>
                <label className="block text-sm font-medium text-foreground w-24 text-center">{currentLanguage === 'fa' ? 'امتیاز' : 'Score'}</label>
                <div className="w-10"></div> {/* Spacer for delete button */}
              </div>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    placeholder={`${currentLanguage === 'fa' ? 'گزینه' : 'Option'} ${index + 1}`}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    value={option.score}
                    onChange={(e) => handleOptionChange(index, 'score', parseInt(e.target.value, 10) || 0)}
                    className="w-24 text-center"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={options.length <= 1}>
                    <Icon name="Trash2" size={16} className="text-muted-foreground"/>
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} iconName="Plus" iconPosition="left">
                {currentLanguage === 'fa' ? 'افزودن گزینه' : 'Add Option'}
              </Button>
            </div>
          )}

          {questionType === 'linear-scale' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">{currentLanguage === 'fa' ? 'تنظیمات مقیاس' : 'Scale Settings'}</label>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Input
                  label={currentLanguage === 'fa' ? 'از' : 'From'}
                  type="number"
                  value={minScale}
                  onChange={(e) => setMinScale(parseInt(e.target.value, 10))}
                  className="w-24"
                />
                <Input
                  label={currentLanguage === 'fa' ? 'تا' : 'To'}
                  type="number"
                  value={maxScale}
                  onChange={(e) => setMaxScale(parseInt(e.target.value, 10))}
                  className="w-24"
                />
              </div>
               <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Input
                  label={currentLanguage === 'fa' ? 'برچسب حداقل' : 'Min Label'}
                  value={minLabel}
                  onChange={(e) => setMinLabel(e.target.value)}
                  placeholder={currentLanguage === 'fa' ? '(اختیاری)' : '(Optional)'}
                />
                <Input
                  label={currentLanguage === 'fa' ? 'برچسب حداکثر' : 'Max Label'}
                  value={maxLabel}
                  onChange={(e) => setMaxLabel(e.target.value)}
                  placeholder={currentLanguage === 'fa' ? '(اختیاری)' : '(Optional)'}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border mt-auto flex justify-between items-center">
          <Checkbox
            label={currentLanguage === 'fa' ? 'الزامی' : 'Required'}
            checked={isRequired}
            onCheckedChange={setIsRequired}
          />
          <div className="space-x-2 rtl:space-x-reverse">
            <Button variant="outline" onClick={onClose}>
              {currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
            </Button>
            <Button onClick={handleSave}>
              {currentLanguage === 'fa' ? 'ذخیره سوال' : 'Save Question'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
