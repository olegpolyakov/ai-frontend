import { useMemo } from 'react';

import { Button, Item, Text } from '@olegpolyakov/ui';
import { useAuthContext } from '@olegpolyakov/frontend/features/auth';
import { useFiles } from '@olegpolyakov/frontend/features/files';
import { useHttp } from '@olegpolyakov/frontend/services/http';

import { FILES_API_URL } from '@/env';

import { getFileIconName, getFileSizeString } from '../../helpers';

import styles from './MessageFiles.module.scss';

export default function MessageFiles({
    fileIds = []
}: {
    fileIds?: string[];
}) {
    const { accessToken = '' } = useAuthContext();
    const http = useHttp(
        FILES_API_URL, 
        useMemo(() => ({ accessToken }), [accessToken])
    );
    const { filesById, isLoading } = useFiles(http, fileIds);

    if (!fileIds?.length || isLoading) return null;

    return (
        <div className={styles.root}>
            {fileIds.map(id => filesById[id])
                .map(file => file.type.startsWith('image') ?
                    <picture
                        key={file.id}
                        className={styles.image}
                    >
                        <img
                            src={file.url}
                            alt=""
                        />
                    </picture>
                    :
                    <Item
                        key={file.id}
                        className={styles.file}
                        icon={{
                            name: getFileIconName(file.name),
                            size: 'm'
                        }}
                        content={
                            <div className={styles.info}>
                                <Text
                                    content={file.name}
                                    size="s"
                                />

                                {file.size !== undefined && (
                                    <Text
                                        content={getFileSizeString(file.size)}
                                        color="tertiary"
                                        size="xs"
                                    />
                                )}
                            </div>
                        }
                        end={
                            <Button
                                className={styles.downloadButton}
                                as="a"
                                icon="download"
                                href={file.url}
                                title="Download"
                                size="s"
                                download={file.name}
                            />
                        }
                        shape="rounded-s"
                        variant="outlined-tinted"
                    />
                )}
        </div>
    );
}