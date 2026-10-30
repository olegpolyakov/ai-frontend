import { useState } from 'react';

import { Button, Dialog } from '@olegpolyakov/ui';

import Settings from '../Settings';

export default function SettingsButton() {
    const [isOpen, setOpen] = useState(false);

    return (<>
        <Button
            icon="settings"
            onClick={() => setOpen(true)}
        />

        <Dialog
            open={isOpen}
            onClose={() => setOpen(false)}
        >
            <Settings />
        </Dialog>
    </>);
}