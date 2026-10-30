import { useEffect, useState } from 'react';

import { Button, List } from '@olegpolyakov/ui';
import { useAuthContext } from '@olegpolyakov/frontend/features/auth';

import { API_URL } from '@/env';

import useMemoriesApi from '../../hooks/useMemoriesApi';
import type { Memory } from '../../types';

const icons = {
    preference: 'thumb_up',
    project: 'folder',
    goal: 'target',
    skill: 'star',
    fact: 'fact_check',
    relationship: 'groups'
};

export default function Memories() {
    const { accessToken } = useAuthContext();
    const api = useMemoriesApi(API_URL, accessToken);

    const [memories, setMemories] = useState<Memory[]>([]);

    useEffect(() => {
        api.getMemories()
            .then(memories => setMemories(memories.sort((a, b) => a.importance - b.importance)));
    }, [api]);

    return (
        <div>
            <List
                items={memories.map(m => ({
                    key: m.id,
                    icon: {
                        name: icons[m.type],
                        size: 's'
                    },
                    content: m.content,
                    end: (
                        <Button
                            icon="delete"
                            color="danger"
                            size="s"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this memory?')) {
                                    api.deleteMemory(m.id);
                                }
                            }}
                        />
                    )
                }))}
                size="s"
            />
        </div>
    );
}