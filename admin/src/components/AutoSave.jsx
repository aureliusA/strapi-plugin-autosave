import { useEffect } from 'react';
import { useCMEditViewDataManager, getFetchClient } from '@strapi/helper-plugin';
const { put } = getFetchClient();

async function updateData(uid, modifiedData) {
  const result = await put(`/content-manager/collection-types/${uid}/${modifiedData.id}`, modifiedData);
  if (result.status >= 400) return;
  document.querySelector('button[type="submit"]').setAttribute('aria-disabled', 'true');
  document.querySelector('main button[type="button"]').setAttribute('aria-disabled', 'false');
}

const AutoSaveComponent = () => {
  const { modifiedData, initialData, hasDraftAndPublish, allLayoutData } = useCMEditViewDataManager();
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
      document.querySelector('button[type="submit"]').setAttribute('aria-disabled', 'false');
      document.querySelector('main button[type="button"]').setAttribute('aria-disabled', 'true');

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        if (hasDataChanged()) {
          try {
            await updateData(allLayoutData.contentType.uid, modifiedData);
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
