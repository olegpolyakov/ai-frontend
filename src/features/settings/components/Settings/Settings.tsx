import { Icon, Tab, TabGroup, TabPanel, Tabs } from '@olegpolyakov/ui';

import { EmbedSettings } from '@/features/embed';
import { IntegrationsSettings } from '@/features/integrations';
import { Memories } from '@/features/memories';

import styles from './Settings.module.scss';

export default function Settings() {
    return (
        <div className={styles.root}>
            <Tabs defaultValue="memories">
                <TabGroup>
                    <Tab
                        start={<Icon name="neurology" />}
                        value="memories"
                        content="Memories"
                    />

                    <Tab
                        start={<Icon name="polyline" />}
                        value="embed"
                        content="Embed"
                    />

                    <Tab
                        start={<Icon name="extension" />}
                        value="integrations"
                        content="Integrations"
                    />
                </TabGroup>

                <TabPanel value="memories">
                    <Memories />
                </TabPanel>

                <TabPanel value="embed">
                    <EmbedSettings />
                </TabPanel>

                <TabPanel value="integrations">
                    <IntegrationsSettings />
                </TabPanel>
            </Tabs>
        </div>
    );
}