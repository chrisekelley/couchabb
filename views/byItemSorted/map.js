function(doc) {
  if (doc.formId === "item") {
    emit([doc.lastModified], doc);
  }
};
