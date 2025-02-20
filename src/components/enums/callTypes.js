 const IncomingCallsType = {
  SOCIAL_EMERGENCY: "Social Emergencies",
  HEALTH_EMERGENCY: "Health Emergencies",
  LONELINESS_CRISIS: "Loneliness or Distress Crisis",
  UNANSWERED_ALARM: "Unanswered Alarm",
  NOTIFY_ABSENCE_RETURN: "Notify Absences or Returns",
  MODIFY_PERSONAL_DATA: "Modify Personal Data",
  ACCIDENTAL_CALL: "Accidental Calls",
  REQUEST_INFORMATION: "Request Information",
  SUGGESTIONS_COMPLAINTS: "Suggestions, Complaints or Claims",
  SOCIAL_CALL: "Social Calls (to greet or talk with staff)",
  REGISTER_MEDICAL_APPOINTMENT: "Register Medical Appointments from a Call",
  OTHER_CALLS: "Other Types of Calls",

  
}

 const OutgoingCallsType = {
  FOLLOW_UP_AFTER_NOTICE_OR_HOSPITALIZATION: "Follow-up after notice or hospitalization",
  CHECK_IF_PERSON_IS_OK: "Check if person is okay",
  FOLLOW_UP_ON_ACTIVATED_ALARM: "Follow-up on activated alarm",
  GENERAL_UNEXPECTED_EMERGENCIES: "General unexpected emergencies",
  FOLLOW_UP_CALL_MEDICATION: "Follow-up call regarding medication",
}

function values(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

export { IncomingCallsType, OutgoingCallsType, values };

