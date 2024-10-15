import { useEffect } from 'react';
import { useCMEditViewDataManager, getFetchClient } from '@strapi/helper-plugin';

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
      console.log('changed');
      document.querySelector('button[type="submit"]').setAttribute('aria-disabled', 'false');
      document.querySelector('main button[type="button"]').setAttribute('aria-disabled', 'true');

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        if (hasDataChanged()) {
          try {
            const result = await put(`/content-manager/collection-types/${allLayoutData.contentType.uid}/${modifiedData.id}`, modifiedData);
            if (result.status < 400) return;
            document.querySelector('button[type="submit"]').setAttribute('aria-disabled', 'true');
            document.querySelector('main button[type="button"]').setAttribute('aria-disabled', 'false');
          } catch (e) {
            console.error({ errorDuringAutosaving: e });
          }
        }
      }, 1000);
    }
  }, [modifiedData, initialData]);

  return null;
};

export default AutoSaveComponent;
