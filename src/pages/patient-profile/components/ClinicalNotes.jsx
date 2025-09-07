import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';

const ClinicalNotes = ({ notes, patientId, currentLanguage, onNoteAdded }) => {
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const categories = [
    { id: 'general', name: currentLanguage === 'fa' ? 'عمومی' : 'General', icon: 'FileText', color: 'text-primary' },
    { id: 'assessment', name: currentLanguage === 'fa' ? 'ارزیابی' : 'Assessment', icon: 'ClipboardList', color: 'text-therapeutic-green' },
    { id: 'treatment', name: currentLanguage === 'fa' ? 'درمان' : 'Treatment', icon: 'Activity', color: 'text-warning' },
    { id: 'followup', name: currentLanguage === 'fa' ? 'پیگیری' : 'Follow-up', icon: 'Calendar', color: 'text-secondary' }
  ];

  const getCategoryConfig = (category) => {
    return categories?.find(cat => cat?.id === category) || categories?.[0];
  };

  const handleAddNote = async () => {
    if (!newNote?.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          content: newNote,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      addToast(currentLanguage === 'fa' ? 'یادداشت با موفقیت اضافه شد' : 'Note added successfully', 'success');
      setNewNote('');
      setSelectedCategory('general');
      setIsAddingNote(false);
      if (onNoteAdded) {
        onNoteAdded(); // Callback to refresh notes list
      }
    } catch (error) {
      console.error('Error adding note:', error);
      addToast(currentLanguage === 'fa' ? 'خطا در افزودن یادداشت' : 'Error adding note', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-clinical p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading mb-4 sm:mb-0">
          {currentLanguage === 'fa' ? 'یادداشت‌های بالینی' : 'Clinical Notes'}
        </h2>
        
        <Button
          variant="default"
          onClick={() => setIsAddingNote(!isAddingNote)}
          iconName={isAddingNote ? "X" : "Plus"}
          iconPosition="left"
        >
          {isAddingNote 
            ? (currentLanguage === 'fa' ? 'لغو' : 'Cancel')
            : (currentLanguage === 'fa' ? 'یادداشت جدید' : 'New Note')
          }
        </Button>
      </div>
      {/* Add New Note Form */}
      {isAddingNote && (
        <div className="bg-muted/30 p-4 rounded-lg border mb-6 animate-slide-up">
          <h3 className="text-lg font-medium text-foreground mb-4">
            {currentLanguage === 'fa' ? 'افزودن یادداشت جدید' : 'Add New Note'}
          </h3>
          
          {/* Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => setSelectedCategory(category?.id)}
                className={`p-3 rounded-lg border transition-clinical flex items-center space-x-2 rtl:space-x-reverse ${
                  selectedCategory === category?.id
                    ? 'border-primary bg-primary/10' :'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <Icon 
                  name={category?.icon} 
                  size={16} 
                  className={selectedCategory === category?.id ? 'text-primary' : category?.color}
                />
                <span className={`text-sm font-medium ${
                  selectedCategory === category?.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {category?.name}
                </span>
              </button>
            ))}
          </div>

          {/* Note Content */}
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e?.target?.value)}
              placeholder={currentLanguage === 'fa' ?'یادداشت بالینی خود را اینجا بنویسید...' :'Write your clinical note here...'
              }
              className="w-full h-32 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-clinical resize-none"
              dir={currentLanguage === 'fa' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingNote(false);
                setNewNote('');
              }}
            >
              {currentLanguage === 'fa' ? 'لغو' : 'Cancel'}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote?.trim()}
              iconName="Save"
              iconPosition="left"
            >
              {currentLanguage === 'fa' ? 'ذخیره' : 'Save Note'}
            </Button>
          </div>
        </div>
      )}
      {/* Notes List */}
      <div className="space-y-4">
        {notes && notes.length > 0 ? (
          notes.map((note) => {
            const categoryConfig = getCategoryConfig(note.category);

            return (
              <div key={note._id} className="bg-background border border-border rounded-lg p-4 hover:shadow-clinical-md transition-clinical">
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`p-2 rounded-lg bg-muted/50 ${categoryConfig.color}`}>
                      <Icon name={categoryConfig.icon} size={16} />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground capitalize">{note.category}</h4>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-muted-foreground mt-1">
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreVertical"
                      className="opacity-60 hover:opacity-100"
                    />
                  </div>
                </div>
                {/* Note Content */}
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {note.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {currentLanguage === 'fa' ? 'هیچ یادداشتی یافت نشد' : 'No Notes Found'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 'هنوز هیچ یادداشت بالینی برای این بیمار ثبت نشده است.' : 'No clinical notes have been added for this patient yet.'}
            </p>
          </div>
        )}
      </div>
      {/* Load More */}
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          iconName="ChevronDown"
          iconPosition="right"
        >
          {currentLanguage === 'fa' ? 'نمایش بیشتر' : 'Load More Notes'}
        </Button>
      </div>
    </div>
  );
};

export default ClinicalNotes;