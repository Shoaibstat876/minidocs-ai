export type ShareDoc = {
  ownerId: string;
  sharedWith: string[];
};

export function canUserAccessDocument(doc: ShareDoc, userId: string) {
  return doc.ownerId === userId || doc.sharedWith.includes(userId);
}

export function canUserShareDocument(doc: ShareDoc, userId: string) {
  return doc.ownerId === userId;
}