"use client";

import { handleCancel } from "../utils";
import { updateStudentProfile } from "../serverAction";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSelect, NewFormInput } from "@/components/forms/FormInput";
import SubmitButton from "@/components/forms/SubmitButton";
import { X, Trash2, PenLine } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";
import { ProfileFormData, profileSchema } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { Profile } from "../page";
import { countries, type TCountries } from "countries-list";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";

const genderOptions = ["Male", "Female"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const gradingScaleOptions = ["5.0", "4.0", "100%"];
const educationOptions = [
  "PhD",
  "Master's Degree",
  "Bachelor's Degree",
  "Higher National Diploma",
  "Ordinary National Diploma",
  "Diploma",
  "High School",
];
const countryOptions: string[] = [];
for (const country in countries) {
  countryOptions.push(countries[country as keyof TCountries].name);
}
countryOptions.sort((a, b) => a.localeCompare(b));

const defaultInstitution = {
  name: "",
  attended_from: "",
  attended_to: "",
  graduation_date: "",
  country: "",
  city: "",
};

export default function StudentProfileForm({
  profile: initialProfile,
}: {
  profile: Profile;
}) {
  const { loadUser } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    control,
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: initialProfile,
    resolver: zodResolver(profileSchema),
    shouldFocusError: true,
  });
  // higher institutions react hook form field array
  const {
    fields: higher_institutions,
    append: addHigherInstitution,
    remove: removeHigherInstitution,
  } = useFieldArray({
    control,
    name: "higher_institutions",
  });
  // secondary schools react hook form field array
  const {
    fields: secondary_schools,
    append: addSecondarySchool,
    remove: removeSecondarySchool,
  } = useFieldArray({
    control,
    name: "secondary_schools",
  });
  // other school react hook form field array
  const {
    fields: other_education,
    append: addOtherEducation,
    remove: removeOtherEducation,
  } = useFieldArray({
    control,
    name: "other_education",
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!isDirty) {
      setEditMode(false);
      toast.info("You did not make any changes to your profile.");
      return;
    }
    try {
      // Call the server action
      const result = await updateStudentProfile(data);

      if (result.success) {
        toast.success(result.message);
        reset(data);
        setEditMode(false);
        await loadUser({ disableCookieCache: true });
      } else toast.error(result.message);
    } catch {
      toast.error("Network error or server issue. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="mb-1">Personal Information</CardTitle>
            <Button
              type="button"
              onClick={() => {
                if (!editMode) setEditMode(!editMode);
                else
                  handleCancel(
                    reset,
                    setEditMode,
                    removeHigherInstitution,
                    removeSecondarySchool,
                    removeOtherEducation,
                  );
              }}
              className={`flex items-center gap-2 duration-300 ${editMode ? "border border-red-500 bg-transparent text-red-500 hover:bg-red-50" : "hover:bg-primary-300"}`}
            >
              {!editMode ? (
                <>
                  <PenLine /> Edit Profile
                </>
              ) : (
                <>
                  <X /> Cancel
                </>
              )}
            </Button>
          </div>

          <CardDescription>
            Make changes to your profile here. Click &quot;Edit Profile&quot; to
            get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NewFormInput
            name="first_name"
            type="text"
            label="First Name"
            disabled={!editMode}
            error={errors.first_name}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />

          <NewFormInput
            name="last_name"
            type="text"
            label="Last Name"
            disabled={!editMode}
            error={errors.last_name}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
          <NewFormInput
            name="middle_name"
            type="text"
            label="Middle Name"
            disabled={!editMode}
            required={false}
            error={errors.middle_name}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
          <DatePicker
            control={control}
            name="date_of_birth"
            label="Date of Birth"
            disabled={!editMode}
          />
          <NewFormInput
            name="passport_no"
            type="text"
            label="Passport No"
            disabled={!editMode}
            required={false}
            register={register}
            error={errors.passport_no}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
          <DatePicker
            control={control}
            name="passport_expiry_date"
            label="Passport Expiry Date"
            disabled={!editMode}
          />
          <FormSelect
            control={control}
            name="gender"
            label="Gender"
            options={genderOptions}
            disabled={!editMode}
            placeholder="Select gender"
          />

          <FormSelect
            control={control}
            name="marital_status"
            label="Marital Status"
            options={maritalStatusOptions}
            disabled={!editMode}
            placeholder="Select status"
          />

          <NewFormInput
            name="address"
            type="text"
            label="Address"
            disabled={!editMode}
            error={errors.address}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0 md:col-span-2"
          />
          <NewFormInput
            name="phone"
            type="tel"
            label="Phone No"
            disabled={!editMode}
            error={errors.phone}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />

          {/* readonly email */}
          <div>
            <label className="block max-w-max text-sm font-medium text-[#1e1e1e]">
              Email
            </label>
            <input
              name="email"
              readOnly
              disabled
              defaultValue={initialProfile.email}
              className="mt-2.5 block w-full rounded-xl border border-[#EFEFEF] bg-[#EFEFEF] p-4 text-neutral-500 shadow-sm placeholder:text-[#626060] disabled:cursor-not-allowed"
            />
          </div>

          <NewFormInput
            name="next_of_kin.name"
            type="text"
            label="Next of Kin"
            disabled={!editMode}
            error={errors.next_of_kin?.name}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
          <NewFormInput
            name="next_of_kin.address"
            type="text"
            label="Address of Next of Kin"
            disabled={!editMode}
            error={errors.next_of_kin?.address}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
          <NewFormInput
            name="next_of_kin.phone"
            type="tel"
            label="Phone No of Next of Kin"
            disabled={!editMode}
            error={errors.next_of_kin?.phone}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
          <NewFormInput
            name="next_of_kin.email"
            type="email"
            label="Email of Next of Kin"
            disabled={!editMode}
            error={errors.next_of_kin?.email}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
        </CardContent>
      </Card>

      {/* Education Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Education Summary</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            control={control}
            name="highest_education"
            label="Highest Education"
            options={educationOptions}
            disabled={!editMode}
            placeholder="Select education"
            required={false}
          />

          <FormSelect
            control={control}
            name="highest_edu_country"
            label="Country"
            options={countryOptions}
            disabled={!editMode}
            placeholder="Select country"
            required={false}
          />

          <div>
            <NewFormInput
              name="highest_edu_grading_scale"
              type="text"
              label="Grading Scale"
              list="searchable-options"
              disabled={!editMode}
              required={false}
              error={errors.highest_edu_grading_scale}
              register={register}
              className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
            />
            {/* Datalist options */}
            <datalist id="searchable-options">
              {gradingScaleOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <NewFormInput
            name="highest_edu_grade_average"
            type="text"
            label="Grade Average"
            disabled={!editMode}
            required={false}
            error={errors.highest_edu_grade_average}
            register={register}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />
        </CardContent>
      </Card>

      {/* Higher Institution Education */}
      <Card>
        <CardHeader>
          <CardTitle>Higher Institution Education</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {higher_institutions.length === 0 && !editMode && (
            <p className="text-neutral-400">
              No higher institutions added yet.
            </p>
          )}

          {/* TODO: fix this. form not seeing the values when page just load, still asking for values on submit */}
          {higher_institutions.map((inst, idx) => (
            <div
              key={inst.id}
              className="border-b pb-4 last:border-b-0 last:pb-0"
            >
              {/* only show institution count when count is more than 1 */}
              <div
                className={`mb-4 flex items-start gap-4 ${higher_institutions.length > 1 ? "justify-between" : "justify-end"}`}
              >
                {higher_institutions.length > 1 && (
                  <p className="font-bold text-primary-300">
                    Institution {idx + 1}
                  </p>
                )}
                {/* remove institution button */}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => removeHigherInstitution(idx)}
                    className="flex items-center gap-1 rounded-md border border-red-500 bg-white px-2 py-2 text-xs text-red-500 duration-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                    <span className="hidden xs:inline"> Institution</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NewFormInput
                  name={`higher_institutions.${idx}.name`}
                  type="text"
                  label="Name of Institution"
                  disabled={!editMode}
                  error={errors.higher_institutions?.[idx]?.name}
                  register={register}
                  className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
                />
                <FormSelect
                  control={control}
                  name={`higher_institutions.${idx}.country`}
                  label="Country"
                  options={countryOptions}
                  disabled={!editMode}
                  placeholder="Select country"
                />
                <NewFormInput
                  name={`higher_institutions.${idx}.city`}
                  type="text"
                  label="City"
                  disabled={!editMode}
                  error={errors.higher_institutions?.[idx]?.city}
                  register={register}
                  className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
                />
                <DatePicker
                  control={control}
                  name={`higher_institutions.${idx}.attended_from`}
                  label="Attended From"
                  disabled={!editMode}
                />
                <DatePicker
                  control={control}
                  name={`higher_institutions.${idx}.attended_to`}
                  label="Attended To"
                  disabled={!editMode}
                />
                <DatePicker
                  control={control}
                  name={`higher_institutions.${idx}.graduation_date`}
                  label="Graduation Date"
                  disabled={!editMode}
                />
              </div>
            </div>
          ))}
        </CardContent>

        {editMode && (
          <CardFooter className="flex justify-end">
            <CardAction>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={() => addHigherInstitution(defaultInstitution)}
              >
                + Add Institution
              </Button>
            </CardAction>
          </CardFooter>
        )}
      </Card>

      {/* Secondary School Education */}
      <Card>
        <CardHeader>
          <CardTitle>Secondary School Education</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {secondary_schools.length === 0 && !editMode && (
            <p className="text-neutral-400">No secondary schools added yet.</p>
          )}

          {secondary_schools.map((sec, idx) => (
            <div
              key={sec.id}
              className="border-b pb-4 last:border-b-0 last:pb-0"
            >
              {/* show institution count when count is greater than 1 */}
              <div
                className={`mb-4 flex items-start gap-4 ${secondary_schools.length > 1 ? "justify-between" : "justify-end"}`}
              >
                {secondary_schools.length > 1 && (
                  <p className="font-bold text-primary-300">School {idx + 1}</p>
                )}
                {/* remove school button. only show in edit mode*/}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => removeSecondarySchool(idx)}
                    className="flex items-center gap-1 rounded-md border border-red-500 bg-white px-2 py-2 text-xs text-red-500 duration-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                    <span className="hidden xs:inline"> School</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NewFormInput
                  name={`secondary_schools.${idx}.name`}
                  type="text"
                  label="Name of Institution"
                  disabled={!editMode}
                  error={errors.secondary_schools?.[idx]?.name}
                  register={register}
                  className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
                />
                <FormSelect
                  control={control}
                  name={`secondary_schools.${idx}.country`}
                  label="Country"
                  options={countryOptions}
                  disabled={!editMode}
                  placeholder="Select country"
                />
                <NewFormInput
                  name={`secondary_schools.${idx}.city`}
                  type="text"
                  label="City"
                  disabled={!editMode}
                  error={errors.secondary_schools?.[idx]?.city}
                  register={register}
                  className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
                />
                <DatePicker
                  control={control}
                  name={`secondary_schools.${idx}.attended_from`}
                  label="Attended From"
                  disabled={!editMode}
                />
                <DatePicker
                  control={control}
                  name={`secondary_schools.${idx}.attended_to`}
                  label="Attended To"
                  disabled={!editMode}
                />
                <DatePicker
                  control={control}
                  name={`secondary_schools.${idx}.graduation_date`}
                  label="Graduation Date"
                  disabled={!editMode}
                />
              </div>
            </div>
          ))}
        </CardContent>

        {editMode && (
          <CardFooter className="flex justify-end">
            <CardAction>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={() => addSecondarySchool(defaultInstitution)}
              >
                + Add School
              </Button>
            </CardAction>
          </CardFooter>
        )}
      </Card>

      {/* Other Education */}
      <Card>
        <CardHeader>
          <CardTitle>Other Education</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {other_education.length === 0 && !editMode && (
            <p className="text-neutral-400">No other education added.</p>
          )}

          {other_education.map((other, idx) => (
            <div
              key={other.id}
              className="border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div
                className={`mb-4 flex items-start gap-4 ${other_education.length > 1 ? "justify-between" : "justify-end"}`}
              >
                {/* only show institution count when count is greater than 1 */}
                {other_education.length > 1 && (
                  <p className="font-bold text-primary-300">
                    Institution {idx + 1}
                  </p>
                )}

                {/* remove institution button. Only show in edit mode */}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => removeOtherEducation(idx)}
                    className="flex items-center gap-1 rounded-md border border-red-500 bg-white px-2 py-2 text-xs text-red-500 duration-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                    <span className="hidden xs:inline"> Institution</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NewFormInput
                  name={`other_education.${idx}.name`}
                  type="text"
                  label="Name of Institution"
                  disabled={!editMode}
                  error={errors?.other_education?.[idx]?.name}
                  register={register}
                  className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
                />
                <DatePicker
                  control={control}
                  name={`other_education.${idx}.attended_from`}
                  label="Attended From"
                  disabled={!editMode}
                />
                <DatePicker
                  control={control}
                  name={`other_education.${idx}.attended_to`}
                  label="Attended To"
                  disabled={!editMode}
                />
                <DatePicker
                  control={control}
                  name={`other_education.${idx}.graduation_date`}
                  label="Graduation Date"
                  disabled={!editMode}
                />
                <FormSelect
                  name={`other_education.${idx}.country`}
                  label="Country"
                  options={countryOptions}
                  disabled={!editMode}
                  error={errors.other_education?.[idx]?.country}
                  placeholder="Select country"
                  control={control}
                />
                <NewFormInput
                  name={`other_education.${idx}.city`}
                  type="text"
                  label="City"
                  disabled={!editMode}
                  error={errors.other_education?.[idx]?.city}
                  register={register}
                  className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
                />
              </div>
            </div>
          ))}
        </CardContent>

        {editMode && (
          <CardFooter className="flex justify-end">
            <CardAction>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={() => addOtherEducation(defaultInstitution)}
              >
                + Add Institution
              </Button>
            </CardAction>
          </CardFooter>
        )}
      </Card>

      {/* Save/Cancel Buttons */}
      {editMode && (
        <div className="flex items-center justify-between gap-10 sm:justify-end">
          <button
            type="button"
            onClick={() =>
              handleCancel(
                reset,
                setEditMode,
                removeHigherInstitution,
                removeSecondarySchool,
                removeOtherEducation,
              )
            }
            disabled={isSubmitting}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-red-500 p-4 py-3 text-base font-semibold text-red-500 duration-300 hover:bg-red-50"
          >
            <X className="size-4 max-xs:hidden" /> Cancel
          </button>
          <SubmitButton
            isPending={isSubmitting}
            pendingText="Saving..."
            defaultText="Save Changes"
            className="mt-0 w-max cursor-pointer py-3 font-semibold"
          />
        </div>
      )}
    </form>
  );
}
