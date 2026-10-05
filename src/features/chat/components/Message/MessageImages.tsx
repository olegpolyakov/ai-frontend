import type { MessageImage } from '../../types';

import styles from './Message.module.scss';

export default function MessageImages({ images = [] }: {
    images?: MessageImage[];
}) {
    return images
        .filter((image): image is MessageImage & { url: string } => Boolean(image.url))
        .map(image => (
            <a
                key={image.path}
                className={styles.image}
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src={image.url} alt="" />
            </a>
        ));
}
