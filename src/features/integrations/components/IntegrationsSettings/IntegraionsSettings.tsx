import { useState } from 'react';

import { Button, Flex, Item, List, State, Switch, Text } from '@olegpolyakov/ui';

import useIntegrationsContext from '../../hooks/useIntegrationsContext';
import type { Integration } from '../../types';
import IntegrationForm from '../IntegrationForm';

export default function IntegraionsSettings() {
    const {
        integrations,
        createIntegration,
        updateIntegration,
        deleteIntegration
    } = useIntegrationsContext();

    const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
    const [isCreating, setCreating] = useState(false);

    return (
        <div>
            {integrations.length === 0 ?
                <State
                    description="No integrations"
                    action={
                        <Button
                            content="New integration"
                            onClick={() => setCreating(true)}
                        />
                    }
                />
                :
                <List as="div">
                    {integrations.map(i => 
                        <Item
                            key={i.id}
                            content={i !== editingIntegration ?
                                <Flex column>
                                    <Text content={i.name} />
                                    <Text
                                        content={i.url}
                                        color="secondary"
                                        size="s"
                                        ellipsis
                                    />
                                </Flex>
                                :
                                <IntegrationForm
                                    data={editingIntegration}
                                    onSubmit={(async data => {
                                        updateIntegration(editingIntegration.id, data);
                                        setEditingIntegration(null);
                                    })}
                                    onCancel={() => setEditingIntegration(null)}
                                />
                            }
                            end={i !== editingIntegration &&
                                <Flex gap="xs">
                                    <Switch
                                        checked={i.enabled}
                                        onChange={({ checked }) => updateIntegration(i.id, { enabled: checked })}
                                    />

                                    <Button
                                        icon="edit"
                                        title="Edit"
                                        size="s"
                                        onClick={() => setEditingIntegration(i)}
                                    />

                                    <Button
                                        icon="delete"
                                        title="Delete"
                                        color="danger"
                                        size="s"
                                        onClick={() => deleteIntegration(i.id)}
                                    />
                                </Flex>
                            }
                        />
                    )}
                </List>
            }
            
            {isCreating &&
                <IntegrationForm
                    title="New integration"
                    onSubmit={(async data => {
                        createIntegration(data);
                    })}
                    onCancel={() => setCreating(false)}
                />
            }

            {/* {!isCreating &&
                <Button
                    content="New integration"
                    onClick={() => setCreating(true)}
                />
            } */}
        </div>
    );
}