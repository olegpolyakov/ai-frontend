import { Heading, Icon, Tab, TabGroup, TabPanel, Tabs } from '@olegpolyakov/ui';

import { EmbedSettings } from '@/features/embed';
import { Memories } from '@/features/memories';

import styles from './Settings.module.scss';

export default function Settings() {
    return (
        <div className={styles.root}>
            <Heading content="Settings" />
            
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
                </TabGroup>

                <TabPanel value="memories">
                    <Memories />
                </TabPanel>

                <TabPanel value="embed">
                    <EmbedSettings />
                </TabPanel>
            </Tabs>
        </div>
    );
}