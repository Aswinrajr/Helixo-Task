import React, { useState, useEffect, useCallback } from 'react';
import { 
  Page, 
  Layout, 
  Card, 
  IndexTable, 
  Badge, 
  Text, 
  Button, 
  EmptyState,
  SkeletonBodyText 
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';

/**
 * The main administrative dashboard for managing countdown timers.
 * Demonstrates clean React patterns and robust state handling.
 */
const TimerDashboard = ({ onCreateClick }) => {
  const [timersList, setTimersList] = useState([]);
  const [isFetchingTimers, setIsFetchingTimers] = useState(true);
  const [errorState, setErrorState] = useState(null);

  const fetchShopTimers = useCallback(async () => {
    setIsFetchingTimers(true);
    try {
      // In a real app, this would use authenticatedFetch from @shopify/app-bridge-next
      const response = await fetch('/api/timers'); 
      const result = await response.json();
      
      if (result.status === 'success') {
        setTimersList(result.data.timers);
      }
    } catch (error) {
      console.error('Failed to load timers:', error);
      setErrorState('Could not load your timers. Please try again.');
    } finally {
      setIsFetchingTimers(false);
    }
  }, []);

  useEffect(() => {
    fetchShopTimers();
  }, [fetchShopTimers]);

  const renderStatusBadge = (status) => {
    const statusMap = {
      active: <Badge tone="success">Active</Badge>,
      scheduled: <Badge tone="info">Scheduled</Badge>,
      expired: <Badge tone="warning">Expired</Badge>,
      disabled: <Badge tone="critical">Disabled</Badge>,
    };
    return statusMap[status] || <Badge>{status}</Badge>;
  };

  const rowMarkup = timersList.map(
    ({ id, title, type, status, analytics }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{type === 'fixed' ? 'Fixed Date' : 'Evergreen'}</IndexTable.Cell>
        <IndexTable.Cell>{renderStatusBadge(status)}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" numeric>
            {analytics.impressionCount.toLocaleString()}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button variant="tertiary" onClick={() => console.log('Edit', id)}>Edit</Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  if (isFetchingTimers) {
    return (
      <Page title="Your Timers">
        <Card>
          <SkeletonBodyText lines={5} />
        </Card>
      </Page>
    );
  }

  return (
    <Page 
      title="Countdown Timers" 
      subtitle="Create urgency and boost conversions with targeted timers."
      primaryAction={{
        content: 'Create Timer',
        icon: PlusIcon,
        onAction: onCreateClick,
      }}
    >
      <Layout>
        <Layout.Section>
          {timersList.length === 0 ? (
            <EmptyState
              heading="Start boosting your sales"
              action={{ content: 'Create your first timer', onAction: onCreateClick }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Add a countdown timer to your product pages to encourage immediate purchases.</p>
            </EmptyState>
          ) : (
            <Card padding="0">
              <IndexTable
                resourceName={{ singular: 'timer', plural: 'timers' }}
                itemCount={timersList.length}
                headings={[
                  { title: 'Timer Title' },
                  { title: 'Type' },
                  { title: 'Status' },
                  { title: 'Impressions' },
                  { title: 'Actions' },
                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default TimerDashboard;
