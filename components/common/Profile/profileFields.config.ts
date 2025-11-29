/**
 * Profile Fields Configuration
 * Defines which fields to show for each role based on backend schema
 */

import { MaterialIcons } from '@expo/vector-icons';

// Blood types (matching backend)
export const BLOOD_TYPES = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];

// Gender options (matching backend)
export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export interface ProfileField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'textarea' | 'object';
  placeholder?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  fields?: ProfileField[]; // For nested objects like emergencyContact
  helperText?: string;
  isEditable?: boolean;
}

// Common fields for all roles
export const COMMON_FIELDS: ProfileField[] = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter your first name',
    icon: 'person',
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter your last name',
    icon: 'person-outline',
    required: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    type: 'phone',
    placeholder: 'Enter your phone number',
    icon: 'phone',
  },
  {
    key: 'profilePicture',
    label: 'Profile Picture',
    type: 'text', // Will be handled as file upload
    placeholder: 'Profile picture URL',
    icon: 'photo',
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    placeholder: 'Select your date of birth',
    icon: 'calendar-today',
  },
  {
    key: 'gender',
    label: 'Gender',
    type: 'select',
    placeholder: 'Select gender',
    icon: 'person',
    options: GENDER_OPTIONS,
  },
];

// Patient-specific fields
export const PATIENT_FIELDS: ProfileField[] = [
  {
    key: 'bloodType',
    label: 'Blood Type',
    type: 'select',
    placeholder: 'Select blood type',
    icon: 'bloodtype',
    options: BLOOD_TYPES,
    isEditable: true,
  },
  {
    key: 'allergies',
    label: 'Allergies',
    type: 'multiselect',
    placeholder: 'Add allergies (comma separated)',
    icon: 'warning',
    helperText: 'Enter allergies separated by commas',
    isEditable: false,
  },
  {
    key: 'chronicConditions',
    label: 'Chronic Conditions',
    type: 'multiselect',
    placeholder: 'Add chronic conditions (comma separated)',
    icon: 'medical-services',
    helperText: 'Enter conditions separated by commas',
    isEditable: false,
  },
  {
    key: 'medicalRecordNumber',
    label: 'Medical Record Number',
    type: 'text',
    placeholder: 'Enter medical record number',
    icon: 'badge',
    isEditable: false,
  },
//   {
//     key: 'insuranceProvider',
//     label: 'Insurance Provider',
//     type: 'text',
//     placeholder: 'Enter insurance provider name',
//     icon: 'account-balance',
//   },
//   {
//     key: 'insurancePolicyNumber',
//     label: 'Insurance Policy Number',
//     type: 'text',
//     placeholder: 'Enter insurance policy number',
//     icon: 'description',
//   },
  {
    key: 'emergencyContact',
    label: 'Emergency Contact',
    type: 'object',
    icon: 'emergency',
    isEditable: true,
    fields: [
      {
        key: 'name',
        label: 'Contact Name',
        type: 'text',
        placeholder: 'Enter contact name',
        required: true,
      },
      {
        key: 'phone',
        label: 'Contact Phone',
        type: 'phone',
        placeholder: 'Enter contact phone',
        required: true,
      },
      {
        key: 'relation',
        label: 'Relationship',
        type: 'text',
        placeholder: 'e.g., Spouse, Parent, Sibling',
        required: true,
      },
    ],
  },
];

// Doctor/Staff-specific fields
export const DOCTOR_STAFF_FIELDS: ProfileField[] = [
  {
    key: 'specialization',
    label: 'Specialization',
    type: 'text',
    placeholder: 'Enter your specialization',
    icon: 'medical-services',
    isEditable: true,
  },
  {
    key: 'licenseNumber',
    label: 'License Number',
    type: 'text',
    placeholder: 'Enter your license number',
    icon: 'badge',
    isEditable: true,
  },
  {
    key: 'experience',
    label: 'Experience',
    type: 'text',
    placeholder: 'e.g., 5 years',
    icon: 'work',
    helperText: 'Years of experience or description',
    isEditable: true,
  },
];

// Owner-specific fields (currently same as common, but can be extended)
export const OWNER_FIELDS: ProfileField[] = [
  // Owners use same fields as common for now
  // Can add business-specific fields later
];

/**
 * Get fields for a specific role
 */
export function getFieldsForRole(role: string): ProfileField[] {
  const fields: ProfileField[] = [...COMMON_FIELDS];

  switch (role) {
    case 'patient':
      fields.push(...PATIENT_FIELDS);
      break;
    case 'doctor':
    case 'nurse':
    case 'staff':
    case 'receptionist':
      fields.push(...DOCTOR_STAFF_FIELDS);
      break;
    case 'owner':
      fields.push(...OWNER_FIELDS);
      break;
    default:
      // For other roles, just show common fields
      break;
  }

  return fields;
}

/**
 * Get field sections grouped by category
 */
export function getFieldSections(role: string): {
  title: string;
  fields: ProfileField[];
}[] {
  const sections: { title: string; fields: ProfileField[] }[] = [];

  // Personal Information (always shown)
  sections.push({
    title: 'Personal Information',
    fields: COMMON_FIELDS.filter(
      (f) => ['firstName', 'lastName', 'phone', 'profilePicture'].includes(f.key)
    ),
  });

  // Additional Personal Info
  const additionalPersonal = COMMON_FIELDS.filter(
    (f) => ['dateOfBirth', 'gender'].includes(f.key)
  );
  if (additionalPersonal.length > 0) {
    sections.push({
      title: 'Additional Information',
      fields: additionalPersonal,
    });
  }

  // Role-specific sections
  switch (role) {
    case 'patient':
      sections.push({
        title: 'Medical Information',
        fields: PATIENT_FIELDS.filter(
          (f) => ['bloodType', 'allergies', 'chronicConditions', 'medicalRecordNumber'].includes(f.key)
        ),
      });
    //   sections.push({
    //     title: 'Insurance Information',
    //     fields: PATIENT_FIELDS.filter(
    //       (f) => ['insuranceProvider', 'insurancePolicyNumber'].includes(f.key)
    //     ),
    //   });
      sections.push({
        title: 'Emergency Contact',
        fields: PATIENT_FIELDS.filter((f) => f.key === 'emergencyContact'),
      });
      break;
    case 'doctor':
    case 'nurse':
    case 'staff':
    case 'receptionist':
      sections.push({
        title: 'Professional Information',
        fields: DOCTOR_STAFF_FIELDS,
      });
      break;
    case 'owner':
      // Owners can have additional sections if needed
      break;
  }

  return sections;
}

