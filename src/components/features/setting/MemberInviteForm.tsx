import '@/css/styles.css';
import '@/css/output.css';

import React, { useEffect, useState } from "react";

import { useEventHandler } from "@/hooks";

import { FormCloseButton, FormSubmitButton, RequiredMark } from "@/components/ui";
import { useApp } from "@/hooks";

interface MemberInviteFormProps {
  submitAction: (formData: { toEmail: string }) => void;
  closeMemberInviteForm: () => void;
}


export const MemberInviteForm: React.FC<MemberInviteFormProps> = ({ submitAction, closeMemberInviteForm }) => {

  const { setIsOpeningForm } = useApp();
  const [toEmail, setToEmail] = useState("");
  
  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitAction({ toEmail });
  };

  const handleKeyDown = (e: Event) => {

    if (e instanceof KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMemberInviteForm();
      };
    };
  };
  useEventHandler("keydown", handleKeyDown)
  
  return (
    <div 
      className="form-bg-layout-base"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-96 w-full">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">招待するユーザーのメールアドレス<RequiredMark/></label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="form-input-base"
              autoComplete="off"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeMemberInviteForm} />
            <FormSubmitButton textContent={"送信"} />
          </div>
        </form>
      </div>
    </div>
  );
};
