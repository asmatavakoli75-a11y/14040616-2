import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import QuestionEditor from '../../../components/ui/QuestionEditor';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// This new component combines the List and Editor views
const QuestionnaireManager = ({ currentLanguage }) => {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [currentQuestionnaireId, setCurrentQuestionnaireId] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/questionnaires');
      setQuestionnaires(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch questionnaires.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const handleCreateNew = () => {
    setCurrentQuestionnaireId(null);
    setView('editor');
  };

  const handleEdit = (id) => {
    setCurrentQuestionnaireId(id);
    setView('editor');
  };

  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`/api/questionnaires/${itemToDelete}`);
      fetchQuestionnaires();
    } catch (err) {
      setError('Failed to delete questionnaire.');
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleBackToList = () => {
    setView('list');
    setCurrentQuestionnaireId(null);
    fetchQuestionnaires();
  };

  if (view === 'editor') {
    return (
      <QuestionnaireEditorView
        id={currentQuestionnaireId}
        onBack={handleBackToList}
        currentLanguage={currentLanguage}
      />
    );
  }

  return (
    <div className="mt-8">
       <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">
          {currentLanguage === 'fa' ? 'مدیریت پرسشنامه‌ها' : 'Questionnaire Management'}
        </h3>
        <Button onClick={handleCreateNew} iconName="Plus" iconPosition="left" size="sm">
          {currentLanguage === 'fa' ? 'ایجاد پرسشنامه جدید' : 'Create New Questionnaire'}
        </Button>
      </div>

      {isLoading && <p>{currentLanguage === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</p>}
      {error && <p className="text-destructive">{error}</p>}
      {!isLoading && !error && (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4">{currentLanguage === 'fa' ? 'عنوان' : 'Title'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'تعداد سوالات' : 'Questions'}</th>
                <th className="p-4">{currentLanguage === 'fa' ? 'عملیات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {questionnaires.map((q) => (
                <tr key={q._id} className="border-b border-border last:border-b-0">
                  <td className="p-4 font-medium">{q.title}</td>
                  <td className="p-4 text-center">{q.questions.length}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(q._id)}>
                        <Icon name="FilePen" size={16} />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => openDeleteConfirm(q._id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={currentLanguage === 'fa' ? 'حذف پرسشنامه' : 'Delete Questionnaire'}
        body={currentLanguage === 'fa' ? 'آیا از حذف این پرسشنامه و تمام سوالات آن مطمئن هستید؟ این عمل قابل بازگشت نیست.' : 'Are you sure you want to delete this questionnaire and all its questions? This action cannot be undone.'}
        confirmText={currentLanguage === 'fa' ? 'حذف کن' : 'Delete'}
        cancelText={currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
      />
    </div>
  );
};


import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// This is the refactored Editor view, now as a sub-component
const QuestionnaireEditorView = ({ id, onBack, currentLanguage }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [orderChanged, setOrderChanged] = useState(false);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const isNew = id === null;

  const fetchQuestionnaire = async () => {
    if (isNew) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/questionnaires/${id}`);
      setTitle(data.title);
      setDescription(data.description);
      setQuestions(data.questions);
      setOrderChanged(false);
    } catch (err) {
      setError('Failed to fetch questionnaire data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaire();
  }, [id, isNew]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveDetails = async () => {
    setIsSaving(true);
    const payload = { title, description };
    try {
      if (isNew) {
        await axios.post('/api/questionnaires', payload);
        onBack();
      } else {
        await axios.put(`/api/questionnaires/${id}`, payload);
        showSuccess(currentLanguage === 'fa' ? 'جزئیات پرسشنامه ذخیره شد!' : 'Questionnaire details saved successfully!');
      }
    } catch (err) {
      setError('Failed to save questionnaire details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    const questionIds = questions.map(q => q._id);
    const payload = { questions: questionIds };
    try {
      await axios.put(`/api/questionnaires/${id}`, payload);
      setOrderChanged(false);
      showSuccess(currentLanguage === 'fa' ? 'ترتیب سوالات ذخیره شد!' : 'Question order saved successfully!');
    } catch (err) {
      setError('Failed to save question order.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuestion = async (questionData) => {
    try {
      if (editingQuestion) {
        await axios.put(`/api/questionnaires/${id}/questions/${editingQuestion._id}`, questionData);
      } else {
        await axios.post(`/api/questionnaires/${id}/questions`, questionData);
      }
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      fetchQuestionnaire();
      showSuccess(currentLanguage === 'fa' ? 'سوال ذخیره شد.' : 'Question saved.');
    } catch (err) {
      setError('Failed to save question.');
    }
  };

  const openDeleteConfirm = (questionId) => {
    setItemToDelete(questionId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteQuestionConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`/api/questionnaires/${id}/questions/${itemToDelete}`);
      fetchQuestionnaire();
    } catch (err) {
      setError('Failed to delete question.');
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const {active, over} = event;

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);
        setOrderChanged(true);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div>
      <Button onClick={onBack} variant="ghost" iconName="ArrowLeft" iconPosition="left" className="mb-4">
        {currentLanguage === 'fa' ? 'بازگشت به لیست' : 'Back to List'}
      </Button>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">
              {isNew ? 'Create New Questionnaire' : 'Edit Questionnaire'}
            </h3>
            <div className="flex items-center gap-2">
              {successMessage && <span className="text-sm text-success animate-fade-in">{successMessage}</span>}
              <Button onClick={handleSaveDetails} loading={isSaving} iconName="Save" iconPosition="left">
                {currentLanguage === 'fa' ? 'ذخیره جزئیات' : 'Save Details'}
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <Input label={currentLanguage === 'fa' ? 'عنوان' : 'Title'} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input label={currentLanguage === 'fa' ? 'توضیحات' : 'Description'} value={description} onChange={(e) => setDescription(e.target.value)} type="textarea" />
          </div>
        </div>

        {!isNew && (
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">{currentLanguage === 'fa' ? 'سوالات' : 'Questions'}</h3>
              <div className="flex items-center gap-2">
                {orderChanged && (
                   <Button onClick={handleSaveOrder} loading={isSaving} iconName="Save" iconPosition="left" size="sm">
                    {currentLanguage === 'fa' ? 'ذخیره ترتیب' : 'Save Order'}
                  </Button>
                )}
                <Button onClick={() => { setEditingQuestion(null); setIsQuestionModalOpen(true); }} variant="outline" iconName="Plus" iconPosition="left">
                  {currentLanguage === 'fa' ? 'افزودن سوال' : 'Add Question'}
                </Button>
              </div>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={questions.map(q => q._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {questions.map((q, index) => (
                    <SortableQuestionItem key={q._id} id={q._id} question={q} index={index} onEdit={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }} onDelete={() => openDeleteConfirm(q._id)} />
                  ))}
                  {questions.length === 0 && <p className="text-muted-foreground text-center py-4">{currentLanguage === 'fa' ? 'هنوز سوالی اضافه نشده است.' : 'No questions have been added yet.'}</p>}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <QuestionEditor
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        question={editingQuestion}
        currentLanguage={currentLanguage}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteQuestionConfirm}
        title={currentLanguage === 'fa' ? 'حذف سوال' : 'Delete Question'}
        body={currentLanguage === 'fa' ? 'آیا از حذف این سوال مطمئن هستید؟' : 'Are you sure you want to delete this question?'}
        confirmText={currentLanguage === 'fa' ? 'حذف' : 'Delete'}
        cancelText={currentLanguage === 'fa' ? 'انصراف' : 'Cancel'}
      />
    </div>
  );
};

const SortableQuestionItem = ({ id, question, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border border-border rounded-md p-3 flex items-center justify-between bg-card touch-none">
      <div className="flex items-center gap-3">
        <Icon name="GripVertical" size={16} className="text-muted-foreground cursor-grab" />
        <Icon name={getIconForQuestionType(question.questionType)} size={16} className="text-muted-foreground" />
        <span>{index + 1}. {question.text}</span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Icon name="FilePen" size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}>
          <Icon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  )
}

const getIconForQuestionType = (type) => {
  switch (type) {
    case 'text': return 'Type';
    case 'paragraph': return 'AlignLeft';
    case 'multiple-choice': return 'CircleDot';
    case 'checkboxes': return 'CheckSquare';
    case 'dropdown': return 'ChevronDownSquare';
    case 'date': return 'Calendar';
    case 'datetime': return 'Clock';
    case 'linear-scale': return 'Minus';
    default: return 'HelpCircle';
  }
};

export default QuestionnaireManager;
