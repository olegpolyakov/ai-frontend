import Markdown from '@olegpolyakov/frontend/components/Markdown';

import styles from './Message.module.scss';

export default function MessageContent({ content }: {
    content: string;
}) {
    return (
        <div className={styles.content}>
            <Markdown content={content}/>
        </div>
    );
}
