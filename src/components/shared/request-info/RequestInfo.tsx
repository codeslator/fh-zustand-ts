import { FC, useEffect, useState } from 'react';
import { tesloApi } from '../../../api/teslo.api';

export const RequestInfo: FC = ({}) => {
  const [requestInfo, setRequestInfo] = useState<unknown>();

  useEffect(() => {
    tesloApi.get('/auth/private')
      .then((response) => setRequestInfo(response.data))
      .catch(() => setRequestInfo('Error'))
  }, []);

  return (
    <>
      <h2>Informacion</h2>
      <pre>
        {JSON.stringify(requestInfo)}
      </pre>
    </>
  );
};