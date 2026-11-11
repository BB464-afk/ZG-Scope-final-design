import React from 'react';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { ChevronRight } from 'lucide-react';
import StandardDropdown from '../components/StandardDropdown';

type FormData = {
  userId: string;
  name: string;
  department: string;
  workspaceRole: string;
  baseRole: string;
  email: string;
  phoneCode: string;
  phone: string;
  company: string;
};

export default function AddUser() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      userId: 'USR-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'), // Auto-generated
      phoneCode: '+43',
    }
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // In a real app, this would submit to API
    navigate('/app/users');
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-8 py-4 text-sm text-[#5F6B7A] border-b border-[#E2E6ED]">
        <span className="cursor-pointer hover:text-[#1F2937]">Global Settings</span>
        <ChevronRight size={14} />
        <span className="cursor-pointer hover:text-[#1F2937]" onClick={() => navigate('/app/users')}>User Management</span>
        <ChevronRight size={14} />
        <span className="font-medium text-[#1F2937]">Add User</span>
      </div>

      {/* Title */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-semibold text-[#1F2937]">Add User</h1>
        <p className="text-sm text-[#6B7280] mt-1">Create a new user profile and assign roles.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6 max-w-4xl">
          {/* User ID - Read Only */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">User ID</label>
            <input 
              {...register('userId')}
              readOnly
              className="w-full px-3 py-2 bg-[#F3F4F6] border border-[#D1D5DB] rounded-md text-[#6B7280] focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Name - Mandatory */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Name <span className="text-red-500">*</span></label>
            <input 
              {...register('name', { required: true })}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-[#D1D5DB]'} rounded-md focus:outline-none focus:border-[#FD4314] focus:ring-1 focus:ring-[#FD4314] transition-colors`}
              placeholder="e.g. John Doe"
            />
            {errors.name && <span className="text-xs text-red-500 mt-1">Name is required</span>}
          </div>

          {/* Department */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Department</label>
            <input 
              {...register('department')}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#FD4314] focus:ring-1 focus:ring-[#FD4314] transition-colors"
              placeholder="e.g. Engineering"
            />
          </div>

          {/* Workspace Role */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Workspace Role</label>
            <input 
              {...register('workspaceRole')}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#FD4314] focus:ring-1 focus:ring-[#FD4314] transition-colors"
              placeholder="e.g. Project Manager"
            />
          </div>

          {/* Base Role in App - Dropdown, Mandatory */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Base Role in App <span className="text-red-500">*</span></label>
            <Controller
              name="baseRole"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <StandardDropdown
                  options={[
                    { value: 'Super Admin', label: 'Super Admin' },
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Standard', label: 'Standard' },
                    { value: 'Contributor', label: 'Contributor' },
                    { value: 'Viewer', label: 'Viewer' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Role..."
                  mode="single"
                  error={errors.baseRole ? 'Role is required' : undefined}
                />
              )}
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Email</label>
            <input 
              {...register('email', { pattern: /^\S+@\S+$/i })}
              type="email"
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#FD4314] focus:ring-1 focus:ring-[#FD4314] transition-colors"
              placeholder="john.doe@example.com"
            />
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Phone</label>
            <div className="flex gap-2">
              <Controller
                name="phoneCode"
                control={control}
                render={({ field }) => (
                  <StandardDropdown
                    options={[
                      { value: '+43', label: '+43' },
                      { value: '+1', label: '+1' },
                      { value: '+44', label: '+44' },
                      { value: '+49', label: '+49' },
                      { value: '+65', label: '+65' },
                      { value: '+91', label: '+91' },
                      { value: '+971', label: '+971' }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Code"
                    mode="single"
                    style={{ width: '120px' }}
                  />
                )}
              />
              <input 
                {...register('phone')}
                className="flex-1 px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#FD4314] focus:ring-1 focus:ring-[#FD4314] transition-colors"
                placeholder="664 ..."
              />
            </div>
          </div>

          {/* Company - Dropdown */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#374151] mb-1">Company</label>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <StandardDropdown
                  options={[
                    { value: 'Zaunergroup', label: 'Zaunergroup' },
                    { value: 'Partner A', label: 'Partner A' },
                    { value: 'Client X', label: 'Client X' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Company..."
                  mode="single"
                />
              )}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#E2E6ED]">
          <button 
            type="button"
            onClick={() => navigate('/app/users')}
            className="px-6 py-2 border border-[#D1D5DB] rounded text-[#374151] font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-2 bg-[#FD4314] text-white rounded font-medium hover:bg-[rgba(253,67,20,0.9)] transition-colors shadow-sm"
          >
            Send Invite
          </button>
        </div>
      </form>
    </div>
  );
}