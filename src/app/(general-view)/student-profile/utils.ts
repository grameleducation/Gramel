import { ProfileFormData } from "@/lib/zodSchemas";
import { Dispatch, SetStateAction } from "react";
import { UseFieldArrayRemove, UseFormReset } from "react-hook-form";

// Cancel handler
export const handleCancel = (
  reset: UseFormReset<ProfileFormData>,
  setEditMode: Dispatch<SetStateAction<boolean>>,
  removeHigherInstitution: UseFieldArrayRemove,
  removeSecondarySchool: UseFieldArrayRemove,
  removeOtherEducation: UseFieldArrayRemove,
) => {
  removeHigherInstitution();
  removeSecondarySchool();
  removeOtherEducation();
  reset(); // Reset form input to default values
  setEditMode(false);
};
