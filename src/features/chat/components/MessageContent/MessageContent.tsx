import Markdown from '@olegpolyakov/frontend/components/Markdown';

import styles from './MessageContent.module.scss';

export default function MessageContent({
    content
}: {
    content: string;
}) {
    return (
        <div className={styles.root}>
            <Markdown content={content}/>
        </div>
    );
}
