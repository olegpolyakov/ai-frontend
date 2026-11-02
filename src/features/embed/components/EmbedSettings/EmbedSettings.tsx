import { Field, Select } from '@olegpolyakov/ui';

import { useModelsContext } from '@/features/models';

export default function EmbedSettings() {
    const { models } = useModelsContext();

    const embedModels = models.filter(m => m.id.includes('embed'));

    return (
        <div>
            <Field
                label="Embed model"
                orientation="horizontal"
            >
                <Select
                    options={embedModels.map(m => ({
                        key: m.id,
                        value: m.id,
                        content: m.id
                    }))}
                />
            </Field>
        </div>
    );
}