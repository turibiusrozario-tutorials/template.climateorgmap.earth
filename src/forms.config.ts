// Fallback links to the Google Forms, used by the + button and "Update this info" links.
//
// A map doesn't need to fill this in: the sheet's web app sends its forms' links and question ids with the data
// (data.forms, see src/forms.live.ts and apps-script/Code.gs → siteForms_()). These values are only used when the
// data has none (an older sheet script). Until there are forms, the + button explains they aren't connected yet.

export interface FormLink {
  url: string;
  /** "entry.N" ids that let the site pre-fill a question. */
  orgEntry?: string;
  hostOrgEntry?: string;
  coalitionEntry?: string;
  /** The "Which event / project / action is this about?" question, so a map click can pre-select that item. */
  itemEntry?: string;
}

export const FORMS: Record<"org" | "event" | "project" | "action" | "feedback", FormLink> = {
  org: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeQ4MOk9YHT7XX9UTaOEpQrofLU-uqyXVOuu9yEZzGrHzvGpw/viewform",
    orgEntry: "entry.1787507842",
  },
  event: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLSe6jLOWOLU0sZdsiqMcfABsQpSRKyXWocWi4nj_ZRDVtNfxUQ/viewform",
    hostOrgEntry: "entry.250607576",
    coalitionEntry: "entry.1780232957",
    itemEntry: "entry.1447795421",
  },
  project: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLSe4CpR61Iklqh4U24rcEtqs-0XyxkaMYd2jcMmymHGuFRqM2g/viewform",
    hostOrgEntry: "entry.207544512",
    coalitionEntry: "entry.13985344",
    itemEntry: "entry.378180696",
  },
  action: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeLrAB0TWK_wPxRTalxvTH8lWuQywrjKTTfEem237X3CdcvXg/viewform",
    hostOrgEntry: "entry.973662534",
    coalitionEntry: "entry.711840281",
    itemEntry: "entry.1959573726",
  },
  feedback: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLScwazw1P9rbQT4KAoUn0DSuI6B9Lpdx-kcrZXdZV45-HlAVKw/viewform",
  },
};
