import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentTimeline = ({ assessments, currentLanguage }) => {
import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentTimeline = ({ assessments, currentLanguage }) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  useEffect(() => {
    if (assessments && assessments.length > 0) {
      setSelectedAssessmentId(assessments[0]._id);
    }
  }, [assessments]);

  const getPhaseIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'in-progress':
        return { name: 'Clock', color: 'text-warning' };
      case 'pending':
        return { name: 'Circle', color: 'text-muted-foreground' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const selectedAssessment = useMemo(() => {
    return assessments.find(a => a._id === selectedAssessmentId);
  }, [selectedAssessmentId, assessments]);

  if (assessments.length === 0) {
    return (
      <div className="card-clinical p-6 mb-6 text-center">
        <Icon name="ClipboardList" size={48} className="mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">
          {currentLanguage === 'fa' ? 'هیچ ارزیابی یافت نشد' : 'No Assessments Found'}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentLanguage === 'fa' ? 'این بیمار هنوز هیچ ارزیابی را تکمیل نکرده است.' : 'This patient has not completed any assessments yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="card-clinical p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'تاریخچه ارزیابی' : 'Assessment Timeline'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          {currentLanguage === 'fa' ? 'دانلود تاریخچه' : 'Download History'}
        </Button>
      </div>
      {/* Timeline Navigation */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto pb-4">
        <div className="flex items-center space-x-8 rtl:space-x-reverse">
          {assessments.map((assessment, index) => {
            const icon = getPhaseIcon(assessment.status);
            const isSelected = selectedAssessmentId === assessment._id;
            
            return (
              <React.Fragment key={assessment._id}>
                <button
                  onClick={() => setSelectedAssessmentId(assessment._id)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-clinical w-40 text-center ${
                    isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-clinical ${
                    assessment.status === 'completed' ? 'bg-success border-success' :
                    assessment.status === 'in-progress'? 'bg-warning border-warning' : 'bg-background border-border'
                  }`}>
                    <Icon 
                      name={icon.name}
                      size={20} 
                      className={assessment.status === 'completed' ? 'text-white' : icon.color}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {assessment.questionnaireId?.title || 'Untitled Assessment'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                    {assessment.status === 'completed' && (
                      <p className="text-xs text-success font-medium">
                        {currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed'}
                      </p>
                    )}
                  </div>
                </button>
                {index < assessments.length - 1 && (
                  <div className={`h-0.5 w-16 ${
                    assessments[index + 1].status === 'completed' ? 'bg-success' : 'bg-border'
                  } transition-clinical`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Assessment Details */}
      {selectedAssessment && (
        <div className="space-y-4 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              {selectedAssessment.questionnaireId?.title} - {currentLanguage === 'fa' ? 'نتایج' : 'Results'}
            </h3>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <Icon name="Calendar" size={14} />
              <span>{new Date(selectedAssessment.completedAt || selectedAssessment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            {selectedAssessment.responses?.map((response, index) => (
              <div key={index} className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm font-medium text-foreground mb-2">
                  {response.questionId?.text}
                </p>
                <p className="text-sm text-primary">
                  <strong>{currentLanguage === 'fa' ? 'پاسخ: ' : 'Answer: '}</strong>
                  {Array.isArray(response.answer) ? response.answer.join(', ') : response.answer}
                </p>
              </div>
            ))}
            {(!selectedAssessment.responses || selectedAssessment.responses.length === 0) && (
              <p className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 'پاسخی برای این ارزیابی ثبت نشده است.' : 'No responses recorded for this assessment.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentTimeline;