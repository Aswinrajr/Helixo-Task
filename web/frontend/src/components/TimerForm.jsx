import React, { useState, useCallback } from 'react';
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  InlineStack,
  Box,
  Text,
  Divider,
  Modal,
  ResourceList,
  Avatar
} from '@shopify/polaris';
// import { ResourcePicker } from '@shopify/app-bridge-react'; // Commented out for local preview compatibility

/**
 * Professional timer creation form with conditional logic and Shopify Resource Picker.
 */
const TimerForm = ({ onBack }) => {
  const [timerTitle, setTimerTitle] = useState('');
  const [timerType, setTimerType] = useState('fixed');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Configuration State
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');

  const handleTypeChange = useCallback((value) => setTimerType(value), []);

  const handleSelection = (resources) => {
    const products = resources.selection.map((product) => ({
      id: product.id,
      title: product.title
    }));
    setSelectedProducts(products);
    setIsPickerOpen(false);
  };

  const handleSaveTimer = async () => {
    const payload = {
      title: timerTitle,
      type: timerType,
      startTime: startDateTime,
      endTime: endDateTime,
      durationMinutes: parseInt(durationMinutes),
      applyTo: selectedProducts.length > 0 ? 'specific_products' : 'all',
      productIds: selectedProducts.map(p => p.id)
    };

    console.log('Saving Timer Configuration:', payload);
    // In production: await fetch('/api/timers', { method: 'POST', body: JSON.stringify(payload) })
  };

  return (
    <Page 
      title="Create New Timer" 
      backAction={{ content: 'Back', onAction: onBack }}
      primaryAction={{
        content: 'Save Timer',
        onAction: handleSaveTimer,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <FormLayout>
              <TextField
                label="Timer Title"
                value={timerTitle}
                onChange={(val) => setTimerTitle(val)}
                autoComplete="off"
                helpText="Visible on your product page banner."
              />
              
              <Select
                label="Timer Type"
                options={[
                  { label: 'Fixed Date (Specific end time)', value: 'fixed' },
                  { label: 'Evergreen (Resets per visitor)', value: 'evergreen' },
                ]}
                onChange={handleTypeChange}
                value={timerType}
              />

              <Divider />

              {timerType === 'fixed' ? (
                <FormLayout.Group>
                  <TextField
                    type="datetime-local"
                    label="Starts At"
                    value={startDateTime}
                    onChange={(val) => setStartDateTime(val)}
                  />
                  <TextField
                    type="datetime-local"
                    label="Ends At"
                    value={endDateTime}
                    onChange={(val) => setEndDateTime(val)}
                  />
                </FormLayout.Group>
              ) : (
                <TextField
                  label="Duration (Minutes)"
                  type="number"
                  value={durationMinutes}
                  onChange={(val) => setDurationMinutes(val)}
                  suffix="min"
                />
              )}
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <Text variant="headingMd" as="h2">Targeting</Text>
            <Box paddingBlockStart="200">
              <Text as="p">Choose which products will show this timer.</Text>
              <Box paddingBlockStart="400">
                <Button onClick={() => setIsPickerOpen(true)}>
                  {selectedProducts.length > 0 ? 'Change Selection' : 'Select Products'}
                </Button>
              </Box>
              
              {selectedProducts.length > 0 && (
                <Box paddingBlockStart="200">
                  <Text variant="bodySm" tone="subdued">
                    Selected {selectedProducts.length} product(s)
                  </Text>
                </Box>
              )}
            </Box>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Mock Resource Picker for Demo Purposes */}
      <Modal
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Select Products"
        primaryAction={{
          content: 'Add Products',
          onAction: () => {
            handleSelection({
              selection: [
                { id: 'gid://shopify/Product/1', title: 'Example Product A' },
                { id: 'gid://shopify/Product/2', title: 'Example Product B' }
              ]
            });
          },
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setIsPickerOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <ResourceList
            resourceName={{ singular: 'product', plural: 'products' }}
            items={[
              { id: '1', name: 'Example Product A', price: '$20.00' },
              { id: '2', name: 'Example Product B', price: '$45.00' },
            ]}
            renderItem={(item) => {
              const { id, name, price } = item;
              return (
                <ResourceList.Item id={id} accessibilityLabel={`View details for ${name}`}>
                  <InlineStack align="space-between">
                    <Text variant="bodyMd" fontWeight="bold">{name}</Text>
                    <Text as="span" tone="subdued">{price}</Text>
                  </InlineStack>
                </ResourceList.Item>
              );
            }}
          />
        </Modal.Section>
      </Modal>

      {/* 
        PRO TIP: In a real Shopify environment, we would use:
        <ResourcePicker
          resourceType="Product"
          open={isPickerOpen}
          onSelection={handleSelection}
          onCancel={() => setIsPickerOpen(false)}
        />
      */}
    </Page>
  );
};

export default TimerForm;
