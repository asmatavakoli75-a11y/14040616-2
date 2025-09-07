import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';

const PatientOverviewTable = ({ patients = [], onPatientClick, currentLanguage, compact = false }) => {
  const { addToast } = useToast();
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = compact ? 5 : 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPatients = [...patients]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedPatients = sortedPatients?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(patients?.length / itemsPerPage);

  const getRiskBadge = (score) => {
    if (score < 40) {
      return {
        text: currentLanguage === 'fa' ? 'کم' : 'Low',
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score < 70) {
      return {
        text: currentLanguage === 'fa' ? 'متوسط' : 'Moderate',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        text: currentLanguage === 'fa' ? 'بالا' : 'High',
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: {
        text: currentLanguage === 'fa' ? 'فعال' : 'Active',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      completed: {
        text: currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed',
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      pending: {
        text: currentLanguage === 'fa' ? 'در انتظار' : 'Pending',
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      }
    };
    return statusMap?.[status] || statusMap?.active;
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-clinical"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        <span>{children}</span>
        <Icon 
          name={sortField === field 
            ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown')
            : 'ChevronsUpDown'
          } 
          size={14}
          className={sortField === field ? 'text-primary' : 'text-muted-foreground'}
        />
      </div>
    </th>
  );

  return (
    <div className="card-clinical overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              {currentLanguage === 'fa' ? (compact ?'بیماران اخیر' : 'مدیریت بیماران') : 
                (compact ? 'Recent Patients' : 'Patient Management')
              }
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {currentLanguage === 'fa' ? 
                `مجموع ${patients?.length} بیمار` : 
                `Total ${patients?.length} patients`
              }
            </p>
          </div>
          
          {!compact && (
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => addToast('Export report is not implemented yet.')}
              >
                {currentLanguage === 'fa' ? 'صدور' : 'Export'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Filter"
                iconPosition="left"
                onClick={() => addToast('Advanced filters is not implemented yet.')}
              >
                {currentLanguage === 'fa' ? 'فیلتر' : 'Filter'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <SortableHeader field="name">
                {currentLanguage === 'fa' ? 'نام بیمار' : 'Patient Name'}
              </SortableHeader>
              <SortableHeader field="email">
                {currentLanguage === 'fa' ? 'ایمیل' : 'Email'}
              </SortableHeader>
              <SortableHeader field="createdAt">
                {currentLanguage === 'fa' ? 'تاریخ ثبت‌نام' : 'Registration Date'}
              </SortableHeader>
              <SortableHeader field="status">
                {currentLanguage === 'fa' ? 'وضعیت' : 'Status'}
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {currentLanguage === 'fa' ? 'عملیات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {paginatedPatients?.map((patient) => (
              <tr 
                key={patient?.id}
                className="hover:bg-muted/30 transition-clinical cursor-pointer"
                onClick={() => onPatientClick?.(patient?.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div className="ml-4 rtl:mr-4 rtl:ml-0">
                      <div className="text-sm font-medium text-foreground">
                        {`${patient?.firstName} ${patient?.lastName}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {patient?._id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {patient?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(patient?.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(patient?.status)?.className}`}>
                    {getStatusBadge(patient?.status)?.text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button 
                      onClick={(e) => {
                        e?.stopPropagation();
                        onPatientClick?.(patient?.id);
                      }}
                      className="text-primary hover:text-primary/80 transition-clinical"
                      title={currentLanguage === 'fa' ? 'مشاهده پروفایل' : 'View Profile'}
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e?.stopPropagation();
                        addToast('Edit patient is not implemented yet.');
                      }}
                      className="text-muted-foreground hover:text-foreground transition-clinical"
                      title={currentLanguage === 'fa' ? 'ویرایش' : 'Edit'}
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e?.stopPropagation();
                        addToast('Send reminder is not implemented yet.');
                      }}
                      className="text-muted-foreground hover:text-foreground transition-clinical"
                      title={currentLanguage === 'fa' ? 'ارسال یادآوری' : 'Send Reminder'}
                    >
                      <Icon name="Mail" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!compact && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {currentLanguage === 'fa' ? 
                `نمایش ${(currentPage - 1) * itemsPerPage + 1} تا ${Math.min(currentPage * itemsPerPage, patients?.length)} از ${patients?.length}` :
                `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, patients?.length)} of ${patients?.length}`
              }
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              >
                {currentLanguage === 'fa' ? 'قبلی' : 'Previous'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentLanguage === 'fa' ? 
                  `صفحه ${currentPage} از ${totalPages}` :
                  `Page ${currentPage} of ${totalPages}`
                }
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              >
                {currentLanguage === 'fa' ? 'بعدی' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOverviewTable;