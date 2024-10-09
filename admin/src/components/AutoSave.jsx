import { useEffect } from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { getFetchClient } from '@strapi/helper-plugin';

const AutoSaveComponent = () => {
  const { modifiedData, initialData, hasDraftAndPublish, allLayoutData } = useCMEditViewDataManager();
  const { put } = getFetchClient();
  let timer;
  const isPublished = !!modifiedData.publishedAt;
  useEffect(() => {
    if (isPublished || !hasDraftAndPublish) {
      return;
    }
    const hasDataChanged = () => {
      return JSON.stringify(modifiedData) !== JSON.stringify(initialData);
    };

    if (hasDataChanged()) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        if (hasDataChanged()) {
          await put(`/content-manager/collection-types/${allLayoutData.contentType.uid}/${modifiedData.id}`, modifiedData);
        }
      }, 1000);
    }
  }, [modifiedData, initialData]);

  return null;
};

export default AutoSaveComponent;
