// src/Admin/PermissionModal.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types';

interface PermissionModalProps {
  isOpen: boolean;
  employee: Employee | null;
  permissionValue: string;
  setPermissionValue: (value: string) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PermissionModal({
  isOpen,
  employee,
  permissionValue,
  setPermissionValue,
  loading,
  error,
  success,
  onClose,
  onUpdate,
}: PermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Update Permissions for {employee?.name}
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Permission Level</label>
            <Select
              value={permissionValue}
              onValueChange={setPermissionValue}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select permission level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">HR</SelectItem>
                <SelectItem value="2">TeamLead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {success && <p className="text-green-500 text-sm">{success}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Permission'}
          </Button>
        </div>
      </div>
    </div>
  );
}