import '@/css/styles.css';
import '@/css/output.css';


import React, { useEffect, useState } from "react";

import { FormCloseButton, FormSubmitButton, RequiredMark } from "@/components/ui";
import { useApp, useEventHandler } from "@/hooks";
import { MESSAGE, MESSAGE_TYPE } from '@/constants';

interface ChangePasswordFormProps {
  submitAction: (currentPassword: string, newPassword: string) => void;
  closeChangePasswordForm: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ submitAction, closeChangePasswordForm }) => {

  const { showMessage, clearMessage, setIsOpeningForm } = useApp();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordAgain, setNewPasswordAgain] = useState<string>();

  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();
    if (newPassword !== newPasswordAgain) {
      showMessage(MESSAGE.PASSWORD_NOT_EQUALS, MESSAGE_TYPE.WARN)
      return;
    }
    submitAction(currentPassword, newPassword);
  };

  const handleKeyDown = (e: Event) => {
    if (e instanceof KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChangePasswordForm();
      };
    };
  };
  useEventHandler("keydown", handleKeyDown)
  
  return (
    <div 
      className="form-bg-layout-base"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">現在のパスワード<RequiredMark/></label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input-base"
              autoComplete="off"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">新しいパスワード<RequiredMark/></label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input-base"
              autoComplete="off"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">新しいパスワード（再入力）<RequiredMark/></label>
            <input
              type="password"
              value={newPasswordAgain}
              onChange={(e) => setNewPasswordAgain(e.target.value)}
              className="form-input-base"
              autoComplete="off"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeChangePasswordForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
