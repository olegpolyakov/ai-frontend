import { Button, Icon, Text } from '@olegpolyakov/ui';
import cn from '@olegpolyakov/frontend/helpers/classnames';

import { getFileIconName, getFileSizeString } from '../../helpers';
import type { MessageFile } from '../../types';

import styles from './MessageFiles.module.scss';

export default function MessageFiles({ files, isMine }: {
    files?: MessageFile[];
    isMine?: boolean;
}) {
    if (!files?.length) return null;

    return (
        <div className={cn(styles.root, isMine && styles.mine)}>
            {files.map(file => (
                <div key={file.path} className={styles.file}>
                    <Icon name={getFileIconName(file.name)} />

                    <div className={styles.info}>
                        <Text
                            className={styles.name}
                            content={file.name}
                            size="s"
                        />

                        {file.size !== undefined && (
                            <Text
                                className={styles.size}
                                content={getFileSizeString(file.size)}
                                color="tertiary"
                                size="xs"
                            />
                        )}
                    </div>

                    <Button
                        className={styles.downloadButton}
                        as="a"
                        icon="download"
                        href={file.url}
                        title="Скачать файл"
                        size="s"
                        download={file.name}
                    />
                </div>
            ))}
        </div>
    );
}